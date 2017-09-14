var db = require('../models');

// Relates to Cloudinary (image handling)
var cloudinary = require('cloudinary');

//This should be moved to a seperate config file: 
cloudinary.config({ 
  cloud_name: 'face-match', 
  api_key: '192315292745969', 
  api_secret: 'CFXD3NAgGEFqIEmDqop_R6SsODE' 
});

module.exports = (app) => {
	app.get("/v1", (req, res) => {
		res.render("index");
	});

		//user routes

	//list of users
	app.get("/api/users", function(req, res) {
		db.user.findAll().then(function(dbUser) {
			console.log(dbUser);
			res.json(dbUser);
		});
	});

	//user profile + photos
	app.get("/api/users/:id", function(req, res) {
		db.user.findOne({
			where: {
				id: req.params.id
			},
			include: [db.photo]
		}).then(function(dbUser) {
			console.log(dbUser);
			res.json(dbUser);
		});
	});

	//photo routes

	//to show most recent matches?
	app.get("/api/photos", function(req, res) {
		db.photo.findAll().then(function(dbPhoto) {
			res.json(dbPost);
		});
	});

	//individual matches
	app.get("/api/photos/:id", function(req, res) {
		db.photo.findOne({
			where: {
				id: req.params.id
			}
		}).then(function(dbPhoto) {
			res.json(dbPhoto);
		});
	});

	app.delete("/api/photos/:id", function(req, res) {
		dp.photo.destroy({
			where: {
				id:req.params.id
			}
		}).then(function(dbPhoto) {
			res.json(dbPhoto);
		});
	});
	// This recieves IDs of uploaded images.
	// It should return an image element to display of the uploaded image as well as a source for a matching image.
	// Just sub in the API result for 'match'
	// It should also return the table ID of the image returned by the API
	app.post("/image", (req, res) => {
		console.log("Target hit");
		console.log(req.body.url);
		var displayImage = cloudinary.image(req.body.url);
		console.log(displayImage);
		// Match should return the correct URL.
		res.json({
			status: "success",
			image: displayImage,
			match: "images/demo-portraits/demo1.png",
			matchID: 1
		});
	})

	// This route should recieve matches and save them to the database
	// It recieves three variables from the database and should make necesary saves to the database.
	// If the information is saved successfully, it should return a status 200 at the end. 
	app.post("/matches", (req, res) => {
		let userID = req.body.submitUser;
		let returnImageID = req.body.returnImageID;
		let newImageURL = req.body.newImageURL;
		let newImageFaceID = req.body.faceID;

		db.photo.create({
			url: newImageURL,
			matchId: returnImageID,
			userId: userID
		}).then(function(dbPhoto) {
			res.json(dbPhoto);
		});

		res.sendStatus(200);
	})

	// This route handles requests for matches for a particular user
	// The ID of the requesting user is passed in as a query parameter
	// The client side JavaScript then expects back an array of objects pulled from the database.
	app.get("/matches/:id", (req, res) => {

	})
};