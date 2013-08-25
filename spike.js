function Spike(left, top, width, height, tile) {
  var cachedBounds = {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  };

  this.render = function(context) {
    context.save();
    context.beginPath();
    context.rect(left,top,width,height);
    context.clip();

    if(tile.width > 0) {
      for(var x = 0; x < width; x+= tile.width) {
        context.drawImage(tile, left+x, (top+height)-tile.height);
      }
    }
    context.restore();
  };

  this.bounds = function() {

    if(cachedBounds.top == top && tile.height > 0) {
      cachedBounds.top = (top+height)-tile.height;
    }
    return cachedBounds;
  };
}