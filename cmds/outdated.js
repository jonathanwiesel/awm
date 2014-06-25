var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var plist = require('plist');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({explicitArray: false});

module.exports = function(program) {

  program
    .command('outdated')
    .description('List outdated workflows.')
    .action(function(){

      fs.readdir(awm.config.workflowDir, function(err, dirList){
        if(err){
          console.error(('Error listing workflows directory: ' + err).red);
          process.exit(1);
        }

        _(dirList).each(function(dir){

          fs.exists(awm.config.workflowDir + dir + '/packal/', function(exists){
            if(exists){
              awm.readManifest(function (workflowList) {

                var settingsPlist = plist.parse(fs.readFileSync(awm.config.workflowDir + dir + '/info.plist', 'utf8'));

                fs.readFile(awm.config.workflowDir + dir + '/packal/package.xml', function(err, data) {
                  if(err){
                    console.error('Cannot read packal package file for ' + dir + ': ' + err);
                    process.exit(1);
                  }

                  parser.parseString(data, function(err, jsResult){
                    if(err){
                      console.error('Cannot parse packal package file for ' + dir + ': ' + err);
                      process.exit(1);
                    }

                    var wfInfoManifest = _.find(workflowList, {bundle: settingsPlist.bundleid});

                    if(wfInfoManifest.version > jsResult.workflow.version){
                      console.info(wfInfoManifest.bundle + ' => ' + wfInfoManifest.name + '. (' + jsResult.workflow.version + ') -> ' + ('latest: ' + wfInfoManifest.version).green);
                    }

                  });
                });
              });
            }
          });
        });
      });
    });
};
