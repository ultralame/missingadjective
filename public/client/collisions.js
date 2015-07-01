/*
 * Main collision detection function. Assumes the first argument will be the client's
 * own player object and the collision detection is performed against the requested
 * object. collisionObject accepts other players, the flag, and base objects.
 * Collision detection is based off distance calclulated through Pythagorean Theorem
 */

Collisions.collisionDetection = function(player, collisionObject) {   //return bool
  var distanceToFlagX = Math.pow(player.position.x - collisionObject.position.x, 2);
  var distanceToFlagY = Math.pow(player.position.y - collisionObject.position.y, 2);
  var distanceToFlag = Math.sqrt(distanceToFlagX + distanceToFlagY);
  
  //if calculated distance is less/equal to total radius of player and other object
  //there is a collision

  // if (distanceToFlag <= player.radius + collisionObject.radius) {
  //   return true;
  // }

  if (distanceToFlag <= 15) {
    return true;
  }
  else return false;
};

/*
Checks to see if player has collided with flag
updates flag info if it has been picked up

flag.dropped is only ever true after another player forces a player
carrying the flag to drop the flag.
This allows for a new player to pick up the flag after the specified time has elapsed
*/
Collisions.flagDetection = function(player, flag){
  if (!flag.dropped){
    if (this.collisionDetection(player, flag)){
      flag.capturedByPlayer(player);
      console.log('flag captured!!');
    }
  }
};



Collisions.playersDetection = function(){
  for(var playerId in envVariables.playerContainer) { // check to see if position collides with any players in game
    var otherPlayer = envVariables.playerContainer[playerId];
    Collisions.enemyDetection(envVariables.player, otherPlayer)
  }
}

/*
With different conditions that happen when a player collides with a teammate vs an enemy
This function serves as routing for the proper set of collision detection rules
*/
Collisions.playerDetection = function(player, otherPlayer){
  if (player.team === otherPlayer.team) {
    return this.teammateDetection(player, otherPlayer);
  } else {
    return this.enemyDetection(player, otherPlayer);
  }
};

/*
Only returns bool of whether or not a player collided with a teammate
*/
Collisions.teammateDetection = function(player, teammate) {
  return this.collisionDetection(player, teammate);
};

/*
If player carrying a flag collides with an enemy, initiates dropping flag commands
Either way returns bool of collision with enemy
*/
Collisions.enemyDetection = function(player, enemy) {
  var enemyCollision = this.collisionDetection(player, enemy);
  if(enemyCollision) {
    player.hasFlag = false;
    envVariables.flag.drop();
  }
  return enemyCollision;
};

/*
Checks for player to base collision under the conditions of them carrying a flag for scoring reasons
player.score is only ever true after the initial scoring collision, this avoids multiple scoring events being
triggered at once
*/
Collisions.baseDetection = function(player, base) {
  if(!player.score) {
    if (player.hasFlag && player.team === base.team){
      return this.collisionDetection(player, base);
    }
  }
};

/*
Check to see if the player collides with the boundries of the game board
direction is required since there are different dimensions of the game board in x and y axis
*/
Collisions.windowDetection = function(position, direction) {
  // tests for if moving in x or y direction
  if (direction === 'x') {
    if (position > windowVariables.minWidth + (envVariables.player.radius - .01) && position < windowVariables.maxWidth - (envVariables.player.radius - .01)) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    if (position > windowVariables.minHeight + (envVariables.player.radius - .01) && position < windowVariables.maxHeight - (envVariables.player.radius - .01)) {
      return true;
    }
    else {
      return false;
    }
  }
};
