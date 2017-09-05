const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 80;

const passport   = require('passport');
const session    = require('express-session');

const env = require('dotenv').load();

//For Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

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

const api_routes = require("./routes/api-routes.js");
app.use("api/", api_routes);
var authRoute = require('./routes/auth.js')(app);

const router = express.Router();
router.get("/test", function(req, res) {
  console.log("Test route works");
});


//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});
/*
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
*/