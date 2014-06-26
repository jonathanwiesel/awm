var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var plist = require('plist');

module.exports = function(program) {

  program
    .command('list')
    .description('List installed workflows.')
    .action(function(){

      fs.readdir(awm.config.workflowDir, function(err, dirList){
        if(err){
          console.error(('Error listing workflows directory: ' + err).red);
          process.exit(1);
        }

        _(dirList).each(function(dir){

          fs.lstat(awm.config.workflowDir + dir, function(err, stats){

            if(err) console.error(('Error getting file status'));
            else if(stats.isDirectory()){

              var plistFile = awm.config.workflowDir + dir + '/info.plist';
              var settings = plist.parse(fs.readFileSync(plistFile, 'utf8'));

              fs.exists(awm.config.workflowDir + dir + '/packal/', function(exists){
                if(exists)
                  console.info((settings.bundleid || 'NO-BUNDLE-ID') + ' => ' + settings.name);
                else
                  console.info('*'.yellow + (settings.bundleid || 'NO-BUNDLE-ID') + ' => ' + settings.name + ' (Not managed by packal)'.yellow);
              });
            }
          });
        });
      });
    });
};
