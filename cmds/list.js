var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash');
var plist = require('plist');

module.exports = function(program) {

  program
    .command('list')
    .alias('ls')
    .description('List installed workflows.')
    .action(function(){

      awm.config.getAlfredPreference(function(workflowDir){

        fs.readdir(workflowDir, function(err, dirList){
          if(err){
            console.error(('Error listing workflows directory: ' + err).red);
            process.exit(1);
          }

          _(dirList).each(function(dir){

            fs.lstat(workflowDir + dir, function(err, stats){

              if(err) console.error(('Error getting file status'.red));
              else if(stats.isDirectory()){

                var plistFile = workflowDir + dir + '/info.plist';
                var settings = plist.parse(fs.readFileSync(plistFile, 'utf8'));

                fs.exists(workflowDir + dir + '/packal/', function(exists){
                  if(exists)
                    console.info((settings.bundleid || 'NO-BUNDLE-ID') + ' => ' + settings.name);
                  else
                    console.info('*'.yellow + (settings.bundleid || 'NO-BUNDLE-ID') + ' => ' + settings.name + ' (Not managed by Packal)'.yellow);
                });
              }
            });
          });
        });
      });
    });
};
