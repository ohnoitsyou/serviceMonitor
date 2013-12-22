var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.send('Hello World');
});


var nginx = io.of('/nginx').on('connection', function(socket) {
  socket.emit('event' { that : 'only', '/nginx' : 'will get'});
  console.log('connected on nginx');
});

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.emit('type-query');
});
