const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(trafficSchema = new Schema({
  Day: Date,
  Visits: Number,
  API_Requests: Number,
  Database_Changes: Number,
})),
  (traffic = mongoose.model("traffic", trafficSchema));

module.exports = traffic;