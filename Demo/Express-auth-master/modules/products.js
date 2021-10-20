var mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    default: "",
    required: true,
  },
  imgs: {
    type: String,        // 图集
    default: "",
    required: true
  },
  createTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  createUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  wechat: {
    type: String,
    default: ""
  },
  isPublish: {
    type: Number,
    default: 2     // 1公开微信 2不公开
  },
  wantNum: {       // 多少人想要
    type: Number,
    default: 0
  },
  price: {
    type: Number,  // 价格
    default: 9999999.99
  },
  status: {
    type: Number,  // 交易状态  0代售  1已交易
    default: 0
  }
});

module.exports = PostSchema;
