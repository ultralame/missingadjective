var ObjectAnimator = function(interval){
  this.prev = new Date().getTime();
  this.now = new Date().getTime();

  this.updateNow = function(){
    this.now = new Date().getTime();
  };

  this.updatePrev = function(){
    this.prev = this.now;
  };
  
  this.interval = interval;
}