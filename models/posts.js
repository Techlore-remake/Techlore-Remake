const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(PostSchema = new Schema({
    userId: Number,
    id: Number,
    title: String,
    body: String
})),
  (Posts = mongoose.model("posts", PostSchema));

module.exports = Posts;
