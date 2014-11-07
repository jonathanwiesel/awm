var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

  program
    .command('update')
    .description('Update the manifest file from packal.org.')
    .action(function(){
      awm.fetchAndParseManifest(function(remoteJsManifest){
        awm.readManifest(function(localwfList){

          var newWorkflows = [];

          _(remoteJsManifest.manifest.workflow).each(function(wf){
            var iteratingWf = _.find(localwfList, {bundle: wf.bundle});
            if(iteratingWf === undefined)
              newWorkflows.push(wf);
            else if(iteratingWf.version < wf.version)
              console.info(iteratingWf.bundle + ' => ' + iteratingWf.name +  '. (' + iteratingWf.version + ') -> ' + wf.version.green);
          });

          if(newWorkflows.length > 0){
            console.info('\nNew workflows added:\n'.bold.cyan);
            _(newWorkflows).each(function(wf){
              console.info(wf.bundle + ' => ' + wf.name);
            });
          }

          awm.writeManifest(remoteJsManifest);
        });
      });
    });

};
