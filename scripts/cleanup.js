'use strict';

var awm = require('../lib/awm');
var fs = require('fs');

fs.unlinkSync(awm.config.manifest);
fs.rmdirSync(awm.config.directory);
process.exit();
