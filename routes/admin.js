const express = require("express");
const admin = express.Router();
const chalk = require("chalk");

setTimeout(function() {
  console.log(chalk.bgCyanBright.bold(" [Router] Admin Successfully Booted "));
}, 1000);

const isAdmin = (req, res, next) => {
  if(!req.session.user){
    res.redirect('/login')
  }
  if (req.session.admin === false) {
    res.redirect('/')
  } else {
    next();
  }
};

admin.get('/', isAdmin, async (req, res, next) => {
        res.render('admin/index.ejs', {
          user: req.session.user
        });
});

admin.get('/database', isAdmin, async (req, res, next) => {
  res.render('admin/database.ejs', {
    user: req.session.user
  });
});

admin.get('/stats', isAdmin, async (req, res, next) => {
  res.render('admin/stats.ejs', {
    user: req.session.user
  });
});
admin.get('/audits', isAdmin, async (req, res, next) => {
  res.render('admin/auditlogs.ejs', {
    user: req.session.user
  });
});
admin.get('/server', isAdmin, async (req, res, next) => {
  res.render('admin/server.ejs', {
    user: req.session.user
  });
});

module.exports = admin;
