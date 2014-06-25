var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var path = require('path');

module.exports = function(program) {

  program
    .command('download <bundleID>')
    .description('  Download specified workflow')
    .option('-d, --directory <path>', 'Download directory')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == workflow);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
        else{
          var downloadDir = options.directory || process.env.HOME + "/Downloads/";
          var downloadUrl = awm.config.packalUrl + selectedWF.bundle + '/' + selectedWF.file;

          downloadDir = downloadDir.replace("~", process.env.HOME);
          downloadDir = path.normalize(downloadDir);
          if(downloadDir.slice(-1) != '/') downloadDir += '/';

          console.info(('Downloading ' + selectedWF.name + ' to ' + path.resolve(downloadDir) + '/' + selectedWF.file).cyan);
          request(downloadUrl).pipe(fs.createWriteStream(downloadDir + selectedWF.file));
        }
      });
    });
};
