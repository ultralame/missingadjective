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

// need a socket event listener for score updates

