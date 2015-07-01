/*
 * The Team class is for everyone other player in the game outside of the user
 * Inherits functions and properties of Player superclass
 * Username, position, player, team ID, flag status, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */
 
var Team = function(username, id, position, canvasContext, teamId, radius, model) {
  Player.apply(this, arguments);
  this.team = teamId;
  this.model = createPlayerModel();
  this.model.position.x = this.position.x;
  this.model.position.y = 10;
  this.model.position.z = this.position.y;
  scene.add(this.model);
};

Team.prototype = Object.create(Player.prototype);
Team.prototype.constructor = Team;


var createPlayerModel = function(){

  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );
  return sphere;
};