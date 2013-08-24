function CollisionManager(player, others) {
  this.update = function() {
    var bounds = player.bounds();
    var nextBounds = player.nextBounds();

    for(i in others) {
      var other = others[i];

      var otherBounds = other.bounds();
      if(!(nextBounds.left > otherBounds.right || 
           nextBounds.right < otherBounds.left || 
           nextBounds.top > otherBounds.bottom ||
           nextBounds.bottom < otherBounds.top)) {
        player.collided(other, bounds, nextBounds, otherBounds);
      }
    }
  }
}