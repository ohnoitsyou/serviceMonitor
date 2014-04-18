var fs = require('fs');
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

exports.tempStat = function() {

}
