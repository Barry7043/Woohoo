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
    type: {
        type: Number,
        default: 0,
        required: true  // 1 交友 2 学习 3 交易
    },
    imgs: {
        type: String,
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
    }
});

module.exports = PostSchema;
