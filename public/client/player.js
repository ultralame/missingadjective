/*
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
