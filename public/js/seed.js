// const baseURL = "https://randomuser.me/api/portraits/women/";
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const queryURL = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/86753098675309/persistedFaces?";
var num = 1;
var faces = ["https://upload.wikimedia.org/wikipedia/commons/d/d8/Dolly_Parton_accepting_Liseberg_Applause_Award_2010_portrait.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/0/0e/Donald_Trump_Pentagon_2017.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/e/e5/Kristen_Stewart%2C_Breaking_Dawn_Part_2%2C_London%2C_2012_%28crop%29.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Daniel_Radcliffe_%2819740428165%29.jpg/1024px-Daniel_Radcliffe_%2819740428165%29.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/7/7f/Emma_Watson_2013.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/f/fd/Emma_Stone_2%2C_2014.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/4/49/Chris_Hemsworth_3%2C_2013.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/6/67/Will_Smith_by_Gage_Skidmore_2.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/e/ef/Hayao_Miyazaki.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/0/07/MAriah_Carey_2005.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/8/8c/Adrienne_C._Moore.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/b/b6/Selenis_Leyva.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Elizabeth_Rodriguez_by_Gage_Skidmore.jpg/1024px-Elizabeth_Rodriguez_by_Gage_Skidmore.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/0/0e/Sibel_Kekilli_%28Berlinale_2012%29.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/3/37/Mahershala_Ali_%2829953410761%29.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Chris_Pratt_by_Gage_Skidmore_2.jpg/1024px-Chris_Pratt_by_Gage_Skidmore_2.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/RashidaJonesSideMarch09.jpg/1280px-RashidaJonesSideMarch09.jpg",
"https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Aubrey_Plaza_2012_Shankbone.JPG/1024px-Aubrey_Plaza_2012_Shankbone.JPG", 
 "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Aziz_Ansari_2012.jpg/1024px-Aziz_Ansari_2012.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Nick_Offerman_at_UMBC_%28cropped%29.jpg/1024px-Nick_Offerman_at_UMBC_%28cropped%29.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Retta_2012_%28cropped%29.jpg/1024px-Retta_2012_%28cropped%29.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Michael_B._Jordan_by_Gage_Skidmore.jpg/800px-Michael_B._Jordan_by_Gage_Skidmore.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/9/93/Rami_Malek_in_Hollywood%2C_California.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/7/70/Salma_Hayek_Cannes_2015_2_cropped.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/a/af/DJ_Khaled_2012.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/d/dd/Nicki_Minaj_3%2C_2012.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/7/71/Lana_Del_Rey_Cannes_2012.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/9/9f/Rihanna%2C_2012.jpg", 
 "https://i.imgur.com/GOrkXJM.jpg", 
 "https://upload.wikimedia.org/wikipedia/en/e/e0/Gollum.PNG", 
 "https://upload.wikimedia.org/wikipedia/commons/b/b8/Laina_Morris_by_Gage_Skidmore.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/7/7b/Isaiah_Mustafa.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/c/cf/ChristopherWalkenFeb08.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/3/35/Psy_from_acrofan.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/2/2d/Ron_Jeremy_2009.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/8/8e/Michael_Cera_2012_%28Cropped%29.jpg", 
 "https://upload.wikimedia.org/wikipedia/commons/3/30/Chuck_Norris_May_2015.jpg", 
"https://upload.wikimedia.org/wikipedia/commons/2/2d/MindyKaling08.jpg"];
for (i=1; i<faces.length; i++) {
    setTimeout(function() {
        const image = {
            "url": faces[num]
        }

        const params = {
            "userData": faces[num]
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
                url: faces[num],
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