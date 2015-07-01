module.exports = function (io, socket) {

  //handle sound event
  socket.on('sound', function (data) {
    console.log('===========> broadcast sound event');
    io.emit('sound', data);
  });

};