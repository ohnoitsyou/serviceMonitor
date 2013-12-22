// Server
var express = require('express')
  , hbs = require('express-hbs')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log: false})
  , util = require('util')
  , clients;

server.listen(3000);

app.engine('hbs', hbs.express3({
  partialsDir: __dirname + '/views/partials',
  contentHelperName : 'content',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  var services = [];
  for(client in io.sockets.sockets) {
    clientRef = io.sockets.socket(client);
    service = {};
    clientRef.get('name', function(err, name) {
      service.name = name;
    });
    clientRef.get('status', function(err, srvstatus) {
      service.srvstatus = srvstatus;
    });
    services.push(service);
  }
  console.log(util.inspect(services)); 
  res.render('index', {'title': 'testing', 'service' : services}); 
});

io.sockets.on('connection', function(socket) {
  console.log('New client');
  socket.emit('name', function(name) {
    socket.set('name',name);
    //console.log('name: ' + name);
  }); 
  setTimeout(updateStatus(socket), 1000)
});
function updateStatus(socket) {
  socket.emit('status', function(srvstatus) {
    socket.set('status', srvstatus);
    //console.log('status: ' + srvstatus);
  });
}
setInterval(function() {
  for(client in io.sockets.sockets) {
    updateStatus(io.sockets.socket(client));
  }
},10000);
    
