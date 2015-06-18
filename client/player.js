var Player = function(username, id, position, canvas) {
  this.username = username;
  this.id = id;
  this.position = {x1: position.x1, x2: position.x2, y1: 20, y2: 20};
  this.canvasContext = canvas;
  this.speed = 0;
};

Player.prototype.draw = function(){
  /// insert render code
  this.canvasContext.fillRect(this.position.x1, this.position.y1, this.position.x2, this.position.y2);
};

Player.prototype.move = function(position) {
  // insert new coordinates
  this.position.x1 = position.x1;
  this.position.x2 = position.x2;
  this.position.y1 = position.y1;
  this.position.y2 = position.y2;
}
