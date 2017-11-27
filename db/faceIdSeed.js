// This is a script that creates a FaceList and then loops through exisitng photos in the database to generate FaceIDs.
var $ = require("jquery");
var db = require('../models');
var request = require('ajax-request');

const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const faceListId = "86753098675309";

function addToFaceList(imageURL, imageID) {
    // Base URL
    const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/" + faceListId + "/persistedFaces";
    
    const image = {
        "url": imageURL
    }

    $.ajax({
        url: urlBase,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
        },
        type: "POST",
        // Request body
        data: JSON.stringify(image),
    })
    .done(function(data) {

		db.photo.update({
			faceId: data.persistedFaceId,
	        where: {
	          id: imageID
	        }
		}).then(function(dbPhoto) {
			res.json(dbPhoto);
		});
    })
    .fail(function() {
        console.log("error");
    });
};