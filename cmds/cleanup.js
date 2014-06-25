var awm = require('../lib/awm');
var fs = require('fs');
var _ = require('lodash')

module.exports = function(program) {

  program
    .command('cleanup')
    .description('Remove all cached downloads.')
    .action(function(){
      fs.readdir(awm.config.cacheDir, function(err, cachedDownloads){
        _(cachedDownloads).each(function(file){
          console.info(('Removing ' + awm.config.cacheDir + file + '...').cyan);
          fs.unlink(awm.config.cacheDir + file);
        });
      });
    });

};
