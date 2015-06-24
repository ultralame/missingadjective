var userName = function() {
  var screenName = '';
  while(screenName === '') {
    screenName = prompt('What\'s your screenName?');
  }
  return screenName;
}

socket.emit('join', userName());

socket.on('getEnvironment', function(data){
  var envData = JSON.parse(data);
  envVariables.flag = new Flag(envData.flag.position, canvasContext, envData.flag.radius);
  envVariables.base0 = new Base(envData.base0.position, canvasContext, 0, envData.base0.radius);
  envVariables.base1 = new Base(envData.base1.position, canvasContext, 1, envData.base1.radius);
});

socket.on('createPlayer', function(data) {
  var playerData = JSON.parse(data);
  console.log(playerData);
  envVariables.player = new Player(playerData.name, playerData.id, playerData.position, canvasContext, playerData.team, playerData.hasFlag.position, playerData.radius);
  render();
});



socket.on('newPlayer', function(data){
  var newPlayer = JSON.parse(data);
  console.log(newPlayer);

  envVariables.playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.position, canvasContext, newPlayer.team, newPlayer.hasFlag, newPlayer.radius);
});

socket.on('broadcastPlayerPosition', function(data){
  var playerMovement = JSON.parse(data);

  envVariables.playerContainer[playerMovement.id].position = playerMovement.position;
});

socket.on('broadcastFlagPosition', function(data) {
  var flagPosition = JSON.parse(data);

  envVariables.flag.position = flagPosition.position;
});

socket.on('broadcastPlayerDisconnect', function(data) {
  var disconnectedPlayer = JSON.parse(data);
  var disconnectedPlayerId = disconnectedPlayer.id;

  if(disconnectedPlayer.hasFlag) {
    envVariables.flag.drop();
  }

  delete envVariables.playerContainer[disconnectedPlayerId];
});

socket.on('updateScoreFlag', function(data) {
  var scoreFlagData = JSON.parse(data);

  envVariables.player.score = false; // allows the player to score again

  envVariables.score = scoreFlagData.teamScores; // update the scores in environment variables


  envVariables.flag.position = scoreFlagData.flag.position;

  console.log(envVariables.score);

});

socket.on('winReset', function(data){
  console.log('win reset data:', data);
  var resetData = JSON.parse(data);

  var winningTeam = resetData.winningTeamId;

  envVariables.flag.position = resetData.flag.position;
  envVariables.score = resetData.teamScores;

  for(player in resetData.players) {
    envVariables.playerContainer[player].position = resetData.players[player].position;
  }

})