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

	//photo uploading
	app.post("/api/photos", function(req, res) {
		db.photo.create(req.body).then(function(dbPhoto) {
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
};