const mongoose = require("mongoose");
const SECRET = "cyqtokensecret";
const UserSchema = require("./users");
const PostSchema = require("./posts");

mongoose.connect("mongodb://localhost:27017/express-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const User = mongoose.model("users", UserSchema);
const Post = mongoose.model("posts", PostSchema);

module.exports = {
    SECRET,
    User,
    Post
}