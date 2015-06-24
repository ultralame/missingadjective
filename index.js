var server = require('./server/server.js');

var port = process.env.PORT || 1337;

server.listen(port);

console.log('Server started.');
