const jwt = require("jsonwebtoken");
const { User, SECRET } = require("../modules/mongodb");

// 用户信息 UserInfo
const authMiddleware = async (req, res, next) => {
    const raw = String(req.headers.token).split(" ").pop();
    const { id } = jwt.verify(raw, SECRET);
    req.user = await User.findById(id);
    next();
};

module.exports = {
    authMiddleware
}
