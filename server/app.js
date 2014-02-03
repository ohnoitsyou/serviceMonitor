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
app.use(express.static(__dirname + '/static'));

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
    clientRef.get('ip', function(err, ip) {
      service.ip = ip;
    });
    clientRef.get('toggle', function(err, toggle) {
      service.toggle = toggle;
    });
    service.id = clientRef.id;
    
    services.push(service);
  }
  res.render('flexindex', {'title': 'Service Status', 'service' : services}); 
});

app.post('/autoToggle/:id', function(req, res) {
  console.log('autoToggle');
  req.send('success');
});


io.sockets.on('connection', function(socket) {
  console.log('New client');
  getHostname(socket)
  getIpAddr(socket);
  setTimeout(updateStatus(socket), 1000)
});

function getHostname(socket) {
  socket.emit('name', function(name) {
    socket.set('name', name);
  });
}
function getIpAddr(socket) {
  socket.emit('ip', function(ip) {
    while(ip == "0.0.0.0") {
      setTimeout(function() {}, 2000);
    };
    socket.set('ip', ip);
    console.log('got ip');
  });
}
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
    
