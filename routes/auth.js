// This file is specifically for routes related to user authentication. 
// It may make sense to eventually absorb it into one of the other routes files, but for now I am keeping it isolated for ease of work. 

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);

    // Change '/dashboard' to wherever we want the user to be redirected upon authentication. 
    // Perhaps a page where they can see all their past matches and initiate a new one? 
    app.post('/signup', passport.authenticate('local-signup', {
	        successRedirect: '/dashboard',
	        failureRedirect: '/signup'
	    }
	));
};