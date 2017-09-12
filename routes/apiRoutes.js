// Relates to Cloudinary (image handling)
var cloudinary = require('cloudinary');

//This should be moved to a seperate config file: 
cloudinary.config({ 
  cloud_name: 'face-match', 
  api_key: '192315292745969', 
  api_secret: 'CFXD3NAgGEFqIEmDqop_R6SsODE' 
});

module.exports = (app) => {
	/*
	app.get("/v1", (req, res) => {
		res.render("index");
	})
	*/

	// This recieves IDs of uploaded images.
	app.post("/image", (req, res) => {
		console.log("Target hit");
		console.log(req.body.url);
		var displayImage = cloudinary.image(req.body.url, { width: 500, height: 300, crop: "fill" });
		console.log(displayImage);
		res.json({
			status: "success",
			image: displayImage
		});
	})
};