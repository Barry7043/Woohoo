const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../utils/pip");
const { User, SECRET } = require("../modules/mongodb");

router.get("/findUsers", async (req, res) => {
    const data = await User.find();
    res.send(data);
});

router.get("/userinfo", authMiddleware, async (req, res) => {
    User.findById(req.user._id).then(result => {
        res.send({
            code: 200,
            message: "User information obtained successfully",
            data: result
        });
    })
});

router.post("/register", async (req, res) => {
    let username = req.body.username;
    let phone = req.body.phone;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if (!username ||!phone || !password || !confirmPassword) {
        return res.send({
            code: 201,
            message: "Please complete the data item"
        })
    }

    if (password !== confirmPassword) {
        return res.send({
            code: 201,
            message: "The two passwords do not match"
        })
    }

    const existUser = await User.findOne({ $or: [{ username: username }, { phone: phone }] })

    if (existUser && Object.keys(existUser).length > 0) {
        return res.send({
            code: 201,
            message: "Username or phone exists"
        })
    }

    var user = await User.create({
        username: username,
        password: password,
        nickname: username,
        phone: phone
    });

    delete user.password;

    res.send({
        code: 200,
        message: "Registe Success",
        data: user
    });
});

router.post("/login", async (req, res) => {
    var user = await User.findOne({
        username: req.body.username,
    });
    if (!user) {
        return res.send({
            code: 201,
            message: "Username not exists",
        });
    }
    const isPasswordValid = require("bcryptjs").compareSync(
        req.body.password,
        user.password
    );
    if (!isPasswordValid) {
        return res.send({
            code: 201,
            message: "Password Error",
        });
    }
    // token;
    const token = jwt.sign(
        {
            id: String(user._id),
        },
        SECRET
    );
    var newUser = JSON.parse(JSON.stringify(user));
    delete newUser.password;
    res.send({
        code: 200,
        message: "Login Success",
        data: {
            user: newUser,
            token
        }
    });
});

router.post("/changePassword", authMiddleware, (req, res, next) => {
    var id = req.user._id;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if (!id || !password || !confirmPassword) { return res.send({ code: 400, message: "Request parameter missing" }) };
    if (password != confirmPassword) { return res.send({ code: 500, message: "The two passwords do not match" }) }
    User.findByIdAndUpdate(id, {
        password
    }).then(result => {
        res.send({ code: 200, message: "Password changed successfully" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/forgetPassword", async (req, res, next) => {
    var username = req.body.username;
    var phone = req.body.phone;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    if (!username || !phone || !password || !confirmPassword) { return res.send({ code: 400, message: "Request parameter missing" }) };
    if (password != confirmPassword) { return res.send({ code: 500, message: "The two passwords do not match" }) }

    const existData = await User.findOne({ username, phone }).then(result => result)
    if (!existData) { return res.send({ code: 500, message: "Please enter the correct user name or cell phone number" }) }

    User.findOneAndUpdate({ username, phone }, {
        password
    }).then(result => {
        res.send({ code: 200, message: "Password changed successfully" })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

router.post("/editInfo", authMiddleware, (req, res, next) => {
    var id = req.user._id;
    var nickname = req.body.nickname;
    var phone = req.body.phone;
    var logo = req.body.logo;
    if (!id || !nickname) { return res.send({ code: 400, message: "Request parameter missing" }) };
    User.findByIdAndUpdate(id, {
        nickname,
        logo,
        phone
    }).then(async result => {
        const userInfo = await User.findById(req.user._id).then(userInfo => userInfo)
        res.send({ code: 200, message: "Modified information successfully", data: userInfo })
    }).catch(error => { console.log(error); res.send({ code: 500, message: "Server error occurred, please contact administrator" }) })
})

module.exports = router;