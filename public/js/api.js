// Store east cost subscription key
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const faceListId = "86753098675309";


// Get a face ID from input face
    export function getFaceId(imageURL) {
        // Base URL
        const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect?";

        // Parameters to pass in
        const params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false"
        };
        
        const image = {
            "url": imageURL
        }

        $.ajax({
            url: urlBase + $.param(params),
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
            return data[0].faceId;
        })
        .fail(function() {
            console.log("error");
        });

    },
    // Creates an empty FaceList with Id faceListId, returns nothing
    createFaceList: function() {
        // Base URL
        const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/" + faceListId + "?";

        // Parameters to pass in
        const params = {
            "name": "Face-Match-List"
        }
        
        $.ajax({
            url: urlBase + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "PUT",
            // Request body
            data: "{'name': 'Face-Match-list'}",
        })
        .done(function(data) {

        })
        .fail(function() {
            console.log("error");
        });
    },
    // Takes in an image URL, adds it to the FaceList with Id faceListId, and returns the persistedFaceId
    addToFaceList: function(imageURL) {
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
            return data.persistedFaceId;
        })
        .fail(function() {
            console.log("error");
        });
    },
    //
    compareFaces: function(faceId) {
        // Base URL
        const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/findsimilars?";

        // Parameters to pass in
        const params = {
            "faceId": faceId,
            "faceListId": faceListId,
            "maxNumOfCandidatesReturned":1,
            "mode": "matchFace"
        };
        
        $.ajax({
            url: urlBase + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
            },
            type: "POST",
            // Request body
            data: JSON.stringify(params),
        })
        .done(function(data) {
            return data[0];
        })
        .fail(function() {
            console.log("error");
        });
    },
};