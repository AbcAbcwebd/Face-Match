var fs = require('fs');
var db = require('../models');
var csv = require('csv');

var input = fs.createReadStream('./seed-faces.csv');
var parser = csv.parse({
    delimiter: ',',
    columns: true
});


db.user.create({
	firstname: 'unknown',
	lastname: 'unknown',
	password: 'unknown'
}).then(function() {
	var transform = csv.transform(function(row) {
	    var resultObj = {
	        url: row[Object.keys(row)[0]].trim(),
	        userId: 1
	    };
	    
	    db.photo.create(resultObj)
	        .then(function() {
	            console.log('Record created')
	            console.log("url: " + resultObj.url);
	        })
	        .catch(function(err) {
	            console.log('Error encountered: ' + err)
	        });
	});
	input.pipe(parser).pipe(transform);
});
