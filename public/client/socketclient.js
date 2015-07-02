/*
 * The purpose of this file is to set up all of our socket event listeners.
 * Used for all client-server communication.
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
  envVariables.flag = new Flag(envData.flag.position, null, envData.flag.radius, createFlagModel()); // creates flag
  envVariables.base0 = new Base(envData.base0.position, null, 0, envData.base0.radius); // creates base 0
  envVariables.base1 = new Base(envData.base1.position, null, 1, envData.base1.radius); // creates base 1
  envVariables.score = envData.teamScores; // initializes scores to 0
  // uiUpdateScore(); // renders score to page
});

socket.on('createPlayer', function(data) { // listening for data to create user's player object
  var playerData = JSON.parse(data);
  envVariables.player = new Player(playerData.name, playerData.id, playerData.position, null,
                                   playerData.team, playerData.hasFlag.position, playerData.radius);
  // render(); // initializes the animation rendering loop
  // uiUpdatePlayers(); // update player list
});



socket.on('newPlayer', function(data){ // listening for new player creation event from server
  var newPlayer = JSON.parse(data);
  // create a new player model.
  envVariables.playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.position,
                                                        null, newPlayer.team, newPlayer.hasFlag, newPlayer.radius, createPlayerModel());
  // uiUpdatePlayers(); // update player list
});

socket.on('broadcastPlayerPosition', function(data){ // listening for all updated player positions from the server
  var playerMovement = JSON.parse(data);
  Collisions.playersDetection(); // checks to see if players have collided.
  envVariables.playerContainer[playerMovement.id].position = playerMovement.position;
  envVariables.playerContainer[playerMovement.id].model.position.x = playerMovement.position.x;
  envVariables.playerContainer[playerMovement.id].model.position.z = playerMovement.position.y;
});

socket.on('broadcastFlagPosition', function(data) { // listening for updated flag position from the server
  var flagPosition = JSON.parse(data);
  envVariables.flag.position = flagPosition.position;
  envVariables.flag.model.position.x = flagPosition.position.x;
  envVariables.flag.model.position.z = flagPosition.position.y;
});

socket.on('broadcastPlayerDisconnect', function(data) { // listening from a player disconnected event from the server
  var disconnectedPlayer = JSON.parse(data);
  var disconnectedPlayerId = disconnectedPlayer.id;

  if(disconnectedPlayer.hasFlag) { // if disconnected player had the flag, make him drop it
    envVariables.flag.drop();
  }

  delete envVariables.playerContainer[disconnectedPlayerId]; // delete the disconnected player
  // uiUpdatePlayers(); // update player list
});

socket.on('updateScoreFlag', function(data) { // listens for a score event from the server
  var scoreFlagData = JSON.parse(data);

  envVariables.player.score = false; // allows the player to score again after the flag position resets
  envVariables.score = scoreFlagData.teamScores; // update scores
  console.log('update score flag called!!');
  console.log(scoreFlagData); // { 0: 1, 1: 3 }
  console.log(envVariables.score[0]);
  console.log(envVariables.score[1]);
  $('#red-score').text(envVariables.score[0]);
  $('#blue-score').text(envVariables.score[1]);

  envVariables.flag.position = scoreFlagData.flag.position; // reset flag position
  envVariables.flag.model.position.x = scoreFlagData.flag.position.x; // reset flag position
  envVariables.flag.model.position.z = scoreFlagData.flag.position.y; // reset flag position
  scene.add(envVariables.flag.model);
  // uiUpdateScore(); // update scoreboard
});

socket.on('winReset', function(data){ // listens for whether or not a team has won from the server
  var resetData = JSON.parse(data); // this data is used to reset player positions, flag position, and scores
  envVariables.winningTeam = resetData.winningTeamId;
  envVariables.flag.position = {x: 0, y: 0};
  envVariables.flag.model.position.x = 0;
  envVariables.flag.model.position.z = 0;

  if (envVariables.winningTeam === 0) {
    $('#win-status').text('red team wins! get ready for the next round...');
  } else {
    $('#win-status').text('blue team wins! get ready for the next round...');
  }

  if (envVariables.player.team !== envVariables.winningTeam) { // only winning team gets victory movement
    envVariables.moveSpeed = 0;
  }

  envVariables.score = resetData.teamScores;
  envVariables.winCondition = true; //allows for render function to draw winning team's movement

  setTimeout(function() { // pauses game reset for 7 seconds to allow for winning team some fun drawing on the game
    envVariables.flag.position = resetData.flag.position;
    envVariables.player.score = false; // allows the player to score again after the game resets
    envVariables.moveSpeed = 5; // resets player movements to full speed
    envVariables.winCondition = false; // stops drawing winning team's movements
    envVariables.flag.drop(); // drops flag if it was picked up during victory
    envVariables.winningTeam = null;

    for(var playerId in resetData.players) {
      if (envVariables.player.id === playerId) { // searches for user's player Id
        envVariables.player.position = resetData.players[playerId].position;  //gives the user's player a new position
      }
      else {
        envVariables.playerContainer[playerId].position = resetData.players[playerId].position; // reset everyone else's position
      }
    }
  }, 7000);

  // uiUpdateScore(); // reset scoreboard
});
