var socket = io();

var username = '';

while(username === '') {
  username = prompt('What\'s your username?');
}

socket.emit('join', username);

var player, flag, base1, base2;

socket.on('getEnvironment', function(data){
  var envData = JSON.parse(data);
  flag = new Flag(envData.flag, ctx);
  base1 = new Base(envData.base1, ctx, 0);
  base2 = new Base(envData.base2, ctx, 1);
});

socket.on('createPlayer', function(data) {
  var playerData = JSON.parse(data);
  console.log(playerData);
  player = new Player(playerData.name, playerData.id, playerData.position, ctx, playerData.team, playerData.hasFlag);
  render();
});



socket.on('newPlayer', function(data){
  var newPlayer = JSON.parse(data);
  console.log(newPlayer);

  playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.position, ctx, newPlayer.team, newPlayer.hasFlag);
});

socket.on('broadcastPlayerPosition', function(data){
  var playerMovement = JSON.parse(data);

  playerContainer[playerMovement.id].position = playerMovement.position;
});

socket.on('broadcastFlagPosition', function(data) {
  var flagPosition = JSON.parse(data);

  flag.position = flagPosition;
});
