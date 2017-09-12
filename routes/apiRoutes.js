// Relates to Cloudinary (image handling)
var cloudinary = require('cloudinary');

//This should be moved to a seperate config file: 
cloudinary.config({ 
  cloud_name: 'face-match', 
  api_key: '192315292745969', 
  api_secret: 'CFXD3NAgGEFqIEmDqop_R6SsODE' 
});

module.exports = (app) => {
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
		var userID = req.body.submitUser;
		var returnImageID = req.body.returnImageID;
		var newImageURL = req.body.newImageURL;

		res.sendStatus(200);
	})

	// This route handles requests for matches for a particular user
	// The ID of the requesting user is passed in as a query parameter
	// The client side JavaScript then expects back an array of objects pulled from the database.
	app.get("/matches/:id", (req, res) => {

	})
};