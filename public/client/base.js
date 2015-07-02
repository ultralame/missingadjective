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
  this.model = createBaseModel(team);

  this.model.position.x = this.position.x;
  this.model.position.y = 10;
  this.model.position.z = this.position.y;
  scene.add( this.model );
};


var createBaseModel = function(teamId){
  var base = new THREE.BoxGeometry( 30, 30, 30 );
  var material;
  if(teamId === 1){
    material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
  }else{
    material = new THREE.MeshPhongMaterial( { color: 0x000fff, specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
  }
  var baseMesh = new THREE.Mesh( base, material );

  return baseMesh;
};


Base.prototype.draw = function(){
  
};
