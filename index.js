var server = require('./server/server.js');

var port = process.env.PORT || 8000;

server.listen(port);

console.log('Server started.');


//set up binary server for handling sound
var BinaryServer = require('binaryjs').BinaryServer;
var binaryserver = new BinaryServer({server: server, path: '/binary-endpoint'});

//binary server handling sound events
binaryserver.on('connection', function(client){

  console.log('Binary Server connection started');

  client.on('stream', function(stream, meta) {

    console.log('>>>Incoming audio stream');
    // var clients = [];


    // broadcast to all other clients
    for(var id in binaryserver.clients){
      if(binaryserver.clients.hasOwnProperty(id)){
        var otherClient = binaryserver.clients[id];
        if(otherClient != client){
          var send = otherClient.createStream(meta);
          // clients.push(send);
          stream.pipe(send);
        } // if (otherClient...
      } // if (binaryserver...
    } // for (var id in ...

    stream.on('end', function() {
      console.log('||| Audio stream ended');
    });

  });

  client.on('close', function() {
    //client exits
  });

});