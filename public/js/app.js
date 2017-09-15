// This variable tracks the "state" of the cube, IE-- animated, displaying a particular side, etc. 
var autoHit = "sim";

// This is a boolean value that allows us to track whether or not a user is signed in. 
var signedIn;

var userID;

// Store east cost subscription key
const subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";
const faceListId = "86753098675309";

$( document ).ready(function() {
  var events = new Events();
  events.add = function(obj) {
    obj.events = { };
  }
  events.implement = function(fn) {
    fn.prototype = Object.create(Events.prototype);
  }

  function Events() {
    this.events = { };
  }
  Events.prototype.on = function(name, fn) {
    var events = this.events[name];
    if (events == undefined) {
      this.events[name] = [ fn ];
      this.emit('event:on', fn);
    } else {
      if (events.indexOf(fn) == -1) {
        events.push(fn);
        this.emit('event:on', fn);
      }
    }
    return this;
  }
  Events.prototype.once = function(name, fn) {
    var events = this.events[name];
    fn.once = true;
    if (!events) {
      this.events[name] = [ fn ];
      this.emit('event:once', fn);
    } else {
      if (events.indexOf(fn) == -1) {
        events.push(fn);
        this.emit('event:once', fn);
      }
    }
    return this;
  }
  Events.prototype.emit = function(name, args) {
    var events = this.events[name];
    if (events) {
      var i = events.length;
      while(i--) {
        if (events[i]) {
          events[i].call(this, args);
          if (events[i].once) {
            delete events[i];
          }
        }
      }
    }
    return this;
  }
  Events.prototype.unbind = function(name, fn) {
    if (name) {
      var events = this.events[name];
      if (events) {
        if (fn) {
          var i = events.indexOf(fn);
          if (i != -1) {
            delete events[i];
          }
        } else {
          delete this.events[name];
        }
      }
    } else {
      delete this.events;
      this.events = { };
    }
    return this;
  }

  var userPrefix;

  var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
      pre = (Array.prototype.slice
        .call(styles)
        .join('') 
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
      )[1],
      dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    userPrefix = {
      dom: dom,
      lowercase: pre,
      css: '-' + pre + '-',
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  })();

  function bindEvent(element, type, handler) {
    if(element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else {
      element.attachEvent('on' + type, handler);
    }
  }

  function Viewport(data) {
    events.add(this);

    var self = this;

    this.element = data.element;
    this.fps = data.fps;
    this.sensivity = data.sensivity;
    this.sensivityFade = data.sensivityFade;
    this.touchSensivity = data.touchSensivity;
    this.speed = data.speed;

    this.lastX = 0;
    this.lastY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.distanceX = 0;
    this.distanceY = 0;
    this.positionX = 1122;
    this.positionY = 136;
    this.torqueX = 0;
    this.torqueY = 0;

    this.down = false;
    this.upsideDown = false;

    this.previousPositionX = 0;
    this.previousPositionY = 0;

    this.currentSide = 0;
    this.calculatedSide = 0;


    bindEvent(document, 'mousedown', function() {
      self.down = true;
    });

    bindEvent(document, 'mouseup', function() {
      self.down = false;
    });
    
    bindEvent(document, 'keyup', function() {
      self.down = false;
    });

    bindEvent(document, 'mousemove', function(e) {
      self.mouseX = e.pageX;
      self.mouseY = e.pageY;
    });

    bindEvent(document, 'touchstart', function(e) {

      self.down = true;
      e.touches ? e = e.touches[0] : null;
      self.mouseX = e.pageX / self.touchSensivity;
      self.mouseY = e.pageY / self.touchSensivity;
      self.lastX  = self.mouseX;
      self.lastY  = self.mouseY;
    });

    bindEvent(document, 'touchmove', function(e) {
      if(e.preventDefault) { 
        e.preventDefault();
      }

      if(e.touches.length == 1) {

        e.touches ? e = e.touches[0] : null;

        self.mouseX = e.pageX / self.touchSensivity;
        self.mouseY = e.pageY / self.touchSensivity;

      }
    });

    bindEvent(document, 'touchend', function(e) {
      self.down = false;
    });  

    setInterval(this.animate.bind(this), this.fps);

  }
  events.implement(Viewport);
  Viewport.prototype.animate = function() {

    this.distanceX = (this.mouseX - this.lastX);
    this.distanceY = (this.mouseY - this.lastY);

    this.lastX = this.mouseX;
    this.lastY = this.mouseY;

    if(this.down) {
      this.torqueX = this.torqueX * this.sensivityFade + (this.distanceX * this.speed - this.torqueX) * this.sensivity;
      this.torqueY = this.torqueY * this.sensivityFade + (this.distanceY * this.speed - this.torqueY) * this.sensivity;
    }

    if(Math.abs(this.torqueX) > 1.0 || Math.abs(this.torqueY) > 1.0) {
      if(!this.down) {
        this.torqueX *= this.sensivityFade;
        this.torqueY *= this.sensivityFade;
      }

      this.positionY -= this.torqueY;

      if(this.positionY > 360) {
        this.positionY -= 360;
      } else if(this.positionY < 0) {
        this.positionY += 360;
      }

      if(this.positionY > 90 && this.positionY < 270) {
        this.positionX -= this.torqueX;

        if(!this.upsideDown) {
          this.upsideDown = true;
          this.emit('upsideDown', { upsideDown: this.upsideDown });
        }

      } else {

        this.positionX += this.torqueX;

        if(this.upsideDown) {
          this.upsideDown = false;
          this.emit('upsideDown', { upsideDown: this.upsideDown });
        }
      }

      if(this.positionX > 360) {
        this.positionX -= 360;
      } else if(this.positionX < 0) {
        this.positionX += 360;
      }

      if(!(this.positionY >= 46 && this.positionY <= 130) && !(this.positionY >= 220 && this.positionY <= 308)) {
        if(this.upsideDown) {
          if(this.positionX >= 42 && this.positionX <= 130) {
            this.calculatedSide = 3;
          } else if(this.positionX >= 131 && this.positionX <= 223) {
            this.calculatedSide = 2;
          } else if(this.positionX >= 224 && this.positionX <= 314) {
            this.calculatedSide = 5;
          } else {
            this.calculatedSide = 4;
          }
        } else {
          if(this.positionX >= 42 && this.positionX <= 130) {
            this.calculatedSide = 5;
          } else if(this.positionX >= 131 && this.positionX <= 223) {
            this.calculatedSide = 4;
          } else if(this.positionX >= 224 && this.positionX <= 314) {
            this.calculatedSide = 3;
          } else {
            this.calculatedSide = 2;
          }
        }
      } else {
        if(this.positionY >= 46 && this.positionY <= 130) {
          this.calculatedSide = 6;
        }

        if(this.positionY >= 220 && this.positionY <= 308) {
          this.calculatedSide = 1;
        }
      }

      if(this.calculatedSide !== this.currentSide) {
        this.currentSide = this.calculatedSide;
        this.emit('sideChange');
      }

    }

  // This section of code designates the different states the image cube can be in. 
  // If 'autoHit' is set to false, the cube can be hand rotated by the user. 
  // If 'autoHit' is set to a number, the cube is rotated to a particular image. 
  if (!autoHit) {
      this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';
  } else if (autoHit === 6) {
      this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + 100 + 'deg) rotateY(' + 0 + 'deg)';
      this.positionY = 100;
      this.positionX = 0;
      autoHit = false;
  } else if (autoHit === 1) {
      this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + 0 + 'deg) rotateY(' + 100 + 'deg)';
      this.positionY = 250;
      this.positionX = 0;
      autoHit = false;
  } else if (autoHit === 4) {
      this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + 0 + 'deg) rotateY(' + 100 + 'deg)';
      this.positionY = 175;
      this.positionX = 0;
      autoHit = false;
  } else if (autoHit === "sim") {
      this.positionY++;
      this.positionX++;
      this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';
  }

    if(this.positionY != this.previousPositionY || this.positionX != this.previousPositionX) {
      this.previousPositionY = this.positionY;
      this.previousPositionX = this.positionX;

      this.emit('rotate');

    }

  }


  var viewport = new Viewport({
    element: document.getElementsByClassName('cube')[0],
    fps: 20,
    sensivity: .1,
    sensivityFade: .93,
    speed: 2,
    touchSensivity: 1.5
  });


  function Cube(data) {
    var self = this;

    this.element = data.element;
    this.sides = document.getElementsByClassName('side');

    this.viewport = data.viewport;
    this.viewport.on('rotate', function() {
      self.rotateSides();
    });
    this.viewport.on('upsideDown', function(obj) {
      self.upsideDown(obj);
    });
    this.viewport.on('sideChange', function() {
      self.sideChange();
    });
  }
  Cube.prototype.rotateSides = function() {
    var viewport = this.viewport;
    if(viewport.positionY > 90 && viewport.positionY < 270) {
      this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX + viewport.torqueX) + 'deg)';
      this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 + viewport.torqueX) + 'deg)';
    } else {
      this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX - viewport.torqueX) + 'deg)';
      this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 - viewport.torqueX) + 'deg)';
    }
  }
  Cube.prototype.upsideDown = function(obj) {

    var deg = (obj.upsideDown == true) ? '180deg' : '0deg';
    var i = 5;

    while(i > 0 && --i) {
      this.sides[i].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + deg + ')';
    }

  }
  Cube.prototype.sideChange = function() {

    for(var i = 0; i < this.sides.length; ++i) {
      this.sides[i].getElementsByClassName('cube-image')[0].className = 'cube-image';    
    }

    this.sides[this.viewport.currentSide - 1].getElementsByClassName('cube-image')[0].className = 'cube-image active';

  }

  new Cube({
    viewport: viewport,
    element: $('.cube')[0]
  });

  //These buttons handle the dropdown menu
   $("#menu-button").click(function(){
      if ( $('#menu-dropdown').hasClass( "show" ) ){
        $('#menu-dropdown').removeClass("show");
        $('#menu-dropdown').css('display', 'none');
      } else {
        $('#menu-dropdown').attr('class', 'show');
        $('#menu-dropdown').css('display', 'inline');
      };
   });

   $('#core-content').click(function(){
      $('#menu-dropdown').removeClass("show");
      $('#menu-dropdown').css('display', 'none');
   });


  $('#sign-up-btn').click(function(){
    $('.modal').css('display', 'block');
  });

  $('#sign-in-btn').click(function(){
    $('.modal2').css('display', 'block');
  });

  $('.close').click(function(){
    $('.modal').css('display', 'none');
    $('.modal2').css('display', 'none');
    $('.modal3').css('display', 'none');
  });

  // Handles sign up form submissions
  $('#sign-up-submit-btn').click(function(){
    event.preventDefault();
    var newEmail = $('#new-email').val();
    var newFirstName = $('#new-first-name').val();
    var newLastName = $('#new-last-name').val();
    var newPassword = $('#new-password').val();
    var newPasswordConfirm = $('#new-password-confirm').val();
    // Form validation (could add more)
    if (!newEmail || !newFirstName || !newLastName || !newPassword || !newPasswordConfirm){
      $('#sign-up-error-display').text("All fields are required.");
    } else if (newPassword !== newPasswordConfirm) {
      $('#sign-up-error-display').text("Passwords must match.");
    } else if(newEmail.indexOf('@') < 0 || newEmail.indexOf('.') < 0){
      $('#sign-up-error-display').text("Please enter a valid email.");
    } else {
      // Form data has passed validation and will now be sent to backend
      $('#sign-up-error-display').text("");
      userData = {
        email: newEmail,
        firstname: newFirstName,
        lastname: newLastName,
        password: newPassword
      };
      $.post("/signup", userData, function(data) {
        console.log(data);
        if (data.status !== "active") {
          $('#sign-up-error-display').text("We're sorry! There seems to be a problem with your account....");
        } else {
          $('#signup').empty();
          var welcomeMessage = $('<p>').text("Welcome " + data.firstname + "! Thanks for signing up!");
          $('#signup').append(welcomeMessage);
          setTimeout(function(){
            $('.modal').css('display', 'none');
          }, 4000);
          updateDropdown();
          $('#menu-dropdown').removeClass("show");
          $('#menu-dropdown').css('display', 'none');
          signedIn = true;
          checkLocalStorage();
        };
      });
    }
  });

  $('#sign-in-submit-btn').click(function(){
    event.preventDefault();
    var userEmail = $('#user-email').val();
    var userPassword = $('#user-password').val();
    var signInData = {
      email: userEmail,
      password: userPassword
    };
    console.log("About to send sign in data")
    $.post("/signin", signInData, function(data) {
      console.log(data);
      if (data.status !== "active"){
         $('#sign-in-error-display').text("We're sorry! There seems to be a problem with your account....");
       } else {
          $('#signin').empty();
          var welcomeBackMessage = $('<p>').text("Welcome back!");
          $('#signin').append(welcomeBackMessage);
          setTimeout(function(){
            $('.modal2').css('display', 'none');
          }, 4000);
          updateDropdown();
          $('#menu-dropdown').removeClass("show");
          $('#menu-dropdown').css('display', 'none');
          signedIn = true;
          userID = data.id;
          checkLocalStorage();
          $('#grab-tip').text("(try grabbing the cube)");
       };
    });
  });

  $('#image-upload-btn').click(function(){
    $('.cloudinary_fileupload').trigger('click');
  });

  $("body").on("click", "#enlarge-btn", function(){
    console.log("Clicked");
    var imgSrc = $('#side-6-img').attr('src');
    console.log(imgSrc);
    var expandedImage = $('<img>').attr('src', imgSrc).attr('id', 'expanded-image');
    $('#wrapper').prepend(expandedImage);
    $(".viewport").css('display', 'none');
    $("#enlarge-btn-holder").css('display', 'none');
    $("#grab-tip").css('display', 'none');
  });

  $("body").on("click", "#view-matches-btn", function(){
    $('.modal3').css('display', 'block');
    loadPastMatches();
  });

});

