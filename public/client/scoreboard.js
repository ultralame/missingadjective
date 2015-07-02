/*
 * The purpose of this file is to hold the logic for updating our Stats UI, which includes the score for each
 * team, and the players currently in the room.
 */

var $scoreboard = $('.scoreboard'); // cache scoreboard selector

var uiUpdateScore = function() { // update team 0 and team 1 score
  var $team0 = $('.team0 h2').text('');
  var $team1 = $('.team1 h2').text('');
  $team0.text('Blue Team\'s Score: ' + envVariables.score[0]);
  $team1.text('Red Team\'s Score: ' + envVariables.score[1]);
};

var uiUpdatePlayers = function(){ // update list of players currently in the room
  var $playerTeam0 = $('.playerteam0').html('');
  var $playerTeam1 = $('.playerteam1').html('');
  var playerTeam = 'playerteam' + envVariables.player.team;
  $('.' + playerTeam).append('<li>' + envVariables.player.username + '</li>');
  $.each(envVariables.playerContainer, function(id, player){
    var otherTeam = 'playerteam' + player.team;
    $('.' + otherTeam).append('<li>' + player.username + '</li>');
  });
};
