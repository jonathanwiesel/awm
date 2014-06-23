var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');

module.exports = function(program) {

  program
    .command('download <workflow>')
    .description('Download specified workflow')
    .option('-d, --directory <path>', 'Download directory')
    .action(function(workflow, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == workflow);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
        else{
          var downloadDir = options.directory || process.env.HOME + "/Downloads/";
          var downloadUrl = awm.config.packalUrl + selectedWF.bundle + '/' + selectedWF.file;

          var downloadDirClean = downloadDir.replace("~", process.env.HOME);

          console.info(('Downloading ' + selectedWF.name + ' to ' + downloadDirClean + selectedWF.file).cyan);
          request(downloadUrl).pipe(fs.createWriteStream(downloadDirClean + selectedWF.file))
        }
      });
    });
};
