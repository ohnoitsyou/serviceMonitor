var args = process.argv.splice(2);
// read the configuration
var fs = require('fs')
  , config = JSON.parse(fs.readFileSync(__dirname + '/config.json'))
  , ioserver = config.server
  ;

console.log("connecting to: " + ioserver);

if(args[0] && config[args[0]]) {
  console.log('Loading configuration for: ' + args[0]);
  config = config[args[0]];
} else if(args[0] && !config[args[0]]) {
  console.log('No configuration found. Create one in config.json');
  return;
} else {
  console.log('No configuration specified.');
  return;
}

var io  = require('socket.io-client')
  , socket = io.connect(ioserver)
  , http = require('http')
  , hostname = ""
  , hostIP = "0.0.0.0" 
  , srvstatus = ""
  ;

// Inital variable setup
// The calls to these functions don't actually return anything so setting them up top
//   is a bit pointless...
myHostname();
serviceStatus();

// doing setInterval(serviceStatus(),10000); doesn't work. some timers error.
// This will do for now
setInterval(function() {
  var exec = require('child_process').exec;
  exec(config.statusCommand, function(err, stdout, stderr) {
    srvstatus = stdout.toString();
  });
}, config.updateInterval);

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
  socket.on('ip', function(reply) {
    reply(hostIP);
  });
  socket.on('status', function(reply) {
    reply(config.serviceName + ' is: ' + srvstatus);
  });
});

// get the hostname of the box that's running this. Reported back to the server
//   so we can track the box and the service
function myHostname() { 
  var exec = require('child_process').exec;
  exec("hostname", function(err, stdout, stderr) {
    hostname = stdout.toString();
  });
  exec("curl http://ipecho.net/plain", function(err, stdout, stderr) {
    hostIP = stdout.toString();
    console.log("ip: " + hostIP);
  });
}

// Call the user defined string to get the status of the service.
function serviceStatus() {
  var exec = require('child_process').exec;
  exec(config.statusCommand, function(err, stdout, stderr) {
    srvstatus = stdout.toString();
  });
}

/*
 * I'm thinking about creating a 'this' variable to store everything in.
 * I'll get around to it eventually.
 * Ultimately it might lead to the de-dup of that function I had to do to get
 *   intervals to work properly
 */
