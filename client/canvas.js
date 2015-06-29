/*
collisionDetection handles all of the logic and proper delegation of the different types of collision detection
that are occuring throughout gameplay
Direction is a the string value of x or y needed for defining which axis the player is moving in
posOrNeg is a 1 or -1 value designating which direction within the axis the player is moving
*/
var collisionDetection = function(direction, posOrNeg){
  var collided = false; // all collisions are false before evaluation

  envVariables.player.position[direction] += envVariables.moveSpeed * posOrNeg; //this defines the new position player is trying to move to

    for(playerId in envVariables.playerContainer) { // check to see if position collides with any players in game
    var otherPlayer = envVariables.playerContainer[playerId];
    if(Collisions.playerDetection(envVariables.player, otherPlayer)){ //playerDetection function returns true for player to player collision
      collided = true;
    }
  }

  if (Collisions.windowDetection(envVariables.player.position[direction], direction) && !collided) { // checks for player to window collision and no player to player collision
    Collisions.flagDetection(envVariables.player, envVariables.flag); // checks to see if player has captured the flag

    if(Collisions.baseDetection(envVariables.player, envVariables['base' + envVariables.player.team])) { // returns true if player has flag and entered their own base to score a point
      envVariables.player.score = true; // necessary only allowing 1 scoring condition to be met before server resets

      envVariables.player.hasFlag = null; // player drops the flag before the flag position is reset
      envVariables.flag.drop(); // drop the flag   
      
      //adding comment for no reason :D

      socket.emit('playerScores'); // send to data to server about player scoring
    }

    socket.emit('updatePosition', JSON.stringify(envVariables.player.position), JSON.stringify(envVariables.player.hasFlag)); // sends new valid player position to server and if the player has the flag or not
  }
  /* 
  Anything falling in this else statement is a non valid position for the player. Multiplying intended position by -2
  bounces the player back to a valid position
  */
  else {
    envVariables.player.position[direction] += envVariables.moveSpeed * posOrNeg * -2;
    collided = false;
  }

};

/*
During every render cyce update is called to see which keys have been pressed. For each key pressed a
different collision detection invocation is called to assess for valid movements and win conditions
*/
var update = function(){

  if(keysPressedArr.indexOf("right") > -1){
    collisionDetection('x', 1);
  }
  if(keysPressedArr.indexOf("down") > -1){
    collisionDetection('y', 1);
  }
  if(keysPressedArr.indexOf("left") > -1){
    collisionDetection('x', -1);
  }
  if(keysPressedArr.indexOf("up") > -1){
    collisionDetection('y', -1);
  }

  envVariables.flag.update(); // updates flag's position every cycle if it has been picked up by player
};

/*
Every render cycle the entire gameboard is redrawn to update all player's positions and flag location
*/
var draw = function(){
  canvasContext.clearRect(windowVariables.minWidth, windowVariables.minHeight, windowVariables.maxWidth, windowVariables.maxHeight); //mandatory to clear the screen before each redraw
  envVariables.player.draw();
  envVariables.flag.draw();
  envVariables.base0.draw();
  envVariables.base1.draw();
  for(playerId in envVariables.playerContainer) {
    envVariables.playerContainer[playerId].draw();
  }
};


/*
Animation loop for realtime game graphics and game logic
*/
var render = function(){
  update();
  draw();

  requestAnimationFrame(render); // native HTML5 animation function for screen repaints
};
