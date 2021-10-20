const express = require("express");
const router = express.Router();
const { Comment } = require("../modules/mongodb");
const { authMiddleware } = require("../utils/pip");

router.post("/add", authMiddleware, (req, res, next) => {
  console.log(req.body)
  var articleId = req.body.articleId;  // 帖子的id
  var message = req.body.message;
  var toUser = req.body.toUser;
  var toName = req.body.toName;
  var fromUser = req.body.fromUser;
  var fromName = req.body.fromName;
  var commentId = req.body.commentId;

  var type = req.body.type;  // 帖子类型

  console.log(articleId, message, toUser, toName, fromUser, fromName, type, commentId);
  if (!articleId || !message || !fromUser || !fromName || !type) {
    return res.send({ code: 400, message: "Parameter information item missing" })
  }

  var params = {
    articleId,
    message,
    fromUser,
    fromName,
    type,
  }

  if (commentId) {
    params.toUser = toUser;
    params.toName = toName;
    params.commentId = commentId;
  }

  Comment.create({
    ...params
  }).then(result => {
    res.send({ code: 200, message: "Comment on success" })
  }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/list", (req, res, next) => {
  var id = req.query.id;
  var type = req.query.type;
  if (!id || !type) return res.send({ code: 400, message: "Request parameter missing" });
  Comment.find({ articleId: id, type }).populate("fromUser", { nickname: 1, logo: 1 }).populate("toUser", { nickname: 1, logo: 1 }).lean().then(result => {
    let list = [];
    result.map(v => {
      let index = list.findIndex(item => item._id == v.commentId);
      if (index == -1 && !v.commentId) {
        v.children = [];
        list.push(v);
      } else {
        list[index].children.push(v);
      }
    })
    // console.log(list)
    res.send({ code: 200, message: "Query comment successful", data: list })
  }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/delete", authMiddleware, (req, res, next) => {
  var id = req.body.id;
  var fromUser = req.body.fromUser;
  var toUser = req.body.toUser;
  if (!id) return res.send({ code: 400, message: "Request parameter missing" });
  if (req.user._id != fromUser && req.user._id != toUser && req.user.type != 1) { return res.send({ code: 403, message: "The user does not have permission to delete this record" }) }
  Comment.findOneAndDelete({ _id: id }).then(result => {
    res.send({ code: 200, message: "successfully delete" })
  }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

module.exports = router