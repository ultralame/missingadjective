//gameLogic.js



// Helper Functions
var helpers = require('./helpers.js');
var Collisions = require('./collisions.js');


//variable(s) to keep track of rooms
var roomId = 0; //the id associated to each room


//"constant" properties that will apply to all rooms and shouldn't update
var MAX_ROOM_SIZE = 6; //the maximum number of players that a room can have
var NUM_TEAMS = 2; //the number of teams
var TEAM_SIZE = MAX_ROOM_SIZE / NUM_TEAMS; //the maximum team size will be the size of the room divided by the number of teams



var LENGTH_X = 800;
var LENGTH_Y = 600;
var BASE_OFFSET_X = 150;
var BASE_RADIUS = 50;

var FLAG_RADIUS = 2;
var PLAYER_RADIUS = 10;


//object that stores default coordinates for players
//var PLAYER_DEFAULT_COORDINATES = {};
//object key/index is the team number
//PLAYER_DEFAULT_COORDINATES[0] = {x : 100, y : 100}; //for example, these are the coordinates for team 0
//PLAYER_DEFAULT_COORDINATES[1] = {x : 400, y : 300}; //and these are the coordinates for team 1


//object that stores default coordinates for objects in the game environment
var OBJECT_DEFAULT_COORDINATES = {};
//key is the name of the object in the environment
OBJECT_DEFAULT_COORDINATES['FLAG'] = {x : LENGTH_X / 2, y : LENGTH_Y / 2}; //for example, these are the coordinates for the flag
OBJECT_DEFAULT_COORDINATES['BASE0'] = {x : BASE_OFFSET_X, y : LENGTH_Y / 2}; //these are the coordinates for base 1
OBJECT_DEFAULT_COORDINATES['BASE1'] = {x : LENGTH_X - BASE_OFFSET_X, y : LENGTH_Y / 2}; //these are the coordinates for base 2




//an object that will hold the updating properties associated to each game room
//the key is the roomId
var roomProperties = {};




//valid position function will check if the position is valid (ie. no collision)
var validPosition = function(player) {

  //mark valid to false if there is a collision with another object

  //check against the flag
  if(Collisions.collisionDetection(player, roomProperties[player.room].flag) === true) {
    return false;
  }

  //check against all other players in the room
  var playersInRoom = roomProperties[player.room].players;
  for(var playerId in playersInRoom) {

    if(player.id === playersInRoom[playerId].id || playersInRoom[playerId].position === undefined) {
      continue;
    }

    if(Collisions.collisionDetection(player, playersInRoom[playerId]) === true) {
      return false;
    }

  }

  return true; //no collisions detected so return true
};


var getLocation = function(player) {

  var offset_x;
  var offset_y;  
  var range_x;
  var range_y;
  //team = 0 only spawns in left half
  if(player.team === 0) {
    offset_x = BASE_RADIUS;
    offset_y = BASE_RADIUS;    
    range_x = LENGTH_X / 2 - 2 * BASE_RADIUS;
    range_y = LENGTH_Y - 2 * BASE_RADIUS;    
  }
  //team = 1 only spawns in right half
  else if(player.team === 1) {
    offset_x = LENGTH_X / 2 + BASE_RADIUS;
    offset_y = BASE_RADIUS;
    range_x = LENGTH_X / 2 - 2 * BASE_RADIUS;
    range_y = LENGTH_Y - 2 * BASE_RADIUS; 
  }
  //team = anything else spawns in either side
  else {
    offset_x = BASE_RADIUS;
    offset_y = BASE_RADIUS;
    range_x =  LENGTH_X - 2 * BASE_RADIUS;
    range_y = LENGTH_Y - 2 * BASE_RADIUS; 
  }
  
  player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};
  //keep trying to get a new random position if the selected position is invalid
  while(validPosition(player) === false)
  {
    player.position = {x : Math.random() * range_x + offset_x, y : Math.random() * range_y + offset_y};
  }

};









