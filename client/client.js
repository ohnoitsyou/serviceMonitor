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
var hostname = config.hostname
  , remote = config.remoteServer
  , services = config.services
  , client = {}
  ;

console.log('Client is listening on port: ' + config.port);
console.log('Client has the hostname: ' + hostname);
console.log('Client is reporting to: ' + remote);
console.log('Client is monitoring the following services: ');
services.forEach(function(service) {
  console.log("\t" + service.name + ' by running \'' + service.command + '\'');
});

if(config.monitorMemory) {
  var meminfo = lib.memoryStat();
  console.log('Free: ' + meminfo['free']);
  console.log('used: ' + meminfo['used']);
}
if(config.monitorTemp) {
  lib.tempStat();
}
