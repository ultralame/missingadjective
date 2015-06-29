/* 
This class constructor creates each team's base. 
Position, team ID, and radius are defined server side and passed to players upon joining the game.
Team Id is either 0 or 1
Position is an Object with x and y values eg: {x: 50, y:230}
canvasContext refers to global canvas node
*/
var Base = function(position, canvasContext, team, radius){
  this.canvasContext = canvasContext;
  this.position = {x: position.x, y: position.y}
  this.radius = radius || 50;
  this.team = team;

  if(this.team === 0) { //handling red or blue team sides
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
