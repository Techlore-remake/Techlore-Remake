const express = require("express");
const index = express.Router();
const app = express()
const chalk = require("chalk");
const traffic = require("../PrivateModels/traffic");
const users = require("../models/users");

setTimeout(function() {
  console.log(chalk.bgCyanBright.bold(" [Router] Index Successfully Booted "));
}, 1000);

const options = async (req, res, next) => {
  // Maintenance
  if (req.app.locals.Maintenance !== false) {
    return res.render("error.ejs", {session: req.session, code: 502, message: `Site is under maintainence. Site will be back online soon.`, icon: "fa-screwdriver-wrench"});
  }

  // Login Requirement
  let RQ_Pages = ["/profile"];
  if(RQ_Pages.some(e => e === req.path) && !req.session.user){
    return res.redirect("/login");
  }

  // Disabled Pages
  let Dis_Pages = ["/ninja", "/tictactoe", "/match"];
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

index.get("/ninja", options, async (req, res, next) => {
  res.render("games/ninja.ejs", { session: req.session });
});

index.get("/tictactoe", options, async (req, res, next) => {
  res.render("games/tictactoe.ejs", { session: req.session });
});

index.get("/match", options, async (req, res, next) => {
  res.render("games/match.ejs", { session: req.session });
});

module.exports = index;
