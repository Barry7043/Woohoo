const express = require("express");
const router = express.Router();
const { Post } = require("../modules/mongodb");
const { authMiddleware } = require("../utils/pip");

router.post("/add", authMiddleware, (req, res, next) => {
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    console.log(req.user)
    if (!title || !content || !imgs) { return res.send({ code: 400, message: "Data Incomplete!" }) };
    Post.create({
        title,
        content,
        imgs,
        createUser: req.user._id
    }).then(result => {
        res.send({
            code: 200,
            message: "Post Successed"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.get("/detail", (req, res, next) => {
    var id = req.query.id;
    console.log(id)
    if (!id) return res.send({ code: 400, message: "Missing Required Variable" });
    Post.findById(id).populate("createUser").then(result => {
        res.send({ code: 200, message: "SUCCESS", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.get("/list", (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Post.find({ title: reg }).populate("createUser").then(result => {
        res.send({ code: 200, message: "SUCCESS", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.get("/listOfMine", authMiddleware, (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Post.find({ createUser: req.user._id, title: reg }).populate("createUser").sort({createTime: -1}).then(result => {
        res.send({ code: 200, message: "SUCCESS", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.post("/edit", (req, res, next) => {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    if (!id) return res.send({ code: 400, message: "Missing Required Variable" });
    Post.findByIdAndUpdate(id, {
        title,
        content,
        imgs
    }).then(result => {
        res.send({
            code: 200,
            message: "Setting Successed"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.post("/delete", (req, res, next) => {
    var id = req.body.id;
    console.log(req.body)
    Post.findOneAndDelete({ _id: id }).then(result => {
        res.send({ code: 200, message: "Delete Successed" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

router.post("/deleteGroup", (req, res, next) => {
    var ids = req.body.ids;
    console.log(req.body)
    Post.deleteMany({ _id: ids }).then(result => {
        res.send({ code: 200, message: "Delete Successed" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server Error" }) })
})

module.exports = router;
