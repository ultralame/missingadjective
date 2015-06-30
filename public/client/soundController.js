//soundController

socket.on('sound', function(data){ //handle sound event
  console.log('sound event received');
  
  var myAudio = document.createElement('audio');
  if (myAudio.canPlayType('audio/mpeg')) {
    myAudio.setAttribute('src','/assets/whip.wav');
  }

  myAudio.play();

});