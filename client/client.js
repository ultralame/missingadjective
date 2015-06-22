
var socket = io.connect('http://localhost:1337'); 

var name = 'fdfdsa';

socket.emit('join',name); 


