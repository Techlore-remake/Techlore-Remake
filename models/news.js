const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(NewsSchema = new Schema({
    title: String,
    description: String,
    date: Date,
    author: String,
})),
  (News = mongoose.model("news", NewsSchema));

module.exports = News;