var awm = require('../lib/awm');

module.exports = function(program) {

  program
    .command('reset')
    .description('         Reset the manifest file from packal.org')
    .action(function(){
      awm.fetchAndParseManifest(function(jsManifest){
        awm.writeManifest(jsManifest);
      });
    });

};
