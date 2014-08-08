var awm = require('../lib/awm');
var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;

module.exports = function(program) {

  program
    .command('install <bundleID>')
    .description('Install specified workflow.')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
        else{

          awm.getWorkflowDir(selectedWF.bundle, function(dir){
            if(dir) console.info((bundleID.inverse + ' is already installed').yellow);
            else{
              var downloadUrl = awm.config.packalUrl + selectedWF.bundle + '/' + selectedWF.file;
              var filePath = awm.config.cacheDir + path.basename(selectedWF.file, '.alfredworkflow') + '@' + selectedWF.version + '.alfredworkflow';

              awm.downloadFile(downloadUrl, filePath, function(err){
                if(!err) exec('open ' + filePath.replace(/"/g, '\\\"'));
              });
            }
          });
        }
      });
    });
};
