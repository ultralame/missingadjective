/*
 * The purpose of this file is to initialize variables to be used throughout the app.
 */

var envVariables = { // initialize environment variables
  player: null,
  flag: null,
  base0: null,
  base1: null,
  moveSpeed: 5,
  score: { 0: 0, 1: 0 }, // key is the team number and value is the score on initialize
  playerContainer: {}, // list of all other players in the room not including yourself
  winCondition: false,
  winningTeam: null
};

var windowVariables = { // initialize game board size
  maxWidth: 800,
  maxHeight: 600,
  minWidth: 0,
  minHeight: 0
};

var canvas = document.getElementById('canvas'); // cache our canvas
var canvasContext = canvas.getContext('2d'); // cache and set canvas to use 2d context

var keysPressedArr = []; // holds movement value on keydown; movement values spliced upon keyup
var Collisions = {};  // Initialize container to hold collision detection logic

var socket = io(); // initialize socket connection


/*
To do:

Remove all canvasContext paramaters for classes and objects since it is
now global

Move client files to folders
*/
;/*
 * This class constructor creates each team's base.
 * Position, team ID, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */

var Base = function(position, canvasContext, team, radius){
  this.canvasContext = canvasContext;
  this.position = {x: position.x, y: position.y}
  this.radius = radius || 50;
  this.team = team;

  if(this.team === 0) { // handling red or blue team sides
    this.color = "rgb(0,0,200)";
  }
  else {
    this.color = "rgb(255,0,0)";
  }
};

Base.prototype.draw = function(){
  this.canvasContext.strokeStyle = this.color;   // Set the color
  var path = new Path2D();
  path.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI, false); // Draws the outer circle
  this.canvasContext.stroke(path);

  path = new Path2D();
  path.arc(this.position.x, this.position.y, this.radius / 5, 2 * Math.PI, false); // Draws the inner circle
  this.canvasContext.stroke(path);
};
;/*
 * movementLogic handles all of the logic and proper delegation of the different types of collision detection
 * that are occuring throughout gameplay
 * Direction is a the string value of x or y needed for defining which axis the player is moving in
 * posOrNeg is a 1 or -1 value designating which direction within the axis the player is moving
 */

var movementLogic = function(direction, posOrNeg){
  var collided = false; // all collisions are false before evaluation

  envVariables.player.position[direction] += envVariables.moveSpeed * posOrNeg; //this defines the new position player is trying to move to

    for(var playerId in envVariables.playerContainer) { // check to see if position collides with any players in game
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
    movementLogic('x', 1);
  }
  if(keysPressedArr.indexOf("down") > -1){
    movementLogic('y', 1);
  }
  if(keysPressedArr.indexOf("left") > -1){
    movementLogic('x', -1);
  }
  if(keysPressedArr.indexOf("up") > -1){
    movementLogic('y', -1);
  }

  envVariables.flag.update(); // updates flag's position every cycle if it has been picked up by player
};

