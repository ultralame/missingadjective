var server = require('./server/server.js');
var wav = require('wav');

var port = process.env.PORT || 8000;

server.listen(port);

console.log('Server started.');


//set up binary server for handling sound
var BinaryServer = require('binaryjs').BinaryServer;
var binaryserver = new BinaryServer({port: 8080});

//binary server handling sound events
binaryserver.on('connection', function(client){
  var fileWriter = null;
  console.log('Binary Server connection started');

  client.on('stream', function(stream, meta) {
    console.log('>>>Incoming audio stream');
    // fileWriter = new wav.FileWriter('demo.wav', {
    //   channels: 1,
    //   sampleRate: 48000,
    //   bitDepth: 16
    // });
    // stream.pipe(fileWriter);
    // stream.on('end', function() {
    //   console.log('||| Audio stream ended');
    //   fileWriter.end();
    // });

    // broadcast to all other clients
    for(var id in binaryserver.clients){
      if(binaryserver.clients.hasOwnProperty(id)){
        var otherClient = binaryserver.clients[id];
        if(otherClient != client){
          var send = otherClient.createStream(meta);
          stream.pipe(send);
        }
      }
    }

    stream.on('end', function() {
      console.log('||| Audio stream ended');
    });

  });

  client.on('close', function() {
    if (fileWriter != null) {
      fileWriter.end();
    }
  });

});