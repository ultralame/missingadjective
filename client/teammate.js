var Teammate = function(username, id, position, canvas, teamId) {
  Player.apply(this, arguments);
  this.color = "rgb(0,0,200)";
};
Teammate.prototype = Object.create(Player.prototype);
Teammate.prototype.constructor = Teammate;
