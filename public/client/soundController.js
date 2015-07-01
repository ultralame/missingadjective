//soundController

//initializing variables;
var soundController = {};
soundController.recording = false;

//binaryJS connection
var host = location.origin.replace(/^http/, 'ws') + '/binary-endpoint';
console.log(host);
var client = new BinaryClient(host);
var audioContext = window.AudioContext || window.webkitAudioContext;

//////////////////////////////////////////////////
// MICROHPONE ACCESS
//////////////////////////////////////////////////
navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
   getUserMedia: function(c) {
     return new Promise(function(y, n) {
       (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, y, n);
     });
   }
} : null);

if (!navigator.mediaDevices) {
  console.log("getUserMedia() not supported.");
}

soundController.device = navigator.mediaDevices.getUserMedia({ audio: true, video: false });

soundController.device.then(function (stream) {
  var context = new audioContext();
  var audioInput = context.createMediaStreamSource(stream);
  var bufferSize = 4096;
  // create a javascript node
  soundController.recorder = context.createScriptProcessor(bufferSize, 1, 1);
  // specify the processing function
  soundController.recorder.onaudioprocess = soundController.recorderProcess;
  // connect stream to our recorder
  audioInput.connect(soundController.recorder);
  // connect our recorder to the previous destination
  soundController.recorder.connect(context.destination);
});

soundController.device.catch(function (err) {
  console.log("The following error occured: " + err.name);
});

function convertFloat32ToInt16(buffer) {
  l = buffer.length;
  buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l])*0x7FFF;
  }
  return buf.buffer;
}

soundController.recorderProcess = function (e) {
  var left = e.inputBuffer.getChannelData(0);
  if (soundController.recording === true) {
    // var chunk = convertFloat32ToInt16(left);
    var chunk = left;
    console.dir(chunk);
    soundController.stream.write(chunk);
  }
};

soundController.startRecording = function () {

  if (soundController.recording === false) {
    console.log('>>> Start Recording');

    //open binary stream
    soundController.stream = client.createStream();
    soundController.recording = true;
  }

};

soundController.stopRecording = function () {
  
  if (soundController.recording === true) {
    console.log('||| Stop Recording');

    soundController.recording = false;

    //close binary stream
    soundController.stream.end();
  }
};

//////////////////////////////////////////////////
// BINARYJS EVENTS
//////////////////////////////////////////////////
soundController.speakerContext = new audioContext();

client.on('open', function() {
  console.log('BinaryJS Connection Open');
});

client.on('stream', function (stream) {
  var nextStartTime = 0;

  console.log('>>> Receiving Audio Stream');

  stream.on('data', function (data) {
    var array = new Float32Array(data);

    var buffer = soundController.speakerContext.createBuffer(1, 4096, 44100);
    buffer.copyToChannel(array, 0);

    var source = soundController.speakerContext.createBufferSource();
    source.buffer = buffer;
    source.connect(soundController.speakerContext.destination);
    // console.log('Playing buffer:', buffer.duration);
    // console.log('nextStartTime:', nextStartTime);
    // source.start(nextStartTime);
    source.start();

    // if (nextStartTime === 0) {
    //   nextStartTime = soundController.speakerContext.currentTime
    // } else {
    //   nextStartTime = nextStartTime + buffer.duration
    // }
  });

  stream.on('end', function () {
    console.log('||| End of Audio Stream');    
  });

});


//////////////////////////////////////////////////
// SOCKET.IO EVENTS
//////////////////////////////////////////////////
soundController.emitSound = function () {
  socket.emit('sound');
};

socket.on('sound', function(data){ //handle sound event
  console.log('sound event received');
  
  var myAudio = document.createElement('audio');
  if (myAudio.canPlayType('audio/mpeg')) {
    myAudio.setAttribute('src','/assets/whip.wav');
  }

  myAudio.play();

});

