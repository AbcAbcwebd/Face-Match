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
	// The ID of the requesting user is passed in as a query parameter
	// The client side JavaScript then expects back an array of objects pulled from the database.
	app.get("/api/users/:id", function(req, res) {
		db.photo.findAll({
			attributes: ['url', 'matchId'],
			where: {
				userId: req.params.id
			}
		}).then(function(photo) {
			res.json(photo);
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

	// This recieves IDs of uploaded images.
	// It should return an image element to display of the uploaded image as well as a source for a matching image.
	// Just sub in the API result for 'match'
	// It should also return the table ID of the image returned by the API
	app.post("/image", (req, res) => {
		console.log(req.body.url);
		var displayImage = cloudinary.image(req.body.url);
		console.log(displayImage);
		// Match should return the correct URL.
		res.json({
			status: "success",
			image: displayImage
		});
	})

	// This route should recieve matches and save them to the database
	// It recieves three variables from the database and should make necesary saves to the database.
	// If the information is saved successfully, it should return a status 200 at the end. 
	app.post("/matches", (req, res) => {
		console.log("Matches route hit")
		let userID = req.body.submitUser;
		let returnImageID = req.body.returnImageID;
		let newImageURL = req.body.newImageURL;
		let newImageFaceID = req.body.faceID;
		console.log("FaceID: " + newImageFaceID);

		db.photo.create({
			url: newImageURL,
			matchId: returnImageID,
			userId: userID,
			faceId: newImageFaceID
		}).then(function(dbPhoto) {
			res.json(dbPhoto);
		});
	});

	//ID of a photo is passed in and the photo 
	app.get("/matches/:id", (req, res) => {
		db.photo.findOne({
			attributes: ['url'],
			where: {
				id: req.params.id
			}
		});
	});


};