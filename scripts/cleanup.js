'use strict';

var awm = require('../lib/awm');
var fs = require('fs-extra');

fs.removeSync(awm.config.directory);
process.exit();
