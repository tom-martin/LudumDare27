function Door(x, y, door1Image, door2Image, openDoorImage) {
  var cachedBounds = {
    left: x-5,
    top: y-5,
    right: x+5,
    bottom: y+5
  };

  this.isOpen = false;

  this.render = function(context) {
    var image = door1Image;
    if(this.isOpen) {
      image = openDoorImage;
    } else if((Date.now() / 500).toFixed(0) % 2 == 0) {
      image = door2Image;
    }
    if(image.width > 0) {
      context.drawImage(image, x-(image.width / 2), y-(image.height / 2));     
    }
  };

  this.bounds = function() {
    if(cachedBounds['left'] == x-5 && door1Image.width > 0) {
      cachedBounds = {
        left: x-(door1Image.width / 2),
        top: y-(door1Image.height / 2),
        right: x+(door1Image.width / 2),
        bottom: y+(door1Image.height / 2)
      };
    }
    return cachedBounds;
  };

  this.open = function() {
    this.isOpen = true;
  }
}