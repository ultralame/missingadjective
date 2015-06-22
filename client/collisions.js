var Collisions = {};

Collisions.collisionDetection = function(player, collisionObject) {
  //return bool
  var distanceToFlagX = Math.pow(player.position.x - collisionObject.x, 2);
  var distanceToFlagY = Math.pow(player.position.y - collisionObject.y, 2);
  var distanceToFlag = Math.sqrt(distanceToFlagX + distanceToFlagY);

  if (distanceToFlag <= player.radius + collisionObject.radius) {
    console.log('collided!');
    return true;
  }
  else return false;
}

Collisions.flagDetection = function(player, flag){
  if (!flag.dropped){
    if (this.collisionDetection(player, flag)){
      flag.capturedByPlayer(player);
    }
  }
};
