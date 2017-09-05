// This file is specifically for routes related to user authentication. 
// It may make sense to eventually absorb it into one of the other routes files, but for now I am keeping it isolated for ease of work. 

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app) {
 
    app.get('/signup', authController.signup);
 
}