function Battery(x, y) {
  var cachedBounds = {
    left: x-5,
    top: y-5,
    right: x+5,
    bottom: y+5
  };

  this.isCollected = false;

  this.render = function(context) {
    if(!this.isCollected) {
      context.fillStyle="#00FF00";
      context.fillRect(x-5,y-5,10,10);
    }
  };

  this.bounds = function() {
    return cachedBounds;
  };

  this.collected = function() {
    this.isCollected = true;
  }
}