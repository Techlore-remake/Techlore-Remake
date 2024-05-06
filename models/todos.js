const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(TodoSchema = new Schema({
    userId: Number,
    id: Number,
    title: String,
    completed: Boolean
})),
  (Todos = mongoose.model("todos", TodoSchema));

module.exports = Todos;