function loadPastMatches(){
  if (!userID) {
    checkID();
    loadPastMatches();
  } else {
    $.get("/api/users/" + userID, function(data) {
      console.log(data);
      // If data is successfully retrieved, the div is cleared.
      if (data.length > 0){
        $('#past-matches-holder').empty();
      };
      for (var x = 0; x < data.length; x++){
        // Here data should be properly structured and then appended to the "#past-matches-holder" div. 
        var matchElement = $('<div>').attr('class', 'match-element');
        var matchImage = $('<img>').attr('src', data[x].matchId);
        matchElement.append(data[x].url);
        if (data[x].matchId.indexOf("http") >= 0){
          matchElement.append(matchImage);
        };
        $('#past-matches-holder').append(matchElement);
      };
    });
  }; 
};

function checkSignInStatus(){
  $.get("/sign-in-check", function(data) {
    if (data.status === "active"){
      console.log("Signed In");
      return "Signed In"
    } else {
      console.log("Not signed in");
      return "Not signed in"
    }
  });
};

function checkID(){
  $.get("/id-check", function(data) {
    console.log(data.id);
    userID = data.id;
  });
}

// This replaces the default dropdown menu with one designed for users who are already signed in.
function updateDropdown(){
  $('#menu-dropdown').empty();
  $('#menu-dropdown').append('<a id="view-matches-btn">View Past Matches</a>');
};

function loadDynamicContent(){
  var signInStatus = checkSignInStatus();
  if (signInStatus === "Signed In"){
    updateDropdown();
    signedIn = true;
    checkLocalStorage();
  } else {
    signedIn = false;
  }
};

// This function handles sending matches to the database to be saved or savng them locally until a user logs in.
function saveMatch(returnImageID, newImageURL, faceID, confidence){
  if (signedIn && userID) {
    // User is signed in and their ID is being stored locally.
    console.log("About to send FaceID: " + faceID)
    matchInfo = {
      submitUser: userID,
      returnImageID: returnImageID,
      newImageURL: newImageURL,
      faceID: faceID,
      confidence: confidence
    };
    $.post("/matches", matchInfo, function(data) {
      // If the save is successful, local storage is wiped out. 
      localStorage.setItem("returnImageID", "");
      localStorage.setItem("newImageURL", "");
    });
  } else if (signedIn) {
    // If the user is signed in, but their ID is not available, their ID should be checked.
    checkID();
    saveMatch(returnImageID, newImageURL, data.persistedFaceId, confidence);
  } else {
    // If the user is not signed in, their information should be stored locally. 
    localStorage.setItem("returnImageID", returnImageID);
    localStorage.setItem("newImageURL", newImageURL);
    localStorage.setItem("newFaceID", faceID);
    localStorage.setItem("confidence", confidence);
  }
};

// Checks local storage to see if their are values waiting to be saved to the database. 
// If there are, the values are saved to the database and then cleared from local storage to prevent double saving.
function checkLocalStorage(){
  var savedImageID = localStorage.getItem("returnImageID");
  var savedImageURL = localStorage.getItem("newImageURL");
  var savedFaceID = localStorage.getItem("newFaceID");
  var savedConfidence = localStorage.getItem("confidence");
  if (savedImageID && savedImageURL){
    saveMatch(savedImageID, savedImageURL, savedFaceID);
    localStorage.setItem("returnImageID", "");
    localStorage.setItem("newImageURL", "");
    localStorage.setItem("newFaceID", "");
    localStorage.setItem("confidence", "");
    console.log("Local storage accessed")
  };
};

// This function displays the match image after it is returned from the Azure API
function displayReturnedImage(imageAddress){
  $('#side-6-img').attr('src', imageAddress);

  setTimeout(function() {
      autoHit = 6;
      if (!signedIn){
        $('#grab-tip').text("Login to auto-save this match.");
      };
    }, 1000); 
    var enlargeButton = $('<button>').attr("id", "enlarge-btn").text("Enlarge Photo");
    $('#enlarge-btn-holder').append(enlargeButton);
};

function handleUploadedPhoto(){
  var imageID = $('#image-id')[0].innerHTML;
  console.log(imageID);
  var imageInfo = {
    url: imageID
  };
  $.post("/image", imageInfo, function(data) {
    console.log(data);
    $('#image-display-holder').empty();
    $('#image-display-holder').append(data.image);
    let imageURL = data.image.split("src='")[1].split("' />")[0];
    $('#image-upload-holder').empty();
//    $('#image-upload-holder').append('<input type="file" name="file" class="cloudinary_fileupload">');
    $('#image-upload-btn').css('display', 'none');
 
    getFaceId(imageURL, imageID);
  });
};

function getFaceId(imageURL, originalImageID) {
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
      compareFaces(data[0].faceId, originalImageID)
//      return data[0].faceId;
  })
  .fail(function() {
      console.log("error");
  });

};

// This function takes a faceID and finds it's image url
// It then calls another function to actually display the image
/*
function getImage(photoFaceID){
  console.log("Preparing to get image");
  $.get("/matches/FID/" + photoFaceID, function(photoData) {
    console.log("Photo data found");
    console.log(photoData);
    displayReturnedImage(photoData.url);
  });
};
*/

function compareFaces(faceId, originalImageID) {
  // Base URL
  const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/findsimilars?";

  // Parameters to pass in
  const params = {
      "faceId": faceId,
      "faceListId": faceListId,
      "maxNumOfCandidatesReturned":1,
      "mode": "matchFace"
  };

  console.log(params);
  
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
      console.log("Faces compared")
      console.log(data[0]);
//      saveMatch(data[0].persistedFaceId, originalImageID, faceId, data[0].confidence);
      console.log("Persisted Face ID: " + data[0].persistedFaceId);
      interactAPI(data[0].persistedFaceId, originalImageID, faceId, data[0].confidence);
  })
  .fail(function() {
      console.log("error");
  });
};

// These functions are nested because the pass through variables caused problems with Azure's function, but the done script needs access to the variables.
function interactAPI(passedFaceID, originalImageID, faceId, confidence){

  function getImageFromFaceId(faceId) { // 
    // Base URL
    const urlBase = "https://eastus2.api.cognitive.microsoft.com/face/v1.0/facelists/86753098675309";
    
    $.ajax({
        url: urlBase,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscriptionKey);
        },
        type: "GET"
    })
    .done(function(data) {
      console.log(data);
        console.log(data.persistedFaces);
        var allFaces = data.persistedFaces;
        for (i=0; i<allFaces.length; i++) {
          if (faceId == allFaces[i].persistedFaceId) {
            console.log(allFaces[i].userData);
            displayReturnedImage(allFaces[i].userData);
            saveMatch(allFaces[i].userData, originalImageID, faceId, confidence);
            return allFaces[i].userData;
          }
        }
    })
    .fail(function() {
        console.log("error");
    });
  };

  getImageFromFaceId(passedFaceID);
};