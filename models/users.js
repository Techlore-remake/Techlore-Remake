const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(UserSchema = new Schema({
    name: String,
    username: String,
    birthday: Date,
    email: String,
    password: String,
    theme: {
        type: Number,
        // 0: dark, 1: light
        enum: [0, 1]
      },
    admin: {
      status: Boolean,
      level: Number
    }
})),
  (Users = mongoose.model("users", UserSchema));

module.exports = Users;