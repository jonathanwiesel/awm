var awm = require('../lib/awm');
var _ = require('lodash');
var fs = require('fs-extra');

module.exports = function(program) {

  program
    .command('remove <bundleID>')
    .description('Remove specified workflow.')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + bundleID.inverse + ' according to the manifest').yellow);
        else{

          awm.getWorkflowDir(selectedWF.bundle, function(dir){
            if(!dir) console.info((bundleID.inverse + ' not installed').yellow);
            else{
              var directoryToRemove = dir.replace(/"/g, '\\\"');
              console.info(('Removing ' + directoryToRemove).green);
              fs.removeSync(directoryToRemove);
            }
          });
        }
      });
    });
};
