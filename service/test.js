
var io  = require('socket.io-client')
  , socket = io.connect('127.0.0.1:3000')
  , http = require('http')
  , util = require('util');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end("Listening");
}).listen(3001);

socket.on('connect', function() {
  console.log('connected');
  socket.on('status', function(reply) {
    reply('Active');
    // update this with the response from the 
    //  'service nginx status | grep "Active"' 
    // command
  });

  socket.on('message', function(msg) {
    console.log('msg rec: ' + msg);
  });
  socket.on('name', function(reply) {
    reply('nginx');
    // update this with the actual name set in
    // the config file
  });
});