/*
Every render cycle the entire gameboard is redrawn to update all player's positions and flag location
*/
var draw = function(){
  if (!envVariables.winCondition){ // boolean value is only true when the game is over
    canvasContext.clearRect(windowVariables.minWidth, windowVariables.minHeight, windowVariables.maxWidth, windowVariables.maxHeight); //mandatory to clear the screen before each redraw
  }
  else {
    canvasContext.font = "72px Ariel"; // winner announcement
    if (envVariables.winningTeam === 0){ // check to see which team won the game
      canvasContext.fillText("BLUE TEAM WINS!!!!!", 25, 100);
    }
    else {
     canvasContext.fillText("RED TEAM WINS!!!!!", 25, 100); 
    }
  }
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
;/*
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
  if (distanceToFlag <= player.radius + collisionObject.radius) {
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
    }
  }
};
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
;/*
 * Constructor object and prototype functions for flag.
 * Position, and radius are defined server side and passed to players upon joining the game.
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */

var Flag = function(position, canvasContext, radius){
  this.position = {x: position.x, y: position.y};
  this.radius = radius || 2;
  this.player = null; // this value used to reference which player captures flag
  this.canvasContext = canvasContext;
  this.poleColor = "black";
  this.flagColor = "red";
  this.dropped = false; //use to prevent players immediately picking back up flag after being dropped
};

/*
Attaches flag to player after successfull collision detection of player to flag
player.hasFlag value used for scoring conditions
Setting this.player tracks the current players position to attach it to them and updates its new
position to the server
*/
Flag.prototype.capturedByPlayer = function(player){
  envVariables.player.hasFlag = true;
  this.player = player;
  envVariables.moveSpeed = 4; //reduces speed for player with flag
};

/*
This is only called after a player and enemy collide after the player is carrying the flag.
Resetting player to null maintains the flag in a fixed position on the gameboard
*/
Flag.prototype.drop = function(){
  this.player = null;
  this.dropped = true;
  this.dropTimer();
  envVariables.moveSpeed = 5; // restores original player speed
};

/*
Initilizes a period of which the flag is unable to be picked up by the player that dropped it
This allows the other team a chance to recapture the flag for their own team
Currently hard coded to 500ms
*/
Flag.prototype.dropTimer = function(){
  setTimeout(function(){
    this.dropped = false;
  }.bind(this), 500);
};

/*
Flag's position is updated every render cycle only if a player has picked it up.
*/
Flag.prototype.update = function(){
  if(this.player){
    this.position.x = this.player.position.x;
    this.position.y = this.player.position.y;
  };
};

/*
Draws the flag shape
*/
Flag.prototype.draw = function(){
  // Drawing the flag pole
  this.canvasContext.fillStyle = this.poleColor; // Set color
  this.canvasContext.fillRect(this.position.x, this.position.y-20, 5, 20); // Draw the rectangle (pole)

  // Drawing the flag
  this.canvasContext.fillStyle = this.flagColor; // Set color
  var path = new Path2D(); // draws the triangle path
  path.lineTo(this.position.x + 5, this.position.y - 20);
  path.lineTo(this.position.x + 15, this.position.y - 15);
  path.lineTo(this.position.x + 5, this.position.y - 10);
  this.canvasContext.fill(path);
};
;/*
 * The purpose of this file is to set up event listeners for key presses when the client tries to move his
 * player. Key down events will push movement values into the keysPressedArr container and key up movements
 * will splice them out. The call to requestAnimationFrame in canvas.js will continuosly redraw the player
 * position based on what's in the keysPressedArr container.
 */

$(document).ready(function(){
  $(document).keydown(function(event){  //listening for arrow keys being pressed
    if(event.keyCode === 37) {  // left
      if(keysPressedArr.indexOf("left") === -1){
        keysPressedArr.push("left");
      }
    }
    else if (event.keyCode === 38){  // up
      if(keysPressedArr.indexOf("up") === -1){
        keysPressedArr.push("up");
      }
    }
    else if (event.keyCode === 39){  // right
      if(keysPressedArr.indexOf("right") === -1){
        keysPressedArr.push("right");
      }
    }
    else if (event.keyCode === 40){  // down
      if(keysPressedArr.indexOf("down") === -1){
        keysPressedArr.push("down");
      }
    }
  });

  $(document).keyup(function(event){  //listening for arrow keys being released
    if(event.keyCode === 37) {  // left
      if(keysPressedArr.indexOf("left") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("left"), 1);
      }
    }
    else if (event.keyCode === 38){  // up
      if(keysPressedArr.indexOf("up") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("up"), 1);
      }
    }
    else if (event.keyCode === 39){  // right
      if(keysPressedArr.indexOf("right") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("right"), 1);
      }
    }
    else if (event.keyCode === 40){  // down
      if(keysPressedArr.indexOf("down") >= 0){
        keysPressedArr.splice(keysPressedArr.indexOf("down"), 1);
      }
    }
  });
});
;/*
 * This is the player superclass and is used as a basis for every player and including the user
 * Position, player, team ID, flag status, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Username is defined by user on loading the page
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */
 
var Player = function(username, id, position, canvasContext, teamId, flag, radius) {
  this.username = username;
  this.id = id;
  this.position = {x: position.x, y: position.y};
  this.canvasContext = canvasContext;
  this.team = teamId;
  if(this.team === 0) {
    this.color = "rgb(0,255,255)";
  }
  else {
    this.color = "rgb(255,153,255)";
  }
  this.radius = radius || 10;
  this.hasFlag = flag; // boolean value for having flag or not
  this.score = false; // only becomes true when a player scores a point. Avoids multiple win events at once
};

/*
Draws the player circle
*/
Player.prototype.draw = function(){
  this.canvasContext.beginPath();
  this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false); //draws player circle
  this.canvasContext.fillStyle = this.color;
  this.canvasContext.fill();
  this.canvasContext.lineWidth = 2; //outer border width

  if (this.team === 0){ //outer border color depending on which
    this.canvasContext.strokeStyle = 'rgb(0,0,200)';
  }
  else {
    this.canvasContext.strokeStyle = 'rgb(255,0,0)';
  }

  this.canvasContext.stroke();
};
;/*
 * The purpose of this file is to set up all of our socket event listeners.
 * Used for all client-server communication.
 */

var userName = function() { // prompts the user for a username on pageload
  var screenName = '';
  while(screenName === '') {
    screenName = prompt('What\'s your screenName?');
  }
  return screenName;
};

socket.emit('join', userName()); // tell server new player has joined

socket.on('getEnvironment', function(data){ // listening for data from the server to create the game board
  var envData = JSON.parse(data);
  envVariables.flag = new Flag(envData.flag.position, canvasContext, envData.flag.radius); // creates flag
  envVariables.base0 = new Base(envData.base0.position, canvasContext, 0, envData.base0.radius); // creates base 0
  envVariables.base1 = new Base(envData.base1.position, canvasContext, 1, envData.base1.radius); // creates base 1
  envVariables.score = envData.teamScores; // initializes scores to 0
  uiUpdateScore(); // renders score to page
});

