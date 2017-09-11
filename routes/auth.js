// This file is specifically for routes related to user authentication. 
// It may make sense to eventually absorb it into one of the other routes files, but for now I am keeping it isolated for ease of work. 

var authController = require('../controllers/authcontroller.js');
 
module.exports = function(app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/dashboard',isLoggedIn, authController.dashboard);
    app.get('/logout',authController.logout);

    // Change '/dashboard' to wherever we want the user to be redirected upon authentication. 
    // Perhaps a page where they can see all their past matches and initiate a new one? 
    app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
	    res.json(req.user);
	});
/*
	app.post('/signup', passport.authenticate('local-signup', {
	        successRedirect: '/dashboard',
	        failureRedirect: '/signup'
	    }
	));
*/
	app.post('/signin', passport.authenticate('local-signin'), function(req, res) {
	    res.json(req.user);
	});

/*
	app.post('/signin', passport.authenticate('local-signin', {
		        successRedirect: '/dashboard',
		        failureRedirect: '/signin'
		    }
		));
*/

	// This is to check if the user is signed in
	app.get('/sign-in-check',isLoggedIn, function(req, res){
		res.json({status: "active"});
	});
	// This function is used for private pages. 
	// If a user is not signed in, they are redirected to the sign in page. 
	function isLoggedIn(req, res, next) {
	    if (req.isAuthenticated())
	        return next();     
//	    res.redirect('/signin');
		res.json({status: "not signed in"});
	};
};