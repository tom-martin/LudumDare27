function Player(initX, initY, img, jumpImg) {
  this.x = initX;
  this.y = initY;

  this.nextX = this.x;
  this.nextY = this.y;

  this.fuel = 10000;

  this.direction = 1;
  this.maxSpeed = 2;
  this.xAcceleration = 0.004;
  this.xVelocity = 0;

  this.onGround = false;
  this.gravityAcceleration = 0.002;
  this.yVelocity = 0;
  this.maxYSpeed = 10;

  this.jumpImpulse = -1.5;

  this.jumping = false;

  this.update = function(dt, keys) {
    this.nextX = this.x;
    this.nextY = this.y;

    this.fuel = Math.max(0, this.fuel-dt);

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

    if(keys['jump'] && this.onGround) {
      this.yVelocity = this.jumpImpulse;
      this.onGround = false;
      this.jumping = true;
    }

    if(!this.onGround && !keys['jump'] && this.yVelocity > (this.jumpImpulse * 0.75)) {
      this.yVelocity = Math.max(0, this.yVelocity);
    }

    this.yVelocity = Math.min(this.maxYSpeed, this.yVelocity + (dt * this.gravityAcceleration));

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

    var image = img;
    if(this.jumping) {
      image = jumpImg;
    }

    context.drawImage(image, -(img.width / 2), -(img.height / 2));

    var fuelString = (this.fuel / 1000).toFixed(1);
    context.scale(this.direction, 1);
    
    context.font = "bold 72px Courier";
    //context.fillStyle = "black";
    //context.fillText(fuelString, -30, -(img.height)+60);
    context.fillStyle = "white";
    context.fillText(fuelString, -40, -(img.height)+50);
    context.lineWidth = 2;
    context.strokeText(fuelString, -40, -(img.height)+50);


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
        this.fuel += 1000;
      }
    } else if(other.constructor.name == "Door") {
      if(!other.isOpen) {
        other.open();
      }
    }
  };
};

