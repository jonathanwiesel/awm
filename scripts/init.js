'use strict';

var awm = require('../lib/awm');
var fs = require('fs');

if (!fs.existsSync(awm.config.directory)) {
  fs.mkdirSync(awm.config.directory);
  if(!fs.existsSync(awm.config.cacheDir)){
    fs.mkdirSync(awm.config.cacheDir);
  }
}

awm.fetchAndParseManifest(function(jsManifest){
  awm.writeManifest(jsManifest);
});
