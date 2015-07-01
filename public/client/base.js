/*
 * This class constructor creates each team's base.
 * Position, team ID, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */

var Base = function(position, canvasContext, team, radius){
  this.position = {x: position.x, y: position.y}
  this.team = team;
};

Base.prototype.draw = function(){
  
};