//a queue that holds the players that leave
//this queue is used to keep track of empty rooms
var disconnectedPlayerQ = new helpers.Queue();


//function to initialize the room
var initRoom = function(roomId) {

  //make a new room object for the roomId
  roomProperties[roomId] = {};

  //make an object that will store the player ids of the players in the room
  roomProperties[roomId].players = {};

  //initialize the number of players in the room to zero
  roomProperties[roomId].numPlayers = 0;

  //the team number that the next joining player will join
  roomProperties[roomId].teamToJoin = 0;

  //an object that will keep track of the scores for the different teams
  //the key is the team number
  roomProperties[roomId].teamScore = {};

  //initialize scores for each team to zero
  for(var i = 0; i < NUM_TEAMS; ++i) {
    roomProperties[roomId].teamScore[i] = 0;
  }

  //put the flag in the default starting position
  roomProperties[roomId].flag = {position : OBJECT_DEFAULT_COORDINATES['FLAG'], radius : FLAG_RADIUS};

  //put the flag in the default starting position
  roomProperties[roomId].base0 = {position : OBJECT_DEFAULT_COORDINATES['BASE0'], radius : BASE_RADIUS};

    //put the flag in the default starting position
  roomProperties[roomId].base1 = {position : OBJECT_DEFAULT_COORDINATES['BASE1'], radius : BASE_RADIUS};

  //the team that has the flag; -1 means that no team has the flag
  roomProperties[roomId].teamWithFlag = -1;
};


//function to reset the room
var resetRoom = function(roomId) {

  //reset the team scores
  roomProperties[roomId].teamScore = {};
  for(var i = 0; i < NUM_TEAMS; ++i) {
    roomProperties[roomId].teamScore[i] = 0;
  }

  //reset flag position
  roomProperties[roomId].flag.position = OBJECT_DEFAULT_COORDINATES['FLAG'];

  //reset team with flag; -1 means that no team has the flag
  roomProperties[roomId].teamWithFlag = -1;

  //reset player positions
  //reset players to not have the flag
  var player;
  for(var playerId in roomProperties[roomId].players) {
    player = roomProperties[roomId].players[playerId];
    player.position = PLAYER_DEFAULT_COORDINATES[player.team];
    player.hasFlag = false;
  }

};


//function to put a player in a room
//and put the player on the correct team
var joinRoom = function(player) {
  //have player join the room
  player.join(player.room);

  //keep track of every player in the room by putting the player into the players property of the room
  //the key for each player is the player object itself
  roomProperties[player.room].players[player.id] = player;

  //increment the number of players in the room
  roomProperties[player.room].numPlayers++;

  //put the player on the appropriate team
  if(player.hasOwnProperty('team') === false) {
    //alternate putting players on different teams
    player.team = roomProperties[player.room].teamToJoin;
    roomProperties[player.room].teamToJoin++;
    if(roomProperties[player.room].teamToJoin === NUM_TEAMS) {
      roomProperties[player.room].teamToJoin = 0;
    }
  }

  //initialize the player to not have the flag
  player.hasFlag = false;

  player.radius = PLAYER_RADIUS;

  //put the player in the correct starting location
  //player.position = PLAYER_DEFAULT_COORDINATES[player.team];
  getLocation(player);

  console.log(player.name + ' has joined team '  + player.team + ' in room ' + player.room + '.');
  console.log('Starting position: ', player.position, '.');
};


//function to remove a player from a room
var leaveRoom = function(player) {
  //have player leave the room
  player.leave(player.room);

  //remove the player from the room's players property
  delete roomProperties[player.room].players[player.id];

  //decrement the number of players in the room
  roomProperties[player.room].numPlayers--;

  //put the disconnected player into the queue to see what room now has an open slot
  disconnectedPlayerQ.enqueue(player);

  console.log(player.name + ' has left team ' + player.team + ' from room ' + player.room + '.');
  //TODO: broadcast to everyone else in room that player has left
};


