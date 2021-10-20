const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../utils/pip");
const { User,SECRET } = require("../modules/mongodb");

router.get("/findUsers", async (req, res) => {
    const data = await User.find();
    res.send(data);
});

router.get("/userinfo", authMiddleware, async (req, res) => {
    res.send(req.user);
});

router.post("/register", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if (!username || !password || !confirmPassword) {
        return res.send({
            code: 201,
            message: "请将数据项填写完整"
        })
    }

    if (password !== confirmPassword) {
        return res.send({
            code: 201,
            message: "两次密码输入不一致"
        })
    }

    const existUser = await User.findOne({ username: username })

    if (existUser && Object.keys(existUser).length > 0) {
        return res.send({
            code: 201,
            message: "Username exists"
        })
    }

    var user = await User.create({
        username: username,
        password: password,
        nickname: username
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

module.exports = router;