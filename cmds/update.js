var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

  program
    .command('update')
    .description('         Update the manifest file from packal.org')
    .action(function(){
      awm.fetchAndParseManifest(function(remoteJsManifest){
        awm.readManifest(function(localwfList){

          _(remoteJsManifest.manifest.workflow).each(function(wf){
            var iteratingWf = _.find(localwfList, {bundle: wf.bundle});
            if(iteratingWf.version < wf.version){
              console.info(iteratingWf.bundle + ' => ' + iteratingWf.name +  '. (' + iteratingWf.version + ') -> ' + wf.version.green )
            }
          });
          
          awm.writeManifest(remoteJsManifest);
        });
      });
    });

};
