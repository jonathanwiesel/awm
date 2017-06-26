var awm = require('../lib/awm');
var _ = require('lodash');
var exec = require('child_process').exec;

module.exports = function(program) {

  program
    .command('install <bundleID>')
    .alias('i')
    .description('Install specified workflow.')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + bundleID.inverse + ' according to the manifest').yellow);
        else{

          awm.getWorkflowDir(selectedWF.bundle, function(dir){
            if(dir) console.info((bundleID.inverse + ' is already installed').yellow);
            else{
              awm.downloadFile(selectedWF, function(err, filePath){
                if(!err) exec('open "' + filePath + '"');
                else console.error(err.bold.underline.red);
              });
            }
          });
        }
      });
    });
};
