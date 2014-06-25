var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var request = require('request');
var path = require('path');
var ProgressBar = require('progress');
var exec = require('child_process').exec

module.exports = function(program) {

  program
    .command('install <bundleID>')
    .description('Install specified workflow')
    .action(function(bundleID, options){

      awm.readManifest(function (workflowList) {
        var selectedWF = _.find(workflowList, function(wf){
          return (wf.bundle == bundleID);
        });

        if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + workflow.inverse).yellow);
        else{

          var downloadUrl = awm.config.packalUrl + selectedWF.bundle + '/' + selectedWF.file;
          var filePath = awm.config.cacheDir + path.basename(selectedWF.file, '.alfredworkflow') + '@' + selectedWF.version + '.alfredworkflow'

          fs.exists(filePath, function(exists){
            if(exists){

              console.info(('Workflow cached at ' + filePath).cyan);
              exec('open ' + filePath.replace(/"/g, '\\\"'));

            }else{

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
                .pipe(fs.createWriteStream(filePath))
                .on('close', function (err) {
                  if(err) console.error(('Error downloading file: ' + e).red)
                  else {
                    console.info(('Saved to ' + filePath).cyan);
                    exec('open ' + filePath.replace(/"/g, '\\\"'));
                  }

                  bar.tick(bar.total - bar.curr);
                });
            }
          });


        }
      });
    });
};
