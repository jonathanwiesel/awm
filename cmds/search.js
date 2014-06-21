var fs = require('fs');
var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

	program
		.command('search <keyword>')
		.description('Search workflows on packal.org')
		.action(function(keyword){

			fs.readFile(awm.config.manifest, 'utf8', function (err, data) {
			  if (err) {
			    console.error(('Couldn\'t read manifest file: ' + err).bold.underline.red);
			    process.exit(1);
			  }

			  var workflowList = JSON.parse(data).manifest.workflow;

				var filtered = _.filter(workflowList, function(workflow){
					return (workflow.name[0].indexOf(keyword) > -1 || workflow.tags[0].indexOf(keyword) > -1);
				});

				if(filtered.length === 0) console.warn(('No worklflow found with the keyword ' + keyword.inverse).yellow);
				else{
					console.info('Workflows found: \n'.bold.cyan);
					filtered.forEach(function(wf){
						console.info(wf.bundle[0].cyan + ' -> ' + wf.name[0]);
					});
				}
			});
		});

};
