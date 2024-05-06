const express = require("express");
const index = express.Router();
const chalk = require("chalk");
const traffic = require('../PrivateModels/traffic');

function log() {
  console.log(
    chalk.bgCyanBright.bold(" [Router] Index Successfully Booted ")
  );
}

setTimeout(log, 1000);

index.use(async (req, res, next) => {
  let date = new Date()
  let formateddate = new Date(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2))
  let data = await traffic.findOne({Day: formateddate}).exec()
  if(data){
   await traffic.findOneAndUpdate({Day: formateddate}, {$set: { Visits: (data.Visits+1)}}).exec()
  }else{
   await traffic.create({
      Day: formateddate,
  Visits: 1,
  API_Requests: 0,
  Database_Changes: 0,
    })
  }
  next()
})

index.get('/', async (req, res, next) => {
  const user = req.session.user
  const session = req.session
  res.render('index.ejs', {
    user: user,
    session: session
  });
});

index.get('/logout', async (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      res.send("Error")
    } else {
      res.redirect('/')
    }
  })
})

index.get('/login', async (req, res, next) => {
  const user = req.session.user
  if (user) {
    res.redirect('/')
  } else {
    res.render('login.ejs', { user: user });
  }
});

module.exports = index;
