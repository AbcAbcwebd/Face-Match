const baseURL = "https://randomuser.me/api/portraits/women/";
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const queryURL = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/86753098675309/persistedFaces?";
var num = 1;
for (i=1; i<100; i++) {
    setTimeout(function() {
        const image = {
            "url": baseURL + num + ".jpg"
        }

        const params = {
            "userData": baseURL + num + ".jpg"
        }
    
        $.ajax({
            url: queryURL + $.param(params),
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
            var object = {
                url: baseURL + num + ".jpg",
                persistedFaceId: data.persistedFaceId
            }
            num++;
            console.log(object);
        })
        .fail(function() {
            console.log("error");
            num++;
        });
    }, i*5000);
}