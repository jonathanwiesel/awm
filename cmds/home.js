var awm = require('../lib/awm');
var _ = require('lodash');
var exec = require('child_process').exec;

module.exports = function(program) {

  program
    .command('home [bundleID]')
    .description('Opens the workflow\'s Packal URL. Or Packal home if none specified.')
    .action(function(bundleID){

      if(!bundleID)
        exec('open http://packal.org');
      else{
        awm.readManifest(function (workflowList) {
          var selectedWF = _.find(workflowList, function(wf){
            return (wf.bundle == bundleID);
          });

          if(!selectedWF)
            console.warn(('There\'s no workflow with bundle ID ' + bundleID.inverse).yellow);
          else
            exec('open ' + selectedWF.url.replace(/"/g, '\\\"'));
        });
      }
    });
};
