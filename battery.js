function Battery(x, y, battery1Image, battery2Image) {
  var cachedBounds = {
    left: x-5,
    top: y-5,
    right: x+5,
    bottom: y+5
  };

  this.isCollected = false;

  this.collectedTime = -1;

  this.render = function(context) {
    if(!this.isCollected && battery1Image.height > 0) {

      var image = battery1Image;
      var direction = (Date.now() / 200).toFixed(0) % 4 - 1;

      context.translate(x, y);
      if(direction != 0 && direction != 2) {
        image = battery2Image;
        context.scale(direction, 1);
      }

      context.drawImage(image, -(image.width / 2), -(image.height / 2));

      if(direction != 0 && direction != 2) {
        context.scale(1 / direction, 1);
      }

      context.translate(-x, -y);
    } else if(this.collectedTime > 0) {
      var timeElapsed = (Date.now() - this.collectedTime);
      console.log(timeElapsed);
      if(timeElapsed < 1000) {
        context.font = "bold 72px Courier";
        context.fillStyle = "white";
        context.fillText("+1", x, y - (timeElapsed / 10));
        context.lineWidth = 2;
        context.strokeText("+1", x, y - (timeElapsed / 10));

      }
    }
  };

  this.bounds = function() {
    if(cachedBounds['left'] == x-5 && battery2Image.width > 0 && battery1Image.width > 0) {
      cachedBounds = {
        left: x-(battery2Image.width / 2),
        top: y-(battery1Image.height / 2),
        right: x+(battery2Image.width / 2),
        bottom: y+(battery1Image.height / 2)
      };
    }
    return cachedBounds;
  };

  this.collected = function() {
    if(!this.isCollected) {
      this.collectedTime = Date.now();
    }
    this.isCollected = true;
  }
}