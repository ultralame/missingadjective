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

Collisions.playerDetection = function(myPlayer, otherPlayer){
  if (myPlayer.team === otherPlayer.team) {
    this.teammateDetection(myPlayer, otherPlayer);
  } else {
    this.enemyDetection(myPlayer, otherPlayer);
  }
};

Collisions.teammateDetection = function(myPlayer, teammate) {
  if(this.collisionDetection(myPlayer, teammate)){
    
  }
};

Collisions.enemyDetection = function(myPlayer, enemy) {

};

Collisions.windowDetection = function(position, direction) {
  // tests for if moving in x or y direction
  if (direction === 'x') {
    if (position > minWidth + (player.radius - .01) && position < maxWidth - (player.radius - .01)) {
      return true;
    }
    else {
      console.log('we be stuck X');
      return false;
    }
  }
  else {
    if (position > minHeight + (player.radius - .01) && position < maxHeight - (player.radius - .01)) {
      return true;
    }
    else {
      console.log('we be stuck Y');
      return false;
    }
  }
}