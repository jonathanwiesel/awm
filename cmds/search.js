'use strict';

module.exports = function(program) {

	program
		.command('search <workflow>')
		.description('Search workflows on packal.org')
		.action(function(workflow){
			var fs = require('fs');
			var awm = require('../lib/awm');

			fs.readFile(awm.config.manifest, 'utf8', function (err, data) {
			  if (err) {
			    console.log('Couldn\'t read manifest file: ' + err);
			    process.exit(1);
			  }

			  var workflows = JSON.parse(data).manifest.workflow;

				//TODO: lodash filter here to obtain results
			});
		});

};
