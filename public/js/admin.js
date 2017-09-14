// This file relates to seeding
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const faceListId = "86753098675309";

function addToFaceList(imageURL, imageID) {
    // Base URL
    const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/" + faceListId + "/persistedFaces";
    
    const image = {
        "url": imageURL
    }

    const params = {
        "userData": imageURL
    }

    $.ajax({
        url: urlBase + "?" + $.param(params),
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
        console.log(data.persistedFaceId);
        faceIDinfo =  {
        	faceID: data.persistedFaceId,
        	imageID: imageID
        }
        $.post("/seeding", faceIDinfo, function(postData) {

        });

    })
    .fail(function() {
        console.log("error");
    });
};

$( document ).ready(function() {
	$('#seed-faceids-btn').click(function(){
		console.log("Button clicked");
	   $.get("/seeding", function(data) {
	   		for (var i = 0; i < data.length; i++){
				let dbPhotoURL = data[i].url;
				console.log(dbPhotoURL);
				// This helps ensure that the value is a valid URL
				if (dbPhotoURL.indexOf('http') >= 0 && !data[i].faceId){
					console.log("Adding photo");
					addToFaceList(dbPhotoURL, data[i].id);
				};
			};
	   });
	});
});