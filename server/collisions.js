var Collisions = module.exports = {};

Collisions.collisionDetection = function(obj1, obj2) {
  //return bool
  var distanceToFlagX = Math.pow(obj1.x - obj2.x, 2);
  var distanceToFlagY = Math.pow(obj1.y - obj2.y, 2);
  var distanceToFlag = Math.sqrt(distanceToFlagX + distanceToFlagY);

  if (distanceToFlag <= obj1.radius + obj2.radius) {
    //console.log('collided!');
    return true;
  }
  else return false;
};

