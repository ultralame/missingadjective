var Team = function(username, id, position, canvasContext, teamId) {
  Player.apply(this, arguments);
  this.team = teamId;
  if(this.team === 0) {
    this.color = "rgb(0,0,200)";
  }
  else {
    this.color = "rgb(255,0,0)";
  }
};

Team.prototype = Object.create(Player.prototype);
Team.prototype.constructor = Team;
