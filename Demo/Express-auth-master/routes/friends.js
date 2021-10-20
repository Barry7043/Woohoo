const express = require("express");
const router = express.Router();
const { Friend } = require("../modules/mongodb");
const { authMiddleware } = require("../utils/pip");

router.post("/add", authMiddleware, (req, res, next) => {
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    var sex = req.body.sex
    var wechat = req.body.wechat
    var ageRange = req.body.ageRange || [];
    var ageStart = ageRange[0]
    var ageEnd = ageRange[1]
    console.log(req.user)
    if (!title || !content) { return res.send({ code: 400, message: "The data is incomplete, please complete the contents" }) };
    Friend.create({
        title,
        content,
        imgs,
        wechat,
        ageStart,
        ageEnd,
        sex,
        createUser: req.user._id
    }).then(result => {
        res.send({
            code: 200,
            message: " Post successfully!"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/detail", (req, res, next) => {
    var id = req.query.id;
    console.log(id)
    if (!id) return res.send({ code: 400, message: "Request parameter missing" });
    Friend.findById(id).populate("createUser", { nickname: 1, logo: 1 }).select({ wechat: 0 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/list", (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Friend.find({ title: reg }).populate("createUser", { nickname: 1, logo: 1 }).select({ wechat: 0 }).sort({ createTime: -1 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/listOfMine", authMiddleware, (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Friend.find({ createUser: req.user._id, title: reg }).populate("createUser", { nickname: 1, logo: 1 }).sort({ createTime: -1 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/edit", (req, res, next) => {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    var sex = req.body.sex
    var wechat = req.body.wechat
    var ageRange = req.body.ageRange || [];
    var ageStart = ageRange[0]
    var ageEnd = ageRange[1]
    if (!id || !content) return res.send({ code: 400, message: "Request parameter missing" });
    Friend.findByIdAndUpdate(id, {
        title,
        content,
        imgs,
        wechat,
        ageStart,
        ageEnd,
        sex,
    }).then(result => {
        res.send({
            code: 200,
            message: "Modify successfully"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/updatePopularity", async (req, res, next) => {
    var id = req.body.id;
    Friend.findByIdAndUpdate(id, { $inc: { popularity: 1 } }).then(result => {
        res.send({ code: 200, message: "Popularity update successful" });
    }).catch(err => {
        console.log(err)
        res.send({ code: 500, message: "Operation failure" })
    })
})

router.get("/getWechat", authMiddleware, (req, res, next) => {
    var id = req.query.id;
    console.log(id)
    Friend.findById(id, { wechat: 1 }).then(result => {
        console.log(result);
        res.send({ code: 200, message: "Obtain publisher Email successfully", data: result.wechat })
    })
})

router.post("/delete", (req, res, next) => {
    var id = req.body.id;
    console.log(req.body)
    Friend.findOneAndDelete({ _id: id }).then(result => {
        res.send({ code: 200, message: "successfully delete" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/deleteGroup", (req, res, next) => {
    var ids = req.body.ids;
    console.log(req.body)
    Friend.deleteMany({ _id: ids }).then(result => {
        res.send({ code: 200, message: "successfully delete" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

module.exports = router;