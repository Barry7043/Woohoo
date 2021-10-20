const jwt = require("jsonwebtoken");
const { User, SECRET } = require("../modules/mongodb");

// 用户信息
const authMiddleware = async (req, res, next) => {
    var token = req.headers.token;
    if (!token) {
        res.send({ code: 401, message: "User login information is invalid. Please login again" });
        return;
    }
    const { id } = jwt.verify(token, SECRET);
    if (!id) return res.send({ code: 401, message: "User login information is invalid. Please login again" });
    req.user = await User.findById(id);
    next();
};

module.exports = {
    authMiddleware
}
