const mongoose = require("mongoose");
const SECRET = "cyqtokensecret";
const UserSchema = require("./users");
const PostSchema = require("./posts");
const ProductSchema = require("./products");
const FriendSchema = require("./friends");
const WantSchema = require("./users_want");
const CommentSchema = require("./comments");

mongoose.connect("mongodb://localhost:27017/express-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const User = mongoose.model("users", UserSchema);
const Post = mongoose.model("posts", PostSchema);
const Product = mongoose.model("products", ProductSchema);
const Friend = mongoose.model("friends", FriendSchema);
const UsersWant = mongoose.model("users_want", WantSchema);
const Comment = mongoose.model("comments", CommentSchema);

module.exports = {
    SECRET,
    User,
    Post,
    Product,
    Friend,
    UsersWant,
    Comment
}