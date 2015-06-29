var $ui = $('.ui');

var uiUpdateScore = function() {
  var $team0 = $('.team0').html('');
  var $team1 = $('.team1').html('');
  $team0.append('<h1>Blue Team\'s Score: ' + envVariables.score[0] + '</h1>');
  $team1.append('<h1>Red Team\'s Score: ' + envVariables.score[1] + '</h1>');
};

var uiUpdatePlayers = function(){
  var $playerList = $('.players').html('');
  $playerList.append('<li>' + envVariables.player.username + '</li>');
  $.each(envVariables.playerContainer, function(id, player){
    console.log(id, ' that was the id', player, ' that was the player');
    $('.players').append('<li>' + player.username + '</li>');
  });
};
