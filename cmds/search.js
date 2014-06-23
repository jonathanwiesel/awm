var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

	program
		.command('search <keyword>')
		.description('Search workflows on packal.org')
		.action(function(keyword){

			awm.readManifest(function (workflowList) {
				var filtered = _.filter(workflowList, function(workflow){
					return (workflow.name.indexOf(keyword) > -1 || workflow.tags.indexOf(keyword) > -1);
				});

				if(filtered.length === 0) console.warn(('No worklflow found with the keyword ' + keyword.inverse).yellow);
				else{
					console.info('Workflows found: \n'.bold.cyan);
					_(filtered).each(function(wf){
						console.info(wf.bundle.cyan + ' -> ' + wf.name);
					});
				}
			});

		});

};
