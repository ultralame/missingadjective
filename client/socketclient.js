/* The purpose of this file is to set up all of our socket event listeners.
 * Used for all client-server communication
 */

var userName = function() { // prompts the user for a username on pageload
  var screenName = '';
  while(screenName === '') {
    screenName = prompt('What\'s your screenName?');
  }
  return screenName;
};

socket.emit('join', userName()); // tell server new player has joined

socket.on('getEnvironment', function(data){ // listening for data from the server to create the game board
  var envData = JSON.parse(data);
  envVariables.flag = new Flag(envData.flag.position, canvasContext, envData.flag.radius); // creates flag
  envVariables.base0 = new Base(envData.base0.position, canvasContext, 0, envData.base0.radius); // creates base 0
  envVariables.base1 = new Base(envData.base1.position, canvasContext, 1, envData.base1.radius); // creates base 1
  envVariables.score = envData.teamScores; // initializes scores to 0
  uiUpdateScore(); // renders score to page
});

socket.on('createPlayer', function(data) { // listening for data to create user's player object
  var playerData = JSON.parse(data);
  envVariables.player = new Player(playerData.name, playerData.id, playerData.position, canvasContext,
                                   playerData.team, playerData.hasFlag.position, playerData.radius);
  render(); // initializes the animation rendering loop
  uiUpdatePlayers(); // update player list
});

socket.on('newPlayer', function(data){ // listening for new player creation event from server
  var newPlayer = JSON.parse(data);
  envVariables.playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.position,
                                                        canvasContext, newPlayer.team, newPlayer.hasFlag, newPlayer.radius);
  uiUpdatePlayers(); // update player list
});

socket.on('broadcastPlayerPosition', function(data){ // listening for all updated player positions from the server
  var playerMovement = JSON.parse(data);
  envVariables.playerContainer[playerMovement.id].position = playerMovement.position;
});

socket.on('broadcastFlagPosition', function(data) { // listening for updated flag position from the server
  var flagPosition = JSON.parse(data);
  envVariables.flag.position = flagPosition.position;
});

socket.on('broadcastPlayerDisconnect', function(data) { // listening from a player disconnected event from the server
  var disconnectedPlayer = JSON.parse(data);
  var disconnectedPlayerId = disconnectedPlayer.id;

  if(disconnectedPlayer.hasFlag) { // if disconnected player had the flag, make him drop it
    envVariables.flag.drop();
  }

  delete envVariables.playerContainer[disconnectedPlayerId]; // delete the disconnected player
  uiUpdatePlayers(); // update player list
});

socket.on('updateScoreFlag', function(data) { // listens for a score event from the server
  var scoreFlagData = JSON.parse(data);

  envVariables.player.score = false; // allows the player to score again after the flag position resets
  envVariables.score = scoreFlagData.teamScores; // update scores

  envVariables.flag.position = scoreFlagData.flag.position; // reset flag position
  uiUpdateScore(); // update scoreboard
});

socket.on('winReset', function(data){ // listens for whether or not a team has won from the server
  var resetData = JSON.parse(data); // this data is used to reset player positions, flag position, and scores
  var winningTeam = resetData.winningTeamId;

  envVariables.flag.position = resetData.flag.position;
  envVariables.score = resetData.teamScores;

  envVariables.player.score = false; // allows the player to score again after the game resets

  for(var playerId in resetData.players) {
    if (envVariables.player.id === playerId) { // searches for user's player Id
      envVariables.player.position = resetData.players[playerId].position;  //gives the user's player a new position
    }
    else {
      envVariables.playerContainer[playerId].position = resetData.players[playerId].position; // reset everyone else's position
    }
  }

  uiUpdateScore(); // reset scoreboard
});
