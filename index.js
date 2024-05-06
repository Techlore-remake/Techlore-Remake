//Packages
require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3000;
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const session = require("express-session");
const chalk = require('chalk');
const { v4: uuidv4 } = require("uuid");

//MongoDB
const MongoDBURI = process.env.MongoDBURI
const MongoStore = require("connect-mongo")(session);
mongoose.connect(MongoDBURI);
const Database = mongoose.connection;
Database.watch().on('change', async (data) => {
  if(data.ns.coll !== 'audits' && data.ns.coll !== 'traffics'){
    const traffic = require('./PrivateModels/traffic');
    let date = new Date()
  let formateddate = new Date(date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2))
  let data2 = await traffic.findOne({Day: formateddate}).exec()
  if(data2){
   await traffic.findOneAndUpdate({Day: formateddate}, {$set: { Database_Changes: (data2.Database_Changes+1)}}).exec()
  }else{
   await traffic.create({
      Day: formateddate,
  Visits: 0,
  API_Requests: 0,
  Database_Changes: 1,
    })
  }
    const audits = require('./PrivateModels/auditmodel.js')
    if(!data.updateDescription){
      audits.create({
        operation: data.operationType,
        walltime: data.wallTime,
      clusterTime: data.clusterTime,
      objcollection: data.ns.coll,
      documentKey: data.documentKey._id
      })
    }else{
    audits.create({
    operation: data.operationType,
    walltime: data.wallTime,
    clusterTime: data.clusterTime,
    objcollection: data.ns.coll,
    documentKey: data.documentKey._id,
    updatedFields: data.updateDescription.updatedFields,
    deletedFields: data.updateDescription.removedFields,
    truncatedArrays: data.updateDescription.truncatedArrays
    })
  }
  }
});
Database.on("error", console.error.bind(console, chalk.bgRedBright.bold(' [MongoDB] Failed To Connect To Database : \n')));
Database.once("open", () => { console.log(chalk.bgGreenBright.bold(' [MongoDB] Successfuly Connected To Database '))});

//Express
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    secret: "LHDIDH$#%@$^#$^oq$#@%FSDFDSF@$ihvVSFIVHISHI41$#@^#%&#$$@#$JBVVLJSV",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: Database,
    }),
    cookie: {
      maxAge: 8.64e+7 * 7 // 7 days
    }
  })
);
app.listen(`${PORT}`, () => {
  console.log(chalk.bgGreenBright.bold(' [Express] WebApp Successfully Booted '));
})
app.use(bodyParser.json({ limit: '10gb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10gb' }));
app.set('view engine', 'ejs');
app.use(session({
  secret: uuidv4(), 
  resave: true,
  saveUninitialized: true
}));
app.locals.icon = function(name, size, style) {
    let size2 = size
    if(!size){
      size2 = 16
    }
    let style2 = style
    if(!style){
      style2 = ''
    }
  return `<svg class="bi pe-none me-2" width="${size2}" height="${size2}" style="${style2}"><use xlink:href="#${name}"/></svg>`
  }
app.locals.Title = "Techlore";

//Routes
const index = require('./routes/index.js')
const admin = require('./routes/admin.js')
const API = require('./routes/api.js')
const upload = require('./routes/upload.js')
app.use('/', index)
app.use('/admin', admin)
app.use('/Api', API)
app.use('/Upload', upload)

//404 page
app.use((req, res, next) => {
  res.render('404.ejs')
})