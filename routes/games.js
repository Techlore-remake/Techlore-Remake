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

const login_required = async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};

index.get("/ninja", maintenance, counttraffic, async (req, res, next) => {
  res.render("games/ninja.ejs", { session: req.session });
});

index.get("/tictactoe", maintenance, counttraffic, async (req, res, next) => {
  res.render("games/ninja.ejs", { session: req.session });
});

index.get("/match", maintenance, counttraffic, async (req, res, next) => {
  res.render("games/match.ejs", { session: req.session });
});

module.exports = index;
