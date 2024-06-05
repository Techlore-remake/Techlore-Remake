const express = require("express");
const index = express.Router();
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
  let Dis_Pages = ["/test"];
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
      res.render("error.ejs", {session: req.session, code: 500, message: `Something Went Wrong. <a href="/">Home</a>`, icon: "fa-triangle-exclamation"});
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
