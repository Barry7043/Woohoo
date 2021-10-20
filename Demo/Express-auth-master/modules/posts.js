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
});

module.exports = PostSchema;
