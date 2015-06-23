var socket = io();

var username = '';

while(username === '') {
  username = prompt('What\'s your username?');
}

socket.emit('join', username);

var player;

socket.on('createPlayer', function(data) {
  var playerData = JSON.parse(data);
  console.log(playerData);
  player = new Player(playerData.name, playerData.id, playerData.coordinates, ctx, playerData.team, playerData.hasFlag);

  render();

});

socket.on('newPlayer', function(data){
  var newPlayer = JSON.parse(data);
  console.log(newPlayer);

  playerContainer[newPlayer.id] = new Team(newPlayer.name, newPlayer.id, newPlayer.coordinates, ctx, newPlayer.team, newPlayer.hasFlag);
});
