const { User } = require("./models");

const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const SECRET = "woohootokensecret";

app.use(express.json());

// get all users info
app.get("/api/findUsers", async (req, res) => {
  const data = await User.find();
  res.send(data);
});

// get user's information
const authMiddleware = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(" ").pop();
  const { id } = jwt.verify(raw, SECRET); // return back the SECRET
  req.user = await User.findById(id); //get user's personal id and find out the user 
  next();
};

app.get("/api/userinfo", authMiddleware, async (req, res) => { 
  res.send(req.user);
});

//register system
app.post("/api/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  res.send(user);
});

// login system
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  });
  if (!user) {
    return res.status(422).send({
    message: "Username not exists",
    });
  }
  const isPasswordValid = require("bcryptjs").compareSync(
    req.body.password,
    user.password
  );
  if (!isPasswordValid) {
    return res.status(422).send({
      message: "Password error",
    });
  }

  // token; login evidence 
  const token = jwt.sign(
    {
      id: String(user._id),
    },
    SECRET 
  );
  res.send({ user, token });
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
