module.exports = (app) => {
	app.get("/v1", (req, res) => {
		var subscriptionKey = "13hc77781f7e4b19b5fcdd72a8df7156";
		var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
		res.render("index");
	})
};