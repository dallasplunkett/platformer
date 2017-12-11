var canvas = document.getElementById("canvas").getContext("2d");
canvas.width = 800;
canvas.height = 400;
var assets = [];
var collisionBoxes = [];
var assetsLoaded = 0;
var gravity = 0.2;
var imgURLs = [
  "img/playerOne.png",
  "img/background.png",
  "img/platform.png",
  "img/brickWall.png",
  "img/tree.png"
];
var objects = [
  {
    "name": "playerOne",
    "leftKey": 37,
    "rightKey": 39,
    "jumpKey": 32,
    "currentAnimation": "midAir",
    "lastDirection": "right",
    "moveLeft": false,
    "moveRight": false,
    "jumping": false,
    "jumpForce": -4.5,
    "midAir": true,
    "onGround": false,
    "xPos": 310,
    "yPos": 100,
    "width": 20,
    "height": 34,
    "xVel": 0,
    "yVel": 0,
    "standingRight": {
      "sourceX": 0,
      "sourceY": 0,
      "sourceWidth": 20,
      "sourceHeight": 34,
      "startingX": 0,
      "totalFrames": 11,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "standingLeft": {
      "sourceX": 0,
      "sourceY": 34,
      "sourceWidth": 20,
      "sourceHeight": 34,
      "startingX": 0,
      "totalFrames": 11,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "runningRight": {
      "sourceX": 0,
      "sourceY": 68,
      "sourceWidth": 21,
      "sourceHeight": 34,
      "startingX": 0,
      "totalFrames": 7,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "runningLeft": {
      "sourceX": 0,
      "sourceY": 102,
      "sourceWidth": 21,
      "sourceHeight": 34,
      "startingX": 0,
      "totalFrames": 7,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "jumpingRight": {
      "sourceX": 223,
      "sourceY": 68,
      "sourceWidth": 17,
      "sourceHeight": 34,
      "startingX": 223,
      "totalFrames": 0,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "jumpingLeft": {
      "sourceX": 223,
      "sourceY": 102,
      "sourceWidth": 17,
      "sourceHeight": 34,
      "startingX": 223,
      "totalFrames": 0,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 5
    },
    "midAirRight": {
      "sourceX": 176,
      "sourceY": 68,
      "sourceWidth": 20,
      "sourceHeight": 34,
      "startingX": 176,
      "totalFrames": 1,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 10
    },
    "midAirLeft": {
      "sourceX": 176,
      "sourceY": 102,
      "sourceWidth": 20,
      "sourceHeight": 34,
      "startingX": 176,
      "totalFrames": 1,
      "currentFrame": 0,
      "cycles": 0,
      "delay": 10
    }
  },
  {
    "name": "background",
    "sourceX": 0,
    "sourceY": 0,
    "sourceWidth": 800,
    "sourceHeight": 400,
    "xPos": 0,
    "yPos": 0,
  },
  {
    "name": "platform",
    "sourceX": 0,
    "sourceY": 0,
    "sourceWidth": 456,
    "sourceHeight": 177,
    "xPos": 172,
    "yPos": 223,
    "width": 456,
    "height": 177,
    "hitbox": {
      "xPos": 179,
      "yPos": 244,
      "width": 442,
      "height": 156
    }
  },
  {
    "name": "brickWall",
    "sourceX": 0,
    "sourceY": 0,
    "sourceWidth": 20,
    "sourceHeight": 47,
    "xPos": 458,
    "yPos": 198,
    "width": 20,
    "height": 47
  },
  {
    "name": "tree",
    "sourceX": 0,
    "sourceY": 0,
    "sourceWidth": 123,
    "sourceHeight": 114,
    "xPos": 350,
    "yPos": 132
  }
];

var dallas = objects[0];


//////////////////////////////////////////////////////////


// apply getters to all objects
Object.prototype.centerX = function () {
  return this.xPos + (this.width / 2);
};

Object.prototype.centerY = function () {
  return this.yPos + (this.height / 2);
};


//////////////////////////////////////////////////////////


// create an image for all urls and push to an array
imgURLs.forEach(function(url) {
  createImage(url, function(img) {
    assets.push(img);
  });
});


//////////////////////////////////////////////////////////


// initilize all hitboxes
collisionBoxes.push(objects[2].hitbox);
collisionBoxes.push(objects[3]);


//////////////////////////////////////////////////////////


function init() {
  assets.forEach(function(asset) {
    asset.onload = assetsLoaded++;
    if (assetsLoaded === assets.length) {
      loop();
      window.addEventListener("keydown", function(event) {
        // PLAYER ONE
        switch(event.keyCode) {
          case dallas.leftKey:
            dallas.moveLeft = true;
            break;

          case dallas.rightKey:
            dallas.moveRight = true;
            break;

          case dallas.jumpKey:
            dallas.jumping = true;
            break;
        }
      }, false);
      window.addEventListener("keyup", function(event) {
        // PLAYER ONE
        switch(event.keyCode) {
          case dallas.leftKey:
            dallas.moveLeft = false;
            break;

          case dallas.rightKey:
            dallas.moveRight = false;
            break;

          case dallas.jumpKey:
            dallas.jumping = false;
            break;
        }
      }, false);
    }
  });
}

init();


//////////////////////////////////////////////////////////


function loop() {
  window.requestAnimationFrame(loop, canvas);
  update();
  render();
}


//////////////////////////////////////////////////////////


function update() {
  playerArtist(dallas);

  // MOVE LEFT
  if (dallas.moveLeft && !dallas.moveRight) {
    dallas.xVel -= 0.15;
  }

  // MOVE RIGHT
  if (!dallas.moveLeft && dallas.moveRight) {
    dallas.xVel += 0.15;
  }

  // NO MOVE
  if (dallas.moveLeft && dallas.moveRight || !dallas.moveLeft && !dallas.moveRight) {
    dallas.xVel = 0;
  }

  // JUMPING
  if (dallas.jumping && dallas.onGround) {
    dallas.yVel += dallas.jumpForce;
    dallas.jumping = false;
    dallas.onGround = false;
    dallas.midAir = true;
  }

  // GRAVITY
  dallas.yVel += gravity;

  //--LIMIT SPEED/VELOCITY--//
  // Right
  if (dallas.xVel > 4) {
    dallas.xVel = 4;
  }
  // LEFT
  if (dallas.xVel < -4) {
    dallas.xVel = -4;
  }
  // DOWN
  if (dallas.yVel > 8) {
    dallas.yVel = 8;
  }
  // UP
  if (dallas.yVel < -8) {
    dallas.yVel = -8;
  }

  // MOVE THE OBJECT
  dallas.xPos += dallas.xVel;
  dallas.yPos += dallas.yVel;

  // COLLISIONS
  for (var i = 0; i < collisionBoxes.length; i++) {
    var collisionSide = blockRectangle(dallas, collisionBoxes[i]);
    if (collisionSide === "bottom" && dallas.yVel >= 0) {
      dallas.onGround = true;
      dallas.midAir = false;
      dallas.yVel = -gravity;
    } else if (collisionSide === "top" && dallas.yVel <= 0) {
      dallas.yVel = 0;
    } else if (collisionSide === "right" && dallas.xVel >= 0) {
      dallas.xVel = 0;
    } else if (collisionSide === "left" && dallas.xVel <= 0) { dallas.xVel = 0;
    }
    if (collisionSide !== "bottom" && dallas.yVel > 0) {
      dallas.onGround = false;
    }
  }
  // screen edges
  // LEFT
  if(dallas.xPos < 0) {
    dallas.xPos = 0;
    dallas.xVel = 0;
  }
  // TOP
  if(dallas.yPos < 0) {
    dallas.yPos = 0;
    dallas.yVel = 0;
  }
  // RIGHT
  if(dallas.xPos + dallas.width > canvas.width) {
    dallas.xPos = canvas.width - dallas.width;
    dallas.xVel = 0;
  }

  // BOTTOM
  if (dallas.yPos + dallas.height > canvas.height) {
    dallas.yVel = 0;
    dallas.yPos = canvas.height - dallas.height;
    dallas.onGround = true;
    dallas.midAir = false;
    dallas.yVel -= gravity;
  }
}


//////////////////////////////////////////////////////////


function playerArtist(obj) {
  // running left only //
  if (obj.moveLeft && !obj.moveRight && obj.onGround && !obj.midAir && !obj.jumping) {
    obj.currentAnimation = "runningLeft";
    obj.lastDirection = "left";
    animate(obj.runningLeft);

  // running right only //
  } else if (obj.moveRight && !obj.moveLeft && obj.onGround && !obj.midAir && !obj.jumping) {
    obj.currentAnimation = "runningRight";
    obj.lastDirection = "right";
    animate(obj.runningRight);

  // standing left only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.onGround && !obj.midAir && !obj.jumping && obj.lastDirection === "left") {
    obj.currentAnimation = "standingLeft";
    obj.lastDirection = "left";
    animate(obj.standingLeft);

  // standing left only also//
  } else if (obj.moveLeft && obj.moveRight && obj.onGround && !obj.midAir && !obj.jumping && obj.lastDirection === "left") {
    obj.currentAnimation = "standingLeft";
    obj.lastDirection = "left";
    animate(obj.standingLeft);

  // standing right only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.onGround && !obj.midAir && !obj.jumping && obj.lastDirection === "right") {
    obj.currentAnimation = "standingRight";
    obj.lastDirection = "right";
    animate(obj.standingRight);

  // standing right only also //
  } else if (obj.moveLeft && obj.moveRight && obj.onGround && !obj.midAir && !obj.jumping && obj.lastDirection === "right") {
    obj.currentAnimation = "standingRight";
    obj.lastDirection = "right";
    animate(obj.standingRight);

  // jumping left and moving left //
  } else if (obj.moveLeft && !obj.moveRight && obj.jumping && obj.onGround && !obj.midAir) {
    obj.currentAnimation = "jumpingLeft";
    obj.lastDirection = "left";
    animate(obj.jumpingLeft);

  // jumping left only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.jumping && obj.onGround && !obj.midAir && obj.lastDirection === "left") {
    obj.currentAnimation = "jumpingLeft";
    obj.lastDirection = "left";
    animate(obj.jumpingLeft);

  // jumping right and moving right //
  } else if (obj.moveRight && !obj.moveLeft && obj.jumping && obj.onGround && !obj.midAir) {
    obj.currentAnimation = "jumpingRight";
    obj.lastDirection = "right";
    animate(obj.jumpingRight);

  // jumping right only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.jumping && obj.onGround && !obj.midAir && obj.lastDirection === "right") {
    obj.currentAnimation = "jumpingRight";
    obj.lastDirection = "right";
    animate(obj.jumpingRight);

  // midAir left and moving left //
  } else if (obj.moveLeft && !obj.moveRight && obj.midAir && !obj.jumping && !obj.onGround) {
    obj.currentAnimation = "midAirLeft";
    obj.lastDirection = "left";
    animate(obj.midAirLeft);

  // midAir left only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.midAir && !obj.jumping && !obj.onGround && obj.lastDirection === "left") {
    obj.currentAnimation = "midAirLeft";
    obj.lastDirection = "left";
    animate(obj.midAirLeft);

  // midAir left only also //
  } else if (obj.moveLeft && obj.moveRight && obj.midAir && !obj.jumping && !obj.onGround && obj.lastDirection === "left") {
    obj.currentAnimation = "midAirLeft";
    obj.lastDirection = "left";
    animate(obj.midAirLeft);

  // midAir right and moving right //
  } else if (obj.moveRight && !obj.moveLeft && obj.midAir && !obj.jumping && !obj.onGround) {
    obj.currentAnimation = "midAirRight";
    obj.lastDirection = "right";
    animate(obj.midAirRight);

  // midAir right only //
  } else if (!obj.moveLeft && !obj.moveRight && obj.midAir && !obj.jumping && !obj.onGround && obj.lastDirection === "right") {
    obj.currentAnimation = "midAirRight";
    obj.lastDirection = "right";
    animate(obj.midAirRight);

  // midAir right only also //
  } else if (obj.moveLeft && obj.moveRight && obj.midAir && !obj.jumping && !obj.onGround && obj.lastDirection === "right") {
    obj.currentAnimation = "midAirRight";
    obj.lastDirection = "right";
    animate(obj.midAirRight);

  }
}


//////////////////////////////////////////////////////////


function render() {

  canvas.clearRect(0, 0, canvas.width, canvas.height);

  // start after players
  for (var i = 1; i < imgURLs.length; i++) {
    draw(canvas, assets[i], objects[i]);
  }

  // PLAYER ONE
  switch (dallas.currentAnimation) {
    case "runningLeft":
      draw(canvas, assets[0], dallas, dallas.runningLeft);
      break;

    case "runningRight":
      draw(canvas, assets[0], dallas, dallas.runningRight);
      break;

    case "standingLeft":
      draw(canvas, assets[0], dallas, dallas.standingLeft);
      break;

    case "standingRight":
      draw(canvas, assets[0], dallas, dallas.standingRight);
      break;

    case "jumpingLeft":
      draw(canvas, assets[0], dallas, dallas.jumpingLeft);
      break;

    case "jumpingRight":
      draw(canvas, assets[0], dallas, dallas.jumpingRight);
      break;

    case "midAirLeft":
      draw(canvas, assets[0], dallas, dallas.midAirLeft);
      break;

    case "midAirRight":
      draw(canvas, assets[0], dallas, dallas.midAirRight);
      break;
  }
}


//////////////////////////////////////////////////////////


function animate(obj) {
  obj.cycles++;

  if (obj.cycles === obj.delay) {
    if (obj.currentFrame < obj.totalFrames) {
      obj.currentFrame++;
      obj.sourceX = obj.sourceX + obj.sourceWidth;
      obj.cycles = 0;
    } else {
      obj.sourceX = obj.startingX;
      obj.currentFrame = 0;
      obj.cycles = 0;
    }
  }
}


//////////////////////////////////////////////////////////


function draw(loc, image, obj, animation) {

  if (animation === undefined) {
    loc.drawImage(
      image,
      obj.sourceX,
      obj.sourceY,
      obj.sourceWidth,
      obj.sourceHeight,
      obj.xPos,
      obj.yPos,
      obj.sourceWidth,
      obj.sourceHeight
    );
  } else {
    loc.drawImage(
      image,
      animation.sourceX,
      animation.sourceY,
      animation.sourceWidth,
      animation.sourceHeight,
      obj.xPos,
      obj.yPos,
      animation.sourceWidth,
      animation.sourceHeight
    );
  }
}


//////////////////////////////////////////////////////////


function blockRectangle(r1, r2) {
  //A variable to tell us which side the
  //collision is occurring on
  var collisionSide = "";

  //Calculate the distance vector
  var vx = r1.centerX() - r2.centerX();
  var vy = r1.centerY() - r2.centerY();

  //Calculate the half widths
  var r1halfWidth = r1.width / 2;
  var r1halfHeight = r1.height / 2;
  var r2halfWidth = r2.width / 2;
  var r2halfHeight = r2.height / 2;

  //Figure out the combined half-widths and half-heights
  var combinedHalfWidths = r1halfWidth + r2halfWidth;
  var combinedHalfHeights = r1halfHeight + r2halfHeight;

  //Check whether vx is less than the combined half widths
  if(Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring!
    //Check whether vy is less than the combined half heights
    if(Math.abs(vy) < combinedHalfHeights) {
      //A collision has occurred! This is good!
      //Find out the size of the overlap on both the X and Y axes
      var overlapX = combinedHalfWidths - Math.abs(vx);
      var overlapY = combinedHalfHeights - Math.abs(vy);

      //The collision has occurred on the axis with the
      //*smallest* amount of overlap. Let's figure out which
      //axis that is

      if(overlapX >= overlapY) {
        //The collision is happening on the X axis
        //But on which side? vy can tell us
        if(vy > 0) {
          collisionSide = "top";

          //Move the rectangle out of the collision
          r1.yPos = r1.yPos + overlapY;
        } else {
          collisionSide = "bottom";

          //Move the rectangle out of the collision
          r1.yPos = r1.yPos - overlapY;
        }
      } else {
        //The collision is happening on the Y axis
        //But on which side? vx can tell us
        if(vx > 0) {
          collisionSide = "left";

          //Move the rectangle out of the collision
          r1.xPos = r1.xPos + overlapX;
        } else {
          collisionSide = "right";

          //Move the rectangle out of the collision
          r1.xPos = r1.xPos - overlapX;
        }
      }
    } else {
      //No collision
      collisionSide = "none";
    }
  } else {
    //No collision
    collisionSide = "none";
  }

  return collisionSide;
}


function createImage(url, callback) {
  var img = new Image();
  img.src = url;
  callback(img);
}
