'use strict';

var awm = require('../lib/awm');
var fs = require('fs');

if (!fs.existsSync(awm.config.directory)) {
  fs.mkdirSync(awm.config.directory);
}

process.exit();
