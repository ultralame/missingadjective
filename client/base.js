var Base = function(position, ctx, team){
  this.ctx = ctx;
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
  // this.animator = new ObjectAnimator(1000);
};

Base.prototype.update = function(){
  // this.animate();
};

Base.prototype.draw = function(){
  // Set the color
  this.ctx.strokeStyle = this.color;
  // Draw a circle
  var path = new Path2D();
  path.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
  ctx.stroke(path);
};

// Base.prototype.animate = function(){
//   // Update time (get current time)
//   this.animator.updateNow();

//   // If it is time to animate
//   if(this.animator.now > this.animator.prev + this.animator.interval){
//     // Do the thing you want to do
//     if(this.teamId === 1){
//       this.color = this.color === "red" ? "rgb(0,255,0)" : "red";
//     } else {
//       this.color = this.color === "blue" ? "rgb(0,255,0)" : "blue";
//     }
//     // Save the time you animated last, so you can compare
//     this.animator.updatePrev();
//   }
// }
