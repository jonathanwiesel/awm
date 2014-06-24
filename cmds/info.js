var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

	program
		.command('info <workflow>')
		.description('Workflow general information')
		.action(function(workflow){

			awm.readManifest(function (workflowList) {
				var selectedWF = _.find(workflowList, function(wf){
					return (wf.bundle == workflow);
				});

				if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
				else{

					console.info('Name: ' + selectedWF.name.cyan);
					console.info('Description: ' + selectedWF.short.cyan);
					console.info('Bundle ID: ' + selectedWF.bundle.cyan);
					console.info('Version: ' + selectedWF.version.cyan);
					console.info('Last updated: ' + new Date(selectedWF.updated * 1000).toLocaleString().cyan);
					console.info('Author: ' + selectedWF.author.cyan);
					console.info('Url: ' + selectedWF.url.cyan);

					if(selectedWF.categories.length > 0){
						console.info('Categories: ');
						_(selectedWF.categories).each(function(cat){
							console.info(('* ' + cat).cyan);
						}).join(', ');
					}

					if(selectedWF.osx.length > 0){
						console.info('Compatibility: ');
						_(selectedWF.osx).each(function(os){
							console.info(('* ' + os).cyan);
						}).join(', ');
					}

					if(selectedWF.webservices.length > 0){
						console.info('Webservices: ');
						_(selectedWF.webservices).each(function(webs){
							console.info(('* ' + webs).cyan);
						}).join(', ');
					}

					if(selectedWF.applications.length > 0){
						console.info('Dependent Apps: ');
						_(selectedWF.applications).each(function(apps){
							console.info(('* ' + apps).cyan);
						}).join(', ');
					}

				}
			});
		});
};
