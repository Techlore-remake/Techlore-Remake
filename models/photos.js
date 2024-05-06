const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(PhotoSchema = new Schema({
    albumId: Number,
    id: Number,
    title: String,
    url: String,
    thumbnailUrl: String
})),
  (Photos = mongoose.model("photos", PhotoSchema));

module.exports = Photos;