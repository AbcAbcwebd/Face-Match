// This file should be refactored. 
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var db        = {};
const dbCreds = require("../config/config.json")(process.argv[2]);

// To conect to development database
<<<<<<< HEAD
var sequelize = new Sequelize(dbCreds.database, dbCreds.username, dbCreds.password, {
  host: dbCreds.host,
=======
var sequelize = new Sequelize("face_match_db", "root", "Groundon121!", {
  host: "localhost",
  port: 3306,
>>>>>>> 82a98cc2ebb4d624edb5334f5de585fbc8cecfc7
  dialect: "mysql",
    max: 5,
    min: 0,
    idle: 10000
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });


// var model = sequelize['import'](path.join(__dirname, 'event.js'));
// db[model.name] = model;

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
