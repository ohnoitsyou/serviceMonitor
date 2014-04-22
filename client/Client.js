// Client.js
var fs = require('fs');
var util = require('util');
var noFile = false;

function Client(hostname, port, remote, services, convertTemp) {
  this.hostname = hostname;
  this.port = port;
  this.remote = remote;
  this.services = services;
  this.convertTemp = convertTemp || false;
}

Client.prototype.tempStat = function(convert) {
  var convert = convert || false;
  var tempC = 0.0;
  if(!noFile) {
    try {
      tempC = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp").toString();
      tempC = splitValue(tempC,2,".");
      return convert ?
        tempC * 1.8 + 32 :
        tempC;
    } catch(e) {
      // It's ok that we can't read that file, it exists on my raspi, but not on my VPS
      //   also, different systems might have a different location for that info
      // More testing is required to see what the case is on more systems.
      noFile = true;
      return tempC;
    }
  } else {
    return tempC;
  }
}
// I should add error checking here too, when the file cant be read, then return a sensible value
Client.prototype.memoryStat = function() {
  var total, free, used;
  var lines = fs.readFileSync("/proc/meminfo").toString().split("\n");
  for(var line in lines) {
    line = lines[line];
    var t = /MemTotal:(\s)(.*) (kB)/g.exec(line);
    var f  = /MemFree:(\s)(.*) (kB)/g.exec(line);
    if(t) {
      total = t[2].trim();
    }
    if(f) {
      free = f[2].trim();
    }
  }
  used = total - free;
  return {'total':total, 'free':free, 'used': used.toString()};
}

Client.prototype.socketOutput = function() {
  // We first want to get updated information about memory and temp
  var tempInfo = this.tempStat();

  var output = {};
  output.hostname = this.hostname;
  output.memoryInfo = this.memoryStat();
  if(tempInfo) {
    output.tempInfo = tempInfo;
  }
  return output;
}

Client.prototype.currentStatus = function() {
  console.log('Client\'s hostname is: ' + this.hostname);
  console.log('Client is listening on port: ' + this.port);
  console.log('Client is reporting to: ' + this.remote);
  console.log('Client is monitoring the following services:');
  this.services.forEach(function(service) {
    console.log("\t" + service.name + ' by running: \'' + service.command + '\'');
  });
  var memoryInfo = this.memoryStat();
  var memoryPercent = (memoryInfo.used / memoryInfo.total) * 100;
  var tempInfo = this.tempStat(this.convertTemp);
  console.log('Client is using ' + memoryInfo.used + '/' + memoryInfo.total + ' kB of memory (' + memoryPercent + '%)'); 
  var tempUnit = this.convertTemp ? 'F' : 'C';
  if(tempInfo) {
    console.log('Client is operating at: ' + tempInfo + tempUnit);
  }
}

Client.prototype.echoThis = function() {
  console.log(util.inspect(this));
}

function splitValue(value, index, seperator) {
  return value.substring(0, index) + seperator + value.substring(index);
}

module.exports = Client;
