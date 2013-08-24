function Platform(left, top, width, height) {
  var cachedBounds = {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  };

  this.render = function(context) {
    context.fillStyle="#FFFFFF";
    context.fillRect(left,top,width,height);
  };

  this.bounds = function() {
    return cachedBounds;
  };
}