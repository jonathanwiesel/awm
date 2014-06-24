var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');
var colors = require('colors');

var parser = new xml2js.Parser({explicitArray: false});


var PACKAL_URL = 'https://raw.github.com/packal/repository/master/';
var MANIFEST_URL = PACKAL_URL + 'manifest.xml';
var LOCAL_STORAGE_DIR = process.env.HOME + '/.awm/';
var manifestFile = LOCAL_STORAGE_DIR + 'manifest.json';

exports.config = {
  packalUrl: PACKAL_URL,
  directory: LOCAL_STORAGE_DIR,
  manifest: manifestFile
};


exports.fetchAndParseManifest = function(callback) {
  request.get(MANIFEST_URL, function(err, res, body) {

    if(res.statusCode != 200){
      console.error('Cannot fetch workflow manifest from packal repository'.bold.underline.red);
      process.exit(1);
    }

    parser.parseString(body, function(err, jsResult){

      if(err){
        console.error('Cannot parse the manifest.xml in the packal repository'.bold.underline.red);
        process.exit(1);
      }

      callback(jsResult);
    });

  });
};

exports.writeManifest = function(json) {

  fs.writeFile(manifestFile, JSON.stringify(json, null, '  '), function(err) {
    if(err){
        console.error(('Cannot write local manifest file: ' + err).bold.underline.red);
        process.exit(1);
    }
    console.info('Workflow manifest fetching successful'.bold.cyan);
    process.exit();
  });

};

exports.readManifest = function(callback) {

  fs.readFile(manifestFile, 'utf8', function (err, data) {
    if (err) {
      console.error(('Couldn\'t read manifest file: ' + err).bold.underline.red);
      process.exit(1);
    }

    callback(JSON.parse(data).manifest.workflow);

  });
};
