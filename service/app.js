var args = process.argv.splice(2);
// read the configuration
var fs = require('fs')
  , config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));

if(args[0] && config[args[0]]) {
  console.log('Loading configuration for: ' + args[0]);
  config = config[args[0]];
} else {
  console.log('No configuration found. Create one in config.json');
  return;
}
var io  = require('socket.io-client')
  , socket = io.connect('127.0.0.1:3000')
  , http = require('http')
  , util = require('util')
  , hostname = myHostname()
  , srvstatus = serviceStatus(); 

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end("Listening");
}).listen(config.webserverPort);

socket.on('connect', function() {
  console.log('connected');
  socket.on('message', function(msg) {
    console.log('msg recv: ' + msg);
  });
  socket.on('name', function(reply) {
    reply(config.serviceName + " on " + hostname);
  });
  socket.on('status', function(reply) {
    reply(config.serviceName + ' is: ' + srvstatus);
  });
});

function myHostname() { 
  var exec = require('child_process').exec;
  exec("hostname", function(err, stdout, stderr) {
    hostname = stdout.toString()
  });
}

function serviceStatus() {
  var exec = require('child_process').exec;
  exec(config.statusCommand, function(err, stdout, stderr) {
    srvstatus = stdout.toString();
  });
}
