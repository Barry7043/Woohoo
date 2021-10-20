var mongoose = require("mongoose")

const WantSchema = new mongoose.Schema({
    pId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    uId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    createTime: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports = WantSchema;
