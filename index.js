var server = require('./server/server.js');

var port = process.env.PORT || 8000;

server.listen(port);

console.log('Server started.');
