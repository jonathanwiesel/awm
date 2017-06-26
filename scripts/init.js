'use strict';

var awm = require('../lib/awm');
var fs = require('fs-extra');

if (!fs.existsSync(awm.config.cacheDir)) {
  fs.mkdirpSync(awm.config.cacheDir);
}

awm.fetchAndParseManifest(function(jsManifest){
  awm.writeManifest(jsManifest);
});