//function that assigns a player to a room
//  there is no real matchmaking logic at the moment
//  the function currently only assigns a player to the earliest created room with an open slot
//  or makes a new room if no created room has an open slot
var matchmaker = function(player) {

  //put player in correct room
  if(disconnectedPlayerQ.size() >= 1) { //if there is a room with an empty slot....
    var firstDisconnectedPlayer = disconnectedPlayerQ.dequeue(); //get the properties of the first disconnected player; also remove the player from the queue
    player.room = firstDisconnectedPlayer.room; //this will be the first room with an empty slot
    player.team = firstDisconnectedPlayer.team; //this is the team that the player was on
  }
  else { //if there is no room with an empty slot...
    player.room = roomId; //put player into new room that is currently being created

    //if room hasn't been created yet, then initialize the room
    if(roomProperties.hasOwnProperty(player.room) === false)
    {
      initRoom(player.room);
    }

    if(roomProperties[player.room].numPlayers + 1 === MAX_ROOM_SIZE) {
      roomId++; //increment the room id if the new room is full
    }
  }

  //have player join room
  joinRoom(player);
};



var handleWin = function() {

};


var checkForWin = function() {

};


var updateScore = function() {

  //check for win
};



var playerToPlayerContact = function(player) {

  //if contact, check if contacted player has flag
};

var playerToFlagContact = function(player) {

};

var playerToBaseContact = function(player) {

  //if contact, update the score
};



//events to check for after a player position update
var checkEvents = function(player) {

//player to player contact
//--player to player with a flag
  playerToPlayerContact(player);

//player to flag contact
  playerToFlagContact(player);

//player with flag entering base
//--fires update score condition
//----check if game win (make game win function)
  playerToBaseContact(player);

};



var createSendPlayerObj = function(player) {
  var playerToSend = {};

  playerToSend.id = player.id;
  playerToSend.name = player.name;
  playerToSend.position = player.position;
  playerToSend.team = player.team;
  playerToSend.hasFlag = player.hasFlag;

  return playerToSend;
};


var createSendEnvironmentObj = function(room) {
  var environment = {};

  environment.flag = room.flag;
  environment.base0 = room.base0;
  environment.base1 = room.base1;

  return environment;
};




//the player is the passed in socket/client
var gameLogic = module.exports = function(io, player) {

  var playerToSend;
  var environment;

  //handle player join
  player.on('join', function(name) {

    player.name = name;

    //assign the player to the correct room
    matchmaker(player);


    environment = createSendEnvironmentObj(roomProperties[player.room]);
    player.emit('getEnvironment', JSON.stringify(environment));


    playerToSend = createSendPlayerObj(player);
    player.emit('createPlayer', JSON.stringify(playerToSend));
    player.broadcast.to(player.room).emit('newPlayer', JSON.stringify(playerToSend));


    var playersInRoom = roomProperties[player.room].players;

    for(var playerId in playersInRoom) {

      if(player.id === playersInRoom[playerId].id) {
        continue;
      }

      playerToSend = createSendPlayerObj(playersInRoom[playerId]);
      player.emit('newPlayer', JSON.stringify(playerToSend));
    }

  });


  //handle player disconnect
  player.on('disconnect', function() {

    if(player.name !== undefined
      && player.room !== undefined
      && player.team !== undefined) {

      //have the player leave the room
      leaveRoom(player);

      //TODO: broadcast disconnect

    }

  });


  //update player position
  player.on('updatePosition', function(position, hasFlag) {

    player.position = JSON.parse(position);
    player.hasFlag = JSON.parse(hasFlag);

    if(player.hasFlag === true) {
      roomProperties[player.room].flag = player.position;
      player.broadcast.to(player.room).emit('broadcastFlagPosition', JSON.stringify(roomProperties[player.room].flag));
    }


    playerToSend = createSendPlayerObj(player);
    player.broadcast.to(player.room).emit('broadcastPlayerPosition', JSON.stringify(playerToSend));


    //check for events based on new player position
    checkEvents(player);

  });

};

