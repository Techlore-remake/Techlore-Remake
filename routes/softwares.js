const express = require("express");
const software = express.Router();
const app = express()
const chalk = require("chalk");
const traffic = require("../PrivateModels/traffic");
const users = require("../models/users");

setTimeout(function() {
    console.log(chalk.bgCyanBright.bold(" [Router] software Successfully Booted "))
}, 1000);

const options = async (req, res, next) => {
  // Maintenance
  if (req.app.locals.Maintenance !== false) {
    return res.render("error.ejs", {session: req.session, code: 502, message: `Site is under maintainence. Site will be back online soon.`, icon: "fa-screwdriver-wrench"});
  }

  // Login Requirement
  let RQ_Pages = ["/quiz/join","/quiz/create", "/quiz/list", "/quiz/dash"];
  if(RQ_Pages.some(e => e === req.path) && !req.session.user){
    return res.redirect("/login");
  }

  // Disabled Pages
  let Dis_Pages = [];
  if(Dis_Pages.some(e => e === req.path)){
    return res.render("error.ejs", {session: req.session, code: 423, message: `This Page Is Currently Disabled.`, icon: "fa-eye-slash"});
  }

  // Traffic Counting
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

  // Next
  next();
}

software.get("/quiz/join", options, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    return res.render("softwares/quizjoin.ejs", { session: req.session });
  }else{
  await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("error.ejs", {session: req.session, code: 204, message: `No Content Found. <a href="/">Home</a>`, icon: "fa-empty-set"});
      }
      if(data.author === req.session.user){
        return res.redirect(`/softwares/quiz/dash?id=${data.code}`);
      }
      if(data.active !== true){
        return res.render("error.ejs", {session: req.session, code: 423, message: `This Quiz Is Currently Disabled.`, icon: "fa-eye-slash"});
      }
      if (data.responses.some(obj => obj.user === req.session.user) === true) {
          return res.redirect(`/softwares/quiz/list?id=${data.code}`);
        }else{
        res.render("softwares/quizform.ejs", { session: req.session, quiz: data });
      }
    })
    .catch((error) => {
      console.log(error)
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
    });
  }
})

software.get("/quiz/create", options, async (req, res, next) => {
  const params = req.query;
  res.render("softwares/quizcreate.ejs", { session: req.session });
})

software.get("/quiz/list", options, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    await quiz.find({ responses: { $elemMatch: { user: req.session.user } } }).exec()
    .then((data) => {
      res.render("softwares/quizlist.ejs", { session: req.session, responses: data });
    })
    .catch((error) => {
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
    });
  }else{
    await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("error.ejs", {session: req.session, code: 204, message: `No Content Found. <a href="/">Home</a>`, icon: "fa-empty-set"});
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
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
    });
  }
})

software.get("/quiz/dash", options, async (req, res, next) => {
  const quiz = require("../models/quizzes");
  const params = req.query;
  if(!params.id){
    await quiz.find({ author: req.session.user }).exec()
    .then((data) => {
      if (!data) {
        return res.render("error.ejs", {session: req.session, code: 204, message: `No Content Found. <a href="/">Home</a>`, icon: "fa-empty-set"});
      }
      res.render("softwares/quizdash.ejs", { session: req.session, quizzes: data });
    })
    .catch((error) => {
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
    });
  }else{
    await quiz.findOne({ code: params.id }).exec()
    .then((data) => {
      if (!data) {
        return res.render("error.ejs", {session: req.session, code: 204, message: `No Content Found. <a href="/">Home</a>`, icon: "fa-empty-set"});
      }
      if(data.author !== req.session.user){
        return res.render("error.ejs", {session: req.session, code: 204, message: `No Content Found. <a href="/">Home</a>`, icon: "fa-empty-set"});
      }
      res.render("softwares/quizresponses.ejs", { session: req.session, quiz: data });
    })
    .catch((error) => {
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
    });
  }
})

software.get("/calculator",  options, async (req, res, next) => {
  res.render("softwares/calculator.ejs", { session: req.session });
});

software.get("/weather",  options, async (req, res, next) => {
  res.render("softwares/weather.ejs", { session: req.session });
});

software.get("/todo",  options, async (req, res, next) => {
  res.render("softwares/todo.ejs", { session: req.session });
});

software.get("/translator",  options, async (req, res, next) => {
  res.render("softwares/translator.ejs", { session: req.session });
});

module.exports = software;