const express = require("express");
const index = express.Router();
const chalk = require("chalk");
const traffic = require("../PrivateModels/traffic");
const users = require("../models/users");
const maintenance_status = false;
// true = under maintenance

function log() {
  console.log(chalk.bgCyanBright.bold(" [Router] Index Successfully Booted "));
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

index.get("/", maintenance, counttraffic, async (req, res, next) => {
  let visits = await traffic.find({}).sort({ _id: "asc" }).lean().exec();
  let total_visits = 0;
  visits.forEach(async (data) => {
    total_visits += data.Visits;
  });
  res.render("index.ejs", {
    session: req.session,
    visits: total_visits,
    logins: await users.countDocuments({}).exec(),
  });
});

index.get("/contact", maintenance, counttraffic, async (req, res, next) => {
  res.render("contact.ejs", { session: req.session });
});

index.get("/news", maintenance, counttraffic, async (req, res, next) => {
  res.render("news.ejs", { session: req.session });
});

index.get("/maintain", maintenance, counttraffic, async (req, res, next) => {
  res.render("maintain.ejs", { session: req.session });
});

index.get("/quiz", maintenance, counttraffic, async (req, res, next) => {
  const params = req.query
  if(params.id){
    return res.render("quizform.ejs", { session: req.session });
  }
  if(params.create){
    return res.render("createquiz.ejs", { session: req.session });
  }
    res.render("quiz.ejs", { session: req.session });
});

index.get("/calculator", maintenance, counttraffic, async (req, res, next) => {
  res.render("calculator.ejs", { session: req.session });
});

index.get("/translator", maintenance, counttraffic, async (req, res, next) => {
  res.render("translator.ejs", { session: req.session });
});

index.get("/uptime", maintenance, async (req, res, next) => {
  res.render("404.ejs", { session: req.session });
});

index.get("/profile", maintenance, counttraffic, async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.render("profile.ejs", {
      session: req.session,
      userdata: await users.findOne({ username: req.session.user }).exec(),
    });
  } else {
    res.redirect("/login");
  }
});

index.get("/logout", maintenance, counttraffic, async (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.redirect("/");
    }
  });
});

index.get("/login", maintenance, counttraffic, async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.redirect("/");
  } else {
    res.render("login.ejs");
  }
});

index.get("/signup", maintenance, counttraffic, async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.redirect("/");
  } else {
    res.render("signup.ejs");
  }
});

module.exports = index;
