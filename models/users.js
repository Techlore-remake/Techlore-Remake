const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(UserSchema = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    admin: {
      status: Boolean,
      level: Number
    }
})),
  (Users = mongoose.model("users", UserSchema));

module.exports = Users;