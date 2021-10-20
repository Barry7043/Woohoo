var mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    articleId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    fromName: {
        type: String,
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    toName: {
        type: String,
    },
    createTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    commentId: {
        type: String
    },
    type: {
        type: Number,          // 1交友 2学习 3交易
        default: 1,
        required: true
    }
});

module.exports = CommentSchema;
