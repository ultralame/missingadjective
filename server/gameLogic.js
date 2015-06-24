//gameLogic.js




//required modules
var Helpers = require('./helpers.js');

var Players = require('./players.js');
var Matchmaker = require('./matchmaker.js');
var Events = require('./events.js');
var SendObject = require('./sendObject.js');
var Score = require('./score.js');




//an object that will hold the updating properties associated to each game room
//the key is the roomId
var roomProperties = {};


//a queue that holds the players that leave
//this queue is used to keep track of empty rooms
var disconnectedPlayerQ = new Helpers.Queue();




//the player is the passed in socket/client
var gameLogic = module.exports = function(io, player) {


  //temp variables that will be used throughout game logic for clarity
  var playerToSend;
  var environment;


  //handle player join
  player.on('join', function(name) {

    player.name = name;

    //assign the player to the correct room
    Matchmaker.matchmaker(player, roomProperties, disconnectedPlayerQ);

    environment = SendObject.createSendEnvironmentObj(roomProperties[player.room]);
    player.emit('getEnvironment', JSON.stringify(environment));

    playerToSend = SendObject.createSendPlayerObj(player);
    player.emit('createPlayer', JSON.stringify(playerToSend));
    player.broadcast.to(player.room).emit('newPlayer', JSON.stringify(playerToSend));

    var playersInRoom = roomProperties[player.room].players;
    for(var playerId in playersInRoom) {

      if(player.id === playersInRoom[playerId].id) {
        continue;
      }

      playerToSend = SendObject.createSendPlayerObj(playersInRoom[playerId]);
      player.emit('newPlayer', JSON.stringify(playerToSend));
    }

  });


  //handle player disconnect
  player.on('disconnect', function() {

    if(player.name !== undefined
      && player.room !== undefined
      && player.team !== undefined) {

      //have the player leave the room
      Players.leaveRoom(player, roomProperties, disconnectedPlayerQ);

      playerToSend = SendObject.createSendPlayerObj(player);
      player.broadcast.to(player.room).emit('broadcastPlayerDisconnect', JSON.stringify(playerToSend));

    }

  });


  //update player position
  player.on('updatePosition', function(position, hasFlag) {

    player.position = JSON.parse(position);
    player.hasFlag = JSON.parse(hasFlag);

    if(player.hasFlag === true) {
      roomProperties[player.room].flag.position = player.position;
      player.broadcast.to(player.room).emit('broadcastFlagPosition', JSON.stringify(roomProperties[player.room].flag));
    }

    playerToSend = SendObject.createSendPlayerObj(player);
    player.broadcast.to(player.room).emit('broadcastPlayerPosition', JSON.stringify(playerToSend));

    //check for events based on new player position
    //Events.checkEvents(player, roomProperties);

  });


  //handle player scoring
  player.on('playerScores', function() {

    Score.updateScore(player, roomProperties);

    var scoreAndFlagObject = {};
    scoreAndFlagObject.teamScores = roomProperties[player.room].teamScores;
    scoreAndFlagObject.flag = roomProperties[player.room].flag;
    io.sockets.in(player.room).emit('updateScoreFlag', JSON.stringify(scoreAndFlagObject));

  });  


};

