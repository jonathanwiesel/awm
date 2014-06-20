var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();


var MANIFEST_URL = 'https://raw.githubusercontent.com/packal/repository/master/manifest.xml';
var LOCAL_STORAGE_DIR = process.env.HOME + '/.awm/';
var manifestFile = LOCAL_STORAGE_DIR + 'manifest.json';

exports.config = {
  directory: LOCAL_STORAGE_DIR,
  manifest: manifestFile
}


exports.fetchManifest = function() {
  request.get(MANIFEST_URL, function(err, res, body) {

    if(res.statusCode != 200){
      console.log('Cannot fetch workflow manifest from packal repository');
      process.exit(1);
    }

    parser.parseString(body, function(err, jsonResult){

      if(err){
        console.log('Cannot parse the manifest.xml in the packal repository');
        process.exit(1);
      }

      fs.writeFile(manifestFile, JSON.stringify(jsonResult, null, '  '), function(err) {
        if(err){
            console.log('Cannot write local manifest file: ' + err);
            process.exit(1);
        }
        console.log('Workflow manifest fetching successful');
        process.exit();
      });
    });

  });
}
