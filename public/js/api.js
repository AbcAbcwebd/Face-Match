// Store east cost subscription key
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";

// Get a face ID from input face
function getFaceID(imageURL)
{
    // Base URL
    const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/detect?";

    // Parameters to pass in
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "{}",
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
        data: {
            "url": imageURL  
        },
    })
    .done(function(data) {
        alert("success");
    })
    .fail(function() {
        alert("error");
    });
}

function compareFaces()
{

}