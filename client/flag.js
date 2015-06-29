/*
Constructor object and prototype functions for flag.
Position, and radius are defined server side and passed to players upon joining the game.
Position is an Object with x and y values eg: {x: 50, y:230}
canvasContext refers to global canvas node
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
  player.hasFlag = true;
  this.player = player;
};

/*
This is only called after a player and enemy collide after the player is carrying the flag.
Resetting player to null maintains the flag in a fixed position on the gameboard
*/
Flag.prototype.drop = function(){
  this.player = null;
  this.dropped = true;
  this.dropTimer();
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
