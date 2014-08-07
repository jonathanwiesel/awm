var awm = require('../lib/awm');
var _ = require('lodash');

module.exports = function(program) {

  program
    .command('outdated')
    .description('List outdated workflows.')
    .action(function(){
      var outdated = awm.getOutdated(function(packages){
        _(packages).each(function(wf){
          console.info(wf.bundle + ' => ' + wf.name + '. (' + wf.oldVersion + ') -> ' + ('latest: ' + wf.version).green);
        });
      });
    });
};
