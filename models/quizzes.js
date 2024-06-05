const mongoose = require("mongoose");
const Schema = mongoose.Schema;

(QuizSchema = new Schema({
    title: String,
    description: String,
    code: String,
    active: Boolean,
    author: String,
    questions: [{
      question: String,
      choices: {
        a1: String,
        a2: String,
        a3: String,
        a4: String
      },
      answer: Number
    }],
    responses: [{
      user: String,
      score: Number,
      date: Date,
      answers: [{
        answer: Number
      }]
    }]
})),
  (Quizzes = mongoose.model("quizzes", QuizSchema));

module.exports = Quizzes;