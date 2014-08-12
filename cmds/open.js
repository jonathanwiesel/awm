var awm = require('../lib/awm');
var _ = require('lodash');
var exec = require('child_process').exec;

module.exports = function(program) {

  program
    .command('open <bundleID>')
    .description('Open specified workflow\'s directory.')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + bundleID.inverse + ' according to the manifest').yellow);
        else{

          awm.getWorkflowDir(selectedWF.bundle, function(dir){
            if(!dir) console.info((bundleID.inverse + ' not installed').yellow);
            else exec('open "' + dir + '"');
          });
        }
      });
    });
};
