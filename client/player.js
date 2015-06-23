var Player = function(username, id, position, canvas, teamId) {
  this.username = username;
  this.id = id;
  this.position = {x: position.x, y: position.y};
  this.canvasContext = canvas;
  this.speed = 0;
  this.color = "rgb(100,255,100)";
  this.team = teamId;
  this.radius = 10;
  this.hasFlag = false;
};

Player.prototype.draw = function(){
  // this.canvasContext.fillRect(this.position.x1, this.position.y1, this.position.x2, this.position.y2);

  this.canvasContext.beginPath();
  this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
  this.canvasContext.fillStyle = this.color;
  this.canvasContext.fill();
  this.canvasContext.lineWidth = 2;
  this.canvasContext.strokeStyle = '#000';
  this.canvasContext.stroke();
};

Player.prototype.move = function(position) {
  // insert new coordinates
  this.position.x = position.x;
  this.position.y = position.y;
}
