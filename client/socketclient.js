var socket = io();

var username = '';

while(username === '') {
  username = prompt('What\'s your username?');
}

socket.emit('join', username);

var player;

socket.on('createPlayer', function(data) {
  var playerData = JSON.parse(data);
  player = new Player(username, playerData.id, playerData.coordinates, ctx, playerData.team, playerData.hasFlag);

  render();

});
