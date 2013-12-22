// Server
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log: false})
  , util = require('util')
  , clients;

server.listen(3000);

app.get('/', function(req, res) {
  var resString = "";
  for( client in io.sockets.sockets) {
  clientRef = io.sockets.socket(client);
  clientName   = "";
  clientStatus = "";
  clientRef.get('name'  , function(err, name) {
    clientName = name;
  });
  clientRef.get('status', function(err,srvStatus) {
    clientStatus = srvStatus;
  });
  resString += '<div class="statusbox"><span class="clientName">' + clientName + '</span><span class="clientStatus">'+ clientStatus + '</span></div>';
  }
  res.send(resString);
  res.end();
});

io.sockets.on('connection', function(socket) {
  console.log('New client');
  socket.emit('name', function(name) {
    socket.set('name',name);
    console.log('name: ' + name);
  }); 
  setTimeout(updateStatus(socket), 1000)
});
function updateStatus(socket) {
  socket.emit('status', function(srvstatus) {
    socket.set('status', srvstatus);
    console.log('status: ' + srvstatus);
  });
}
setInterval(function() {
  for(client in io.sockets.sockets) {
    updateStatus(io.sockets.socket(client));
  }
},10000);
    
