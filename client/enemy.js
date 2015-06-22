var Enemy = function(username, id, position, canvas, teamId) {
  Player.apply(this, arguments);
  this.color = "rgb(255,0,0)";
};
Enemy.prototype = Object.create(Player.prototype);
Enemy.prototype.constructor = Enemy;

