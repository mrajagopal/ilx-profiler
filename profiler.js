"use strict";

var profiler = require('v8-profiler');
var fs = require('fs');
var process = require('process');


profiler.setSamplingInterval(100);

class Profiler {
    constructor(profileTag) {
        this.profileTag = profileTag;
    }

    start(req, res) {
        profiler.startProfiling(this.profileTag, true);
        return res.reply('Profiling started for ' + this.profileTag + "\n");
    }

    doneWrite() {
        console.log('Done writing profile data');
    }

    stop(req, res) {
        var cpuprofile = profiler.stopProfiling(this.profileTag);
        cpuprofile.export(function(error, result) {
          fs.writeFile('/tmp/'+this.profileTag+'.'+process.pid+'.cpuprofile', result, this.doneWrite);
          cpuprofile.delete();
        });
    res.reply('Profiling stopped for ' + this.profileTag + "\n");
    }
}

module.exports = Profiler;

