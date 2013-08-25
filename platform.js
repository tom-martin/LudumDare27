function Platform(left, top, width, height, tile) {
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
      for(var y = -2; y < height; y+= tile.height-2) {
        for(var x = -50; x < width; x+= tile.width-100) {
          context.drawImage(tile, left+x, top+y);
        }
      }
    }
    context.restore();

    context.lineWidth = 20;
    context.rect(left,top,width,height);
    context.stroke();
  };

  this.bounds = function() {
    return cachedBounds;
  };
}