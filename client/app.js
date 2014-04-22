// Client
/*
  insert config reading code here
*/
var fs = require('fs')
  , config = JSON.parse(fs.readFileSync(__dirname + '/config.json'))
  ;

var express = require('express')
  , hbs = require('express-hbs')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, {log: false})
  , util = require('util')
  , exec = require('child_process').exec
  , lib = require('./lib')
  , Client = require('./Client');
  ;

//server.listen(config.port);

app.get('/', function(req, res) {
  res.send('client\n');
});


// main logic
/*
  before anything can happen we need a few 'constants'
  that will probably happen in the form of config options
*/
/*
var client = {};
client = lib.setHostname(client, config.hostname);
client = lib.setRemote(client, config.remoteServer);
client = lib.setServices(client, config.services);

console.log('Client is listening on port: ' + config.port);
console.log('Client has the hostname: ' + hostname);
console.log('Client is reporting to: ' + remote);
console.log('Client is monitoring the following services: ');
services.forEach(function(service) {
  console.log("\t" + service.name + ' by running \'' + service.command + '\'');
});

if(config.monitorMemory) {
  var meminfo = lib.memoryStat();
  client['meminfo'] = meminfo;
  console.log('Free: ' + meminfo['free']);
  console.log('used: ' + meminfo['used']);
}
if(config.monitorTemp) {
  var temp = lib.tempStat(config.convertTemp);
  client['temp'] = temp;
  if(temp !== false) {
    console.log(temp);
  } else {
    console.log("cant open temperature file");
  }
}
*/
var c = new Client(config.hostname, config.port, config.remoteServer, config.services);
c.echoThis();
console.log(c.tempStat());
c.currentStatus();
