var Base = function(position, canvasContext, team, radius){
  this.canvasContext = canvasContext;
  this.position = {x: position.x, y: position.y}
  this.radius = radius || 50;
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
  path.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI, false);
  this.canvasContext.stroke(path);

  path = new Path2D();
  path.arc(this.position.x, this.position.y, this.radius / 5, 2 * Math.PI, false);
  this.canvasContext.stroke(path);
};
