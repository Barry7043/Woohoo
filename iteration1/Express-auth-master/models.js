const mongoose = require("mongoose"); // mongodb database 

mongoose.connect("mongodb://localhost:27017/express-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, unique: true 
  }, // let the username be unique
  password: {
    type: String,
    set(val) { // more save 
      return require("bcryptjs").hashSync(val, 4); //bcryptjs  hasgSync to encryption and hash, level 4
    },
  },
});
const User = mongoose.model("User", UserSchema);
User.db.dropCollection('users') // erase the collection
module.exports = { User };