socket.on('createPlayer', function(data) { // listening for data to create user's player object
  var playerData = JSON.parse(data);
  envVariables.player = new Player(playerData.name, playerData.id, playerData.position, canvasContext,
                                   playerData.team, playerData.hasFlag.position, playerData.radius);
  render(); // initializes the animation rendering loop
  uiUpdatePlayers(); // update player list
});

socket.on('newPlayer', function(data){ // listening for new player creation event from server
  var newPlayer = JSON.parse(data);
  envVariables.playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.position,
                                                        canvasContext, newPlayer.team, newPlayer.hasFlag, newPlayer.radius);
  uiUpdatePlayers(); // update player list
});

socket.on('broadcastPlayerPosition', function(data){ // listening for all updated player positions from the server
  var playerMovement = JSON.parse(data);
  envVariables.playerContainer[playerMovement.id].position = playerMovement.position;
});

socket.on('broadcastFlagPosition', function(data) { // listening for updated flag position from the server
  var flagPosition = JSON.parse(data);
  envVariables.flag.position = flagPosition.position;
});

socket.on('broadcastPlayerDisconnect', function(data) { // listening from a player disconnected event from the server
  var disconnectedPlayer = JSON.parse(data);
  var disconnectedPlayerId = disconnectedPlayer.id;

  if(disconnectedPlayer.hasFlag) { // if disconnected player had the flag, make him drop it
    envVariables.flag.drop();
  }

  delete envVariables.playerContainer[disconnectedPlayerId]; // delete the disconnected player
  uiUpdatePlayers(); // update player list
});

socket.on('updateScoreFlag', function(data) { // listens for a score event from the server
  var scoreFlagData = JSON.parse(data);

  envVariables.player.score = false; // allows the player to score again after the flag position resets
  envVariables.score = scoreFlagData.teamScores; // update scores

  envVariables.flag.position = scoreFlagData.flag.position; // reset flag position
  uiUpdateScore(); // update scoreboard
});

socket.on('winReset', function(data){ // listens for whether or not a team has won from the server
  var resetData = JSON.parse(data); // this data is used to reset player positions, flag position, and scores
  envVariables.winningTeam = resetData.winningTeamId;

  if (envVariables.player.team !== envVariables.winningTeam) { // only winning team gets victory movement
    envVariables.moveSpeed = 0;
  }

  envVariables.score = resetData.teamScores;
  envVariables.winCondition = true; //allows for render function to draw winning team's movement

  setTimeout(function() { // pauses game reset for 7 seconds to allow for winning team some fun drawing on the game
    envVariables.flag.position = resetData.flag.position;
    envVariables.player.score = false; // allows the player to score again after the game resets
    envVariables.moveSpeed = 5; // resets player movements to full speed
    envVariables.winCondition = false; // stops drawing winning team's movements
    envVariables.flag.drop(); // drops flag if it was picked up during victory
    envVariables.winningTeam = null;

    for(var playerId in resetData.players) {
      if (envVariables.player.id === playerId) { // searches for user's player Id
        envVariables.player.position = resetData.players[playerId].position;  //gives the user's player a new position
      }
      else {
        envVariables.playerContainer[playerId].position = resetData.players[playerId].position; // reset everyone else's position
      }
    }
  }, 7000);

  uiUpdateScore(); // reset scoreboard
});
;/*
 * The Team class is for everyone other player in the game outside of the user
 * Inherits functions and properties of Player superclass
 * Username, position, player, team ID, flag status, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */
 
var Team = function(username, id, position, canvasContext, teamId, radius) {
  Player.apply(this, arguments);
  this.team = teamId;
  if(this.team === 0) { // designates color based of being a teammate or enemy
    this.color = "rgb(0,0,200)";
  }
  else {
    this.color = "rgb(255,0,0)";
  }
};

Team.prototype = Object.create(Player.prototype);
Team.prototype.constructor = Team;
;/*
 * The purpose of this file is to hold the logic for updating our Stats UI, which includes the score for each
 * team, and the players currently in the room.
 */

var $ui = $('.ui'); // cache ui selector

var uiUpdateScore = function() { // update team 0 and team 1 score
  var $team0 = $('.team0 h2').text('');
  var $team1 = $('.team1 h2').text('');
  $team0.text('Blue Team\'s Score: ' + envVariables.score[0]);
  $team1.text('Red Team\'s Score: ' + envVariables.score[1]);
};

var uiUpdatePlayers = function(){ // update list of players currently in the room
  var $playerTeam0 = $('.playerteam0').html('');
  var $playerTeam1 = $('.playerteam1').html('');
  var playerTeam = 'playerteam' + envVariables.player.team;
  $('.' + playerTeam).append('<li>' + envVariables.player.username + '</li>');
  $.each(envVariables.playerContainer, function(id, player){
    var otherTeam = 'playerteam' + player.team;
    $('.' + otherTeam).append('<li>' + player.username + '</li>');
  });
};
