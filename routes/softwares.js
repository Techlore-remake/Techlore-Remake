const express = require("express");
const software = express.Router();
const chalk = require("chalk");
const traffic = require("../PrivateModels/traffic");
const users = require("../models/users");
const maintenance_status = false;
// true = under maintenance

function log() {
  console.log(chalk.bgCyanBright.bold(" [Router] software Successfully Booted "));
}
setTimeout(log, 1000);

const maintenance = async (req, res, next) => {
  if (maintenance_status === false) {
    next();
  } else {
    res.render("maintain.ejs", { session: req.session });
  }
};

const counttraffic = async (req, res, next) => {
  let date = new Date();
  let formateddate = new Date(
    date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2),
  );
  let data = await traffic.findOne({ Day: formateddate }).exec();
  if (data) {
    await traffic
      .findOneAndUpdate(
        { Day: formateddate },
        { $set: { Visits: data.Visits + 1 } },
      )
      .exec();
  } else {
    await traffic.create({
      Day: formateddate,
      Visits: 1,
      API_Requests: 0,
      Database_Changes: 0,
    });
  }
  next();
};

const login_required = async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

software.get("/quiz/join", login_required, maintenance, counttraffic, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    return res.render("softwares/quizjoin.ejs", { session: req.session });
  }else{
  await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("404.ejs", { session: req.session });
      }
      if(data.author === req.session.user){
        return res.redirect(`/softwares/quiz/dash?id=${data.code}`);
      }
      if(data.active !== true){
        return res.render("404.ejs", { session: req.session });
      }
      if (data.responses.some(obj => obj.user === req.session.user) === true) {
          return res.redirect(`/softwares/quiz/list?id=${data.code}`);
        }else{
        res.render("softwares/quizform.ejs", { session: req.session, quiz: data });
      }
    })
    .catch((error) => {
      console.log(error)
      res.render("404.ejs", { session: req.session });
    });
  }
})

software.get("/quiz/create", login_required, maintenance, counttraffic, async (req, res, next) => {
  const params = req.query;
  res.render("softwares/quizcreate.ejs", { session: req.session });
})

software.get("/quiz/list", login_required, maintenance, counttraffic, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    await quiz.find({ responses: { $elemMatch: { user: req.session.user } } }).exec()
    .then((data) => {
      res.render("softwares/quizlist.ejs", { session: req.session, responses: data });
    })
    .catch((error) => {
      res.render("404.ejs", { session: req.session });
    });
  }else{
    await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("404.ejs", { session: req.session });
      }
      if(data.author === req.session.user){
        return res.redirect(`/softwares/quiz/dash?id=${data.code}`);
      }
      if (data.responses.some(obj => obj.user === req.session.user) === false) {
        return res.redirect(`/softwares/quiz/join?id=${data.code}`)
      }else{
        let respon = data.responses.filter(obj => obj.user === req.session.user)
        res.render("softwares/quizscore.ejs", { session: req.session, quiz: data, response: respon[0] });
      }
    })
    .catch((error) => {
      res.render("404.ejs", { session: req.session });
    });
  }
})

software.get("/quiz/dash", login_required, maintenance, counttraffic, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    await quiz.find({ author: req.session.user }).exec()
    .then((data) => {
      if (!data) {
        return res.render("404.ejs", { session: req.session });
      }
      res.render("softwares/quizdash.ejs", { session: req.session, quizzes: data });
    })
    .catch((error) => {
      res.render("404.ejs", { session: req.session });
    });
  }else{
    await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("404.ejs", { session: req.session });
      }
      if(data.author !== req.session.user){
        return res.render("404.ejs", { session: req.session });
      }
      res.render("softwares/quizresponses.ejs", { session: req.session, quiz: data });
    })
    .catch((error) => {
      res.render("404.ejs", { session: req.session });
    });
  }
})

software.get("/calculator", maintenance, counttraffic, async (req, res, next) => {
  res.render("softwares/calculator.ejs", { session: req.session });
});

software.get("/weather", maintenance, counttraffic, async (req, res, next) => {
  res.render("softwares/weather.ejs", { session: req.session });
});

software.get("/todo", maintenance, counttraffic, async (req, res, next) => {
  res.render("softwares/todo.ejs", { session: req.session });
});

software.get("/translator", maintenance, counttraffic, async (req, res, next) => {
  res.render("softwares/translator.ejs", { session: req.session });
});

module.exports = software;