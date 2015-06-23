var Player = function(username, id, position, canvasContext, teamId, flag) {
  this.username = username;
  this.id = id;
  this.position = {x: position.x, y: position.y};
  this.canvasContext = canvasContext;
  this.color = "rgb(100,255,100)";
  this.team = teamId;
  this.radius = 10;
  this.hasFlag = flag;
};

Player.prototype.draw = function(){
  this.canvasContext.beginPath();
  this.canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
  this.canvasContext.fillStyle = this.color;
  this.canvasContext.fill();
  this.canvasContext.lineWidth = 2;

  if (this.team === 0){
    this.canvasContext.strokeStyle = 'rgb(0,0,200)';
  }
  else {
    this.canvasContext.strokeStyle = 'rgb(255,0,0)';
  }

  this.canvasContext.stroke();
};

Player.prototype.move = function(position) { // insert new coordinates
  this.position.x = position.x;
  this.position.y = position.y;
}
