function Player(initX, initY, fuelEnabled, img, img2, jumpImg, deadImg, cloudImg, jumpSounds, deadSounds, batterySounds, tiltSounds) {
  this.x = initX;
  this.y = initY;

  this.nextX = this.x;
  this.nextY = this.y;

  this.fuel = 10000;

  this.direction = 1;
  this.maxSpeed = 2;
  this.xAcceleration = 0.008;
  this.xVelocity = 0;

  this.onGround = false;
  this.gravityAcceleration = 0.002;
  this.yVelocity = 0;
  this.maxYSpeed = 10;

  this.jumpImpulse = -1.5;

  this.jumping = false;

  this.dead = false;
  this.tiltTime = 0;

  this.update = function(dt, keys) {
    this.nextX = this.x;
    this.nextY = this.y;

    this.fuel = Math.max(0, this.fuel-dt);

    if(this.fuel == 0 && fuelEnabled) {
      this.dead = true;
      deadSounds[Math.floor(Math.random()*deadSounds.length)].play();
    }

    if(keys['left']) {
      this.xVelocity = Math.max(-this.maxSpeed, this.xVelocity - dt * this.xAcceleration);
      this.direction = -1;
    } else if(keys['right']) {
      this.xVelocity = Math.min(this.maxSpeed, this.xVelocity + dt * this.xAcceleration);
      this.direction = 1;
    } else {
      if(this.onGround) {
        this.xVelocity *= 0.1;
      }
    }

    if(this.tiltTime == 0 &&
       this.onGround && 
       this.xVelocity != 0 && 
       ((this.xVelocity > 0) != (this.direction > 0))) {
      tiltSounds[Math.floor(Math.random()*tiltSounds.length)].play();
      this.tiltTime = 300;
    }
    this.tiltTime = Math.max(0, this.tiltTime - dt);

    if(keys['jump'] && this.onGround) {
      this.yVelocity = this.jumpImpulse;
      this.onGround = false;

      if(!this.jumping) {
        this.jumping = true;
        this.tiltTime = 0;
        jumpSounds[Math.floor(Math.random()*jumpSounds.length)].play();
      }
    }

    if(!this.onGround && !keys['jump'] && this.yVelocity > (this.jumpImpulse * 0.75)) {
      this.yVelocity = Math.max(0, this.yVelocity);
    }

    this.yVelocity = Math.min(this.maxYSpeed, this.yVelocity + (dt * this.gravityAcceleration));

    if(this.dead) {
      this.xVelocity *= 0.1;
    }

    this.nextX += (this.xVelocity * dt);
    this.nextY += (this.yVelocity * dt);
  };

  this.applyUpdate = function() {
    if(this.y < this.nextY && this.onGround) {
      this.onGround = false;
      this.jumping = false;
    }
    this.x = this.nextX;
    this.y = this.nextY;
  };

  this.render = function(context) {

    context.fillStyle="#0000FF";

    context.translate(this.x, this.y);
    context.scale(this.direction, 1);

    var rotation = 0;

    if(this.tiltTime > 275) {
      rotation = 0.3;
    } else if(this.tiltTime > 100) {
      rotation = 0.5;
    } else if(this.tiltTime > 0) {
      rotation = 0.3;
    }

    context.rotate(-rotation);

    var image = img;
    if(Date.now() % 1600 > 1200) {
      image = img2;
    }


    if(this.jumping) {
      image = jumpImg;
    }

    if(this.dead) {
      image = deadImg;
    }

    context.drawImage(image, -(img.width / 2), -(img.height / 2));

    if(this.tiltTime > 0) {
      context.drawImage(cloudImg, -60-((img.width + cloudImg.width) / 2), 75-(img.height / 2));
    }

    context.rotate(rotation);

    context.scale(this.direction, 1);

    if(fuelEnabled) {
      var fuelString = (this.fuel / 1000).toFixed(1);
      
      context.font = "bold 72px Courier";
      context.fillStyle = "white";
      context.fillText(fuelString, -40, -(img.height)+50);
      context.lineWidth = 2;
      context.strokeText(fuelString, -40, -(img.height)+50);
    }


    context.translate(-this.x, -this.y);
  };

  this.bounds = function() {
    return {
      left: this.x - (img.width / 2),
      top: this.y - (img.height / 2),
      right: this.x + (img.width / 2),
      bottom: this.y + (img.height / 2)
    };
  };

  this.nextBounds = function() {
    return {
      left: this.nextX - (img.width / 2),
      top: this.nextY - (img.height / 2),
      right: this.nextX + (img.width / 2),
      bottom: this.nextY + (img.height / 2)
    };
  };

  this.collided = function(other, bounds, nextBounds, withBounds) {
    if(other.constructor.name == "Platform") {
      if((bounds.bottom <= withBounds.top && nextBounds.bottom >= withBounds.top) || 
          (bounds.top >= withBounds.bottom && nextBounds.top <= withBounds.bottom)) {
        var yOverlap = Math.max(0, Math.min(nextBounds.bottom,withBounds.bottom) - Math.max(nextBounds.top,withBounds.top))
        if(this.y < this.nextY) {
          this.nextY -= yOverlap;
          this.onGround = true;
          this.jumping = false;
          this.yVelocity = 0;
        } else if(this.y > this.nextY) {
          this.nextY += yOverlap;
        }
      } else {
        var xOverlap = Math.max(0, Math.min(nextBounds.right,withBounds.right) - Math.max(nextBounds.left,withBounds.left))
        if(this.x < this.nextX) {
          this.nextX -= xOverlap;
          this.xVelocity = 0;
        } else if(this.x > this.nextX) {
          this.nextX += xOverlap;
          this.xVelocity = 0;
        }
      }
    } else if(other.constructor.name == "Battery") {
      if(!other.isCollected) {
        other.collected();
        batterySounds[Math.floor(Math.random()*batterySounds.length)].play();
        this.fuel = Math.min(10000, this.fuel + 1000);
      }
    } else if(other.constructor.name == "Door") {
      if(!other.isOpen) {
        other.open();
      }
    } else if(other.constructor.name == "Spike") {
      this.dead = true;
      deadSounds[Math.floor(Math.random()*deadSounds.length)].play();
      this.xVelocity = 0;
    }
  };
};

