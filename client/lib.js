var fs = require('fs');
var noFile = false;
exports.memoryStat = function() {
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

exports.tempStat = function(convert) {
  var convert = convert || false;
  if(!noFile) {
    try {
      var tempC = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp").toString();
      tempC = splitValue(tempC,2,".");
      return convert ?
        tempC * 1.8 + 32 :
        tempC;
    } catch(e) {
      // It's ok that we can't read that file, it exists on my raspi, but not on my VPS 
      //   also, different systems might have a different location for that info
      // More testing is required to see what the case is on more systems.
      noFile = true;
      return false;
    }
  } else {
    return false;
  }
}

function splitValue(value, index, seperator) {
  return value.substring(0, index) + seperator + value.substring(index);
}
