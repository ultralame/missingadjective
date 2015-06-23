var Base = function(position, canvasContext, team){
  this.canvasContext = canvasContext;
  this.x = position.x;
  this.y = position.y;
  this.r = position.r;
  this.team = team;
  if(this.team === 0) {
    this.color = "rgb(0,0,200)";
  }
  else {
    this.color = "rgb(255,0,0)";
  }
};

Base.prototype.draw = function(){
  this.canvasContext.strokeStyle = this.color;   // Set the color
  var path = new Path2D();   // Draw a circle
  path.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
  canvasContext.stroke(path);
};
