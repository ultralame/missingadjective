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
  // var base = new THREE.BoxGeometry( 30, 30, 30 );
  var BASE_HEIGHT = 3000;
  var base = new THREE.CylinderGeometry(15, 15, BASE_HEIGHT, 10, 0, true);
  var material;

  // USED FOR TEXTURING
  // var logoTexture = THREE.ImageUtils.loadTexture( 'assets/HR_logo.png' );
  // logoTexture.minFilter = THREE.LinearFilter;
  // logoTexture.wrapS = logoTexture.wrapT = THREE.RepeatWrapping;
  // logoTexture.wrapS = logoTexture.wrapT = THREE.ClampToEdgeWrapping;
  // logoTexture.anisotropy = 16;

  // TEXTURING:
  // var red = new THREE.MeshBasicMaterial( { color: 0xffffff, specular: 0xffffff, vertexColors: THREE.VertexColors,
  //                                          map: logoTexture } );
  // var blue = new THREE.MeshBasicMaterial({ color: 0xffffff, specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors,
  //                                          emissive: 0x111111, shininess: 10, map: logoTexture} );


  if (teamId === 0) {
    // red
    material = new THREE.MeshBasicMaterial( {shading: THREE.FlatShading, color: 0xeb1414, wireframe: true, wireframeLinewidth: 1} );
  } else {
    // blue
    material = new THREE.MeshBasicMaterial( {shading: THREE.FlatShading, color: 0x0033FF, wireframe: true, wireframeLinewidth: 1} );
  }
  var baseMesh = new THREE.Mesh( base, material );

  return baseMesh;
};


Base.prototype.draw = function(){
  
};
