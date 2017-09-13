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
        console.log(data[0].faceId);
        return data[0].faceId;
    })
    .fail(function() {
        console.log("error");
    });
}

function compareFaces()
{

}
image = "https://i.pinimg.com/736x/dd/45/96/dd4596b601062eb491ea9bb8e3a78062--two-faces-baby-faces.jpg";
getFaceID(image);