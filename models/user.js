const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(userSchema = new Schema({
  username: String,
  password: String,
  admin: Boolean
})),
  (users = mongoose.model("user", userSchema));

module.exports = users;
