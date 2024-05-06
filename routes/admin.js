const express = require("express");
const admin = express.Router();
const chalk = require("chalk");

function log() {
  console.log(
    chalk.bgCyanBright.bold(" [Router] Admin Successfully Booted ")
  );
}

setTimeout(log, 1000);

const isAdmin = (req, res, next) => {
  if(!req.session.user){
    res.redirect('/login')
  }
  if (req.session.adminkey === 'eeeee') {
    res.redirect('/')
  } else {
    next();
  }
};

admin.get('/', async (req, res, next) => {
        res.render('admin/index.ejs', {
          user: req.session.user
        });
});

admin.get('/database', async (req, res, next) => {
  res.render('admin/database.ejs', {
    user: req.session.user
  });
});

admin.get('/stats', async (req, res, next) => {
  res.render('admin/stats.ejs', {
    user: req.session.user
  });
});
admin.get('/audits', async (req, res, next) => {
  res.render('admin/auditlogs.ejs', {
    user: req.session.user
  });
});
admin.get('/server', async (req, res, next) => {
  res.render('admin/server.ejs', {
    user: req.session.user
  });
});

module.exports = admin;
