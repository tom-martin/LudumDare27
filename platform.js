function Platform(left, top, width, height, tile) {
  var cachedBounds = {
    left: left,
    top: top,
    right: left + width,
    bottom: top + height
  };

  this.render = function(context, screenBounds) {
    context.save();
    context.beginPath();
    context.rect(left,top,width,height);
    context.clip();

    if(tile.width > 0) {
      for(var y = -15; y < height; y+= tile.height-15) {
        for(var x = -50; x < width; x+= tile.width-100) {
          var tLeft = left+x;
          var tTop = top+y;
          var tRight = tLeft + tile.width;
          var tBottom = tTop + tile.height;
          if(!(tRight < screenBounds.left ||
               tLeft > screenBounds.right ||
               tBottom < screenBounds.top ||
               tTop > screenBounds.bottom)) {
            context.drawImage(tile, tLeft, tTop);
          }
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