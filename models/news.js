const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(NewsSchema = new Schema({
    title: String,
    description: String,
    date: Date,
    author: String,
})),
  (News = mongoose.model("News", NewsSchema));

module.exports = News;
//@Vidul if you can add image too
//Also giv acess to enter news from admin panel