var ss = require('socket.io-stream');

module.exports = function (io, socket) {

  //handle sound event
  socket.on('sound', function (data) {
    console.log('===========> broadcast sound event');
    socket.broadcast.emit('sound', data);
  });

  ss(socket).on("audio", function (stream) {
    console.log('============> audio event received');
    // console.dir(stream);
   
    // var fileWriter = new wav.FileWriter('demo.wav', {
    //   channels: 1,
    //   sampleRate: 48000,
    //   bitDepth: 16
    // });

    // stream.pipe(fileWriter);

    // stream.on('end', function() {
    //   fileWriter.end();
    // });

    var buffer = "";
    stream.on("data", function (data) {
        // buffer += data.toString();
        console.dir(data);
    });
    stream.on("end", function () {
        // console.log(buffer);
        console.log('>>> Stream Ended <<<');
    });

  });

};