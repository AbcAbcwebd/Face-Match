var autoHit = "sim";

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
/*
  $( "#test-button" ).click(function() {
    console.log("Clicked");
    console.log(userPrefix.js);
  //  $('#cube').style([userPrefix.js + 'Transform'] = 'rotateX(' + 200 + 'deg) rotateY(' + 310 + 'deg)');
  //  $('#cube').css('-webkit-transform', 'rotate(7deg)');
  //   Viewport.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';
      autoHit = 6;
  });
*/
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
          $('.modal-content').append(welcomeMessage);
          setTimeout(function(){
            $('.modal').css('display', 'none');
          }, 4000);
          updateDropdown();
          $('#menu-dropdown').removeClass("show");
          $('#menu-dropdown').css('display', 'none');
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
    $.post("/signup", signInData, function(data) {
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
       };
    });
  });

});

function processImage() {
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************

    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = "97ac73fdfd3e437eabe5b247495fa471";

    // Replace or verify the region.
    //
    // You must use the same region in your REST API call as you used to obtain your subscription keys.
    // For example, if you obtained your subscription keys from the westus region, replace
    // "westcentralus" in the URI below with "westus".
    //
    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };

    // Display the image.
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ? 
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
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

// This replaces the default dropdown menu with one designed for users who are already signed in.
function updateDropdown(){
  $('#menu-dropdown').empty();
  $('#menu-dropdown').append('<a id="view-matches-btn">View Past Matches</a>');
};

function loadDynamicContent(){
  var signInStatus = checkSignInStatus();
  if (signInStatus === "Signed In"){
    updateDropdown();
  }
}