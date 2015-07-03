/*
 * Constructor object and prototype functions for flag.
 * Position, and radius are defined server side and passed to players upon joining the game.
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */

var $flagStatus = $('#flag-status');

var Flag = function(position, canvasContext, radius, model){
  this.position = {x: position.x, y: position.y};
  this.player = null; // this value used to reference which player captures flag
  this.dropped = false; //use to prevent players immediately picking back up flag after being dropped
  this.model = createFlagModel();
  this.model.position.x = this.position.x;
  this.model.position.y = 10;
  this.model.position.z = this.position.y;
  scene.add( this.model );
};

var createFlagModel = function(){
  // var flag = new THREE.BoxGeometry( 5, 30, 5 );

  var flag = new THREE.BoxGeometry( 20,10,5 );

  for (var i = 0; i < flag.vertices.length; i++) {
    flag.vertices[i].y += 10;
    flag.vertices[i].x -= 10;
  }

  var pole = new THREE.CylinderGeometry(2,2,30);

  flag.merge(pole);

  // USED FOR TEXTURING
  // var flagTexture = THREE.ImageUtils.loadTexture( 'assets/FILENAME' );
  // flagTexture.minFilter = THREE.LinearFilter;
  // flagTexture.wrapS = flagTexture.wrapT = THREE.RepeatWrapping;
  // flagTexture.wrapS = flagTexture.wrapT = THREE.ClampToEdgeWrapping;
  // flagTexture.anisotropy = 16;

  // TEXTURING:
  // var flagMesh = new THREE.MeshBasicMaterial({ color: 0xffffff, specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors,
  //                                          emissive: 0x111111, shininess: 10, map: flagTexture} );  

  var white = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
  white.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  var flagMesh = new THREE.Mesh( flag, white );
  return flagMesh;
};

/*
Attaches flag to player after successfull collision detection of player to flag
player.hasFlag value used for scoring conditions
Setting this.player tracks the current players position to attach it to them and updates its new
position to the server
*/
Flag.prototype.capturedByPlayer = function(player){
  // envVariables.player.hasFlag = true;

  // emit event to server saying player.id has flag
  socket.emit('flagPickup', JSON.stringify(player.id));


  // envVariables.moveSpeed = 4; //reduces speed for player with flag
};

/*
This is only called after a player and enemy collide after the player is carrying the flag.
Resetting player to null maintains the flag in a fixed position on the gameboard
*/
Flag.prototype.drop = function(){
  $flagStatus.text('');
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
    this.model.position.x = this.player.position.x;
    this.model.position.z = this.player.position.y;
  };
};
