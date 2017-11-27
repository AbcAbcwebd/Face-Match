const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || process.argv[3] || 3000;

const passport = require('passport');
const session = require('express-session');

const env = require('dotenv').load();

// Requiring our models for syncing
const models = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// For Passport (handles authentication)
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/apiRoutes.js")(app);
var authRoute = require('./routes/auth.js')(app,passport);

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});
