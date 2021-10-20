var mongoose = require("mongoose")

const FriendSchema = new mongoose.Schema({
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
    type: String,        // 照片集合
    default: "",
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
  ageStart: {
    type: Number,  // 年龄段
  },
  ageEnd: {
    type: Number
  },
  sex: {
    type: Number // 1男 2女
  },
  popularity: {
    type: Number,
    default: 0
  }
});

module.exports = FriendSchema;
