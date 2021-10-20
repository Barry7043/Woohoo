const express = require("express");
const cors = require("cors");
const path = require("path")
const app = express();

app.use(express.static(path.join(__dirname, 'workImgs')));
app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.urlencoded({ extended: false }));

// 路由配置 start
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts")
const productRoute = require("./routes/products")
const friendRoute = require("./routes/friends")
const uploadRoute = require("./routes/upload")
const commentRoute = require("./routes/comments")
app.use("/users", usersRoute);
app.use("/posts", postRoute)
app.use("/products", productRoute)
app.use("/friends", friendRoute)
app.use("/comments", commentRoute)
app.use("/upload", uploadRoute)

// 路由配置 end

app.listen(3005, () => {
  console.log("http://localhost:3005");
});
