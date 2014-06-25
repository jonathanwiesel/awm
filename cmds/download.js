var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var path = require('path');
var ProgressBar = require('progress');


module.exports = function(program) {

  program
    .command('download <bundleID>')
    .description('  Download specified workflow')
    .option('-d, --directory <path>', 'Download directory')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
        else{
          var downloadDir = options.directory || process.env.HOME + "/Downloads/";
          var downloadUrl = awm.config.packalUrl + selectedWF.bundle + '/' + selectedWF.file;

          downloadDir = downloadDir.replace("~", process.env.HOME);
          downloadDir = path.normalize(downloadDir);
          if(downloadDir.slice(-1) != '/') downloadDir += '/';


          var req = request(downloadUrl);
          var bar;

          req
            .on('data', function(chunk){
              bar = bar || new ProgressBar('Downloading... [:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 30,
                total: parseInt(req.response.headers['content-length'])
              });

              bar.tick(chunk.length);
            })
            .pipe(fs.createWriteStream(downloadDir + selectedWF.file))
            .on('close', function (err) {
              if(err) console.error(('Error downloading file: ' + e).red)
              else console.info(('Saved to ' + path.resolve(downloadDir) + '/' + selectedWF.file).cyan);

              bar.tick(bar.total - bar.curr);
            });
        }
      });
    });
};
