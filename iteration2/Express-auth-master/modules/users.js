var mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    set(val) {
      return require("bcryptjs").hashSync(val, 4);
    },
  },
  nickname: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: ""
  },
  type: {
    type: Number,
    default: 0,  // 0 普通用户 1 管理员
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = UserSchema
