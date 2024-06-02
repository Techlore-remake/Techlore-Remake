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

const options = async (req, res, next) => {
  // Maintenance
  if (maintenance_status !== false) {
    return res.render("maintain.ejs", { session: req.session });
  }

  // Login Requirement
  let RQ_Pages = ["/profile"];
  if(RQ_Pages.some(e => e === req.path) && !req.session.user){
    return res.redirect("/login");
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

index.get("/", options, async (req, res, next) => {
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

index.get("/contact", options, async (req, res, next) => {
  res.render("contact.ejs", { session: req.session });
});

index.get("/test", options, async (req, res, next) => {
  res.render("test.ejs", { session: req.session });
});

index.get("/news", options, async (req, res, next) => {
  const news = require("../models/news");
  await news.find({}).sort({ _id: "desc" }).lean().exec()
    .then((data) => {
      res.render("news.ejs", { session: req.session, news: data });
    })
    .catch((error) => {
      res.render("404.ejs", { session: req.session });
    });
});

index.get("/profile", options, async (req, res, next) => {
    res.render("profile.ejs", {
      session: req.session,
      userdata: await users.findOne({ username: req.session.user }).exec(),
    });
  },
);

index.get("/logout", options, async (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.redirect("/login");
    }
  });
});

index.get("/login", options, async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.redirect("/");
  } else {
    res.render("login.ejs");
  }
});

index.get("/signup", options, async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.redirect("/");
  } else {
    res.render("signup.ejs");
  }
});

module.exports = index;
