var Queue = module.exports.Queue = function(){
  this.storage = {};
  this.sizep = 0;
  this.pushIndex = 0;
  this.popIndex = 0;
};

Queue.prototype.enqueue = function(value){
  this.storage[this.pushIndex] = value;
  this.sizep++;
  this.pushIndex++;
};

Queue.prototype.dequeue = function(){
  if(this.sizep>0){
    var temp = this.storage[this.popIndex];
    delete this.storage[this.popIndex];
    this.popIndex++;
    this.sizep--;
    return temp;
  }

};

Queue.prototype.size = function(){
  return this.sizep;
};
