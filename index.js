var server = require('./server/server.js');
var binaryserver = require('./server/binaryserver.js');

var port = process.env.PORT || 8000;

server.listen(port);

//set up binary server for handling sound
binaryserver.init(server);

console.log('Server started.');

//binary server handling sound events
binaryserver.server.on('connection', function (client) {
  binaryserver.eventHandler(client, binaryserver.server, console);
});

binaryserver.server.on('error', function (error) {
  console.log('!!!!!!OH NOOOO!!!!!! BINARYJS ERROR: ', error);
});