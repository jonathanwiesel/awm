var awm = require('../lib/awm');
var _ = require('lodash');
var AdmZip = require('adm-zip');
var fs = require('fs-extra');
var async = require('async');
var exec = require('child_process').exec;

module.exports = function(program) {

  program
    .command('upgrade [bundleID]')
    .description('Upgrade the specified package or all outdated ones if none specified.')
    .action(function(bundleID){

      if(!bundleID){

        console.warn('Upgrade all outdated not supported yet!'.yellow);

      }else{

        awm.readManifest(function (workflowList) {
          var selectedWF = _.find(workflowList, function(wf){
            return (wf.bundle == bundleID);
          });

          if(!selectedWF) console.warn(('There\'s no workflow with bundle ID ' + bundleID.inverse).yellow + ' according to the manifest');
          else{

            awm.getWorkflowDir(selectedWF.bundle, function(dir){
              if(!dir) console.info((bundleID.inverse + ' is not installed').yellow);
              else{

                var outdated = awm.getOutdated(function(packages){
                  var outdatedBundles = _.map(packages, 'bundle');
                  if(!_.includes(outdatedBundles, bundleID))
                    console.info('Workflow is at it\'s lastest version');
                  else{
                    awm.downloadFile(selectedWF, function(err, filePath){
                      if(err) console.error(err.bold.underline.red);
                      else exec('open "' + filePath + '"');
                    });
                  }
                });
              }
            });
          }
        });
      }

    });
};
