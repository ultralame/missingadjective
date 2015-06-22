var Flag = function(x, y, ctx){
  this.x = x;
  this.y = y;
  this.interactionRadius = 3;
  this.player = null;
  this.ctx = ctx;
  this.poleColor = "black";
  this.flagColor = "red";
  this.animator = new ObjectAnimator(1000);
};

Flag.prototype.capturedByPlayer = function(player){
  this.player = player;
};

Flag.prototype.drop = function(){
  this.player = null;
};

Flag.prototype.update = function(){
  if(this.player){
    this.x = player.position.x; //change it to "x" for circle
    this.y = player.position.y; //change it to "y" for circle
  };
};

Flag.prototype.draw = function(){
  // Drawing the flag pole
  this.ctx.fillStyle = this.poleColor; // Set color
  this.ctx.fillRect(this.x, this.y-20, 5, 20); // Draw the rectangle (pole)

  // Drawing the flag
  this.ctx.fillStyle = this.flagColor; // Set color
  var path = new Path2D(); // Draw triangle
    path.lineTo(this.x + 5, this.y - 20);
    path.lineTo(this.x + 15, this.y - 15);
    path.lineTo(this.x + 5, this.y - 10);
  this.ctx.fill(path);
};

Flag.prototype.animate = function(){

};