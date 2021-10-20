const express = require("express");
const router = express.Router();
const { Product, UsersWant } = require("../modules/mongodb");
const UserSchema = require("../modules/users");
const { authMiddleware } = require("../utils/pip");

router.post("/add", authMiddleware, (req, res, next) => {
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    var price = req.body.price
    var wechat = req.body.wechat;
    var isPublish = req.body.isPublish - 0 ? 1 : 2;
    if (isPublish == 1 && !wechat) { return res.send({ code: 400, message: "In case Email is public, enter Email" }) };
    if (!title || !content || !price || !wechat) { return res.send({ code: 400, message: "The data is incomplete, please complete the contents" }) };
    Product.create({
        title,
        content,
        imgs,
        price,
        wechat,
        isPublish,
        createUser: req.user._id
    }).then(result => {
        res.send({
            code: 200,
            message: "Post successfully"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/detail", (req, res, next) => {
    var id = req.query.id;
    console.log(id)
    if (!id) return res.send({ code: 400, message: "Request parameter missing" });
    Product.findById(id).select({ wechat: 0 }).populate("createUser", { nickname: 1, logo: 1 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/list", (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Product.find({ title: reg }).select({ wechat: 0 }).select({ wechat: 0 }).populate("createUser", { nickname: 1, logo: 1 }).sort({ createTime: -1 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.get("/listOfMine", authMiddleware, (req, res, next) => {
    var keywords = req.query.keywords;
    var reg = new RegExp(keywords ? ".*" + keywords + ".*" : ".*")
    Product.find({ createUser: req.user._id, title: reg }).populate("createUser", { nickname: 1, logo: 1 }).sort({ createTime: -1 }).then(result => {
        res.send({ code: 200, message: "Successfully", data: result })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/edit", authMiddleware, (req, res, next) => {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var imgs = req.body.imgs && req.body.imgs.join(",");
    var price = req.body.price
    var wechat = req.body.wechat;
    var isPublish = req.body.isPublish;
    if (!id || !content) return res.send({ code: 400, message: "Request parameter missing" });
    Product.findByIdAndUpdate(id, {
        title,
        content,
        imgs,
        price,
        wechat,
        isPublish
    }).then(result => {
        res.send({
            code: 200,
            message: "Modify successfully"
        })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/updateWantNum", authMiddleware, async (req, res, next) => {
    var id = req.body.id;

    const existData = await UsersWant.find({ pId: id, uId: req.user._id }).then(result => result)

    if (existData && existData.length > 0) { return res.send({ code: 500, message: 'You have already indicated that you want it' }) };

    Product.findByIdAndUpdate(id, { $inc: { wantNum: 1 } }).then(result => {
        return result;
    }).then(result => {
        UsersWant.create({
            pId: id,
            uId: req.user._id
        }).then(result => {
            res.send({ code: 200, message: "The user clicks I want to succeed" });
        }).catch(err => { res.send({ code: 500, message: "Inserting (I want) message returns an error" }) })
    }).catch(err => {
        console.log(err)
        res.send({ code: 500, message: "Operation failure" })
    })
})

router.get("/getWechat", authMiddleware, (req, res, next) => {
    var id = req.query.id;
    console.log(id)
    Product.findById(id, { wechat: 1 }).then(result => {
        console.log(result);
        res.send({ code: 200, message: "Obtain publisher Email successfully", data: result.wechat })
    })
})

router.post("/delete", (req, res, next) => {
    var id = req.body.id;
    console.log(req.body)
    Product.findOneAndDelete({ _id: id }).then(result => {
        res.send({ code: 200, message: "successfully delete" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/deleteGroup", (req, res, next) => {
    var ids = req.body.ids;
    console.log(req.body)
    Product.deleteMany({ _id: ids }).then(result => {
        res.send({ code: 200, message: "successfully delete" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

module.exports = router;