function Player(initX, initY) {
  this.x = initX;
  this.y = initY;

  this.nextX = this.x;
  this.nextY = this.y;

  this.jumping = false;

  this.speed = 0.6;
  this.xAcceleration = 0.002;
  this.gravityMax = 10;
  this.gravitySpeed = 0.4;
  this.initialJumpFuel = 650;
  this.jumpSpeed = this.gravitySpeed+0.6;
  this.jumpXSpeed = 0.8;

  this.xMomentum = 0;
  this.jumpFuel = this.initialJumpFuel;
  this.direction = 0;

  this.fuel = 10000;

  this.update = function(dt, keys) {
    this.fuel = Math.max(0, this.fuel - dt);
    

    var prevDir = this.direction;
    if(keys['right']) {
      this.direction = 1;
    } else if(keys['left']) {
      this.direction = -1;
    } else {
      this.direction = 0;
    }

    if(this.direction != prevDir) {
      this.xMomentum = 0;
    }

    if(keys['right']) {
      this.xMomentum = Math.min(this.speed, this.xMomentum + (dt * this.xAcceleration));
      
    }

    if(keys['left']) {
      this.xMomentum = Math.min(this.speed, this.xMomentum + (dt * this.xAcceleration));
    }

    if(this.direction != 0) {
      this.nextX = this.x + (dt * this.xMomentum * this.direction);
    }

    if(keys['jump'] && this.jumpFuel > 0) {
      this.jumping = true;
      var cost = (this.jumpFuel / this.initialJumpFuel);
      var jumpValue = Math.min((dt * this.jumpSpeed * cost), this.jumpFuel);
      if(jumpValue < (this.gravitySpeed * dt)) {
        jumpValue = 0;
        this.jumpFuel = 0;
      }
      this.nextY = this.y - jumpValue;
      this.jumpFuel -= jumpValue;
      
      if(this.direction != 0) {
        this.jumpFuel -= jumpValue;
      }
    } else {
      this.jumping = false;
      this.jumpFuel = 0;
    }

    this.nextY = this.nextY + Math.min(this.gravityMax, (this.gravitySpeed * dt));
  };

  this.applyUpdate = function() {
    this.x = this.nextX;
    this.y = this.nextY;
  };

  this.render = function(context) {
    context.fillStyle="#0000FF";
    context.fillRect(this.x-15,this.y-15,30,30);
  };

  this.bounds = function() {
    return {
      left: this.x - 15,
      top: this.y - 15,
      right: this.x + 15,
      bottom: this.y + 15
    };
  };

  this.nextBounds = function() {
    return {
      left: this.nextX - 15,
      top: this.nextY - 15,
      right: this.nextX + 15,
      bottom: this.nextY + 15
    };
  };

  this.collided = function(other, bounds, nextBounds, withBounds) {
    if(other.constructor.name == "Platform") {
      if((bounds.bottom > withBounds.top && bounds.bottom < withBounds.bottom) || 
          (bounds.top > withBounds.top && bounds.top < withBounds.bottom)) {
        var xOverlap = Math.max(0, Math.min(nextBounds.right,withBounds.right) - Math.max(nextBounds.left,withBounds.left))
        if(this.x < this.nextX) {
          this.nextX -= xOverlap;
        } else if(this.x > this.nextX) {
          this.nextX += xOverlap;
        }
      } else {
        var yOverlap = Math.max(0, Math.min(nextBounds.bottom,withBounds.bottom) - Math.max(nextBounds.top,withBounds.top))
        if(this.y < this.nextY) {
          this.nextY -= yOverlap;
          this.jumpFuel = this.initialJumpFuel;
        } else if(this.y > this.nextY) {
          this.nextY += yOverlap;
        }
      }
    } else if(other.constructor.name == "Battery") {
      if(!other.isCollected) {
        other.collected();
        this.fuel = 10000;
      }
    }
  };
};

