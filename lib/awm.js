var request = require('request');
var fs = require('fs-extra');
var xml2js = require('xml2js');
var colors = require('colors');
var _ = require('lodash');
var plist = require('plist');
var async = require('async');
var parser = new xml2js.Parser({explicitArray: false});
var ProgressBar = require('progress');
var path = require('path');
var crypto = require('crypto');
var jszip = require('jszip');

var PACKAL_URL = 'https://raw.github.com/packal/repository/master/';
var MANIFEST_URL = PACKAL_URL + 'manifest.xml';
var LOCAL_STORAGE_DIR = process.env.HOME + '/.awm/';
var manifestFile = LOCAL_STORAGE_DIR + 'manifest.json';
var workflowDir = process.env.HOME + '/Library/Application Support/Alfred 2/Alfred.alfredpreferences/workflows/';
var cacheDir = LOCAL_STORAGE_DIR + 'cached/';

var fetchAndParseManifest = function(callback) {

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

      var cleanJsResult = splitArrayValues(jsResult);

      callback(cleanJsResult);
    });

  });
};

var writeManifest = function(json) {

  fs.writeFile(manifestFile, JSON.stringify(json, null, '  '), function(err) {
    if(err){
        console.error(('Cannot write local manifest file: ' + err).bold.underline.red);
        process.exit(1);
    }
    process.exit();
  });

};

var readManifest = function(callback) {

  fs.readFile(manifestFile, 'utf8', function (err, data) {
    if (err) {
      console.error(('Couldn\'t read manifest file: ' + err).bold.underline.red);
      process.exit(1);
    }

    callback(JSON.parse(data).manifest.workflow);

  });
};

var getOutdated = function(callback) {

  fs.readdir(workflowDir, function(err, dirList){
    if(err){
      console.error(('Error listing workflows directory: ' + err).red);
      process.exit(1);
    }

    var packages = [];

    async.each(dirList, function(dir, cb){

      fs.exists(workflowDir + dir + '/packal/', function(exists){
        if(!exists) cb();
        else{
          readManifest(function (workflowList) {

            var settingsPlist = plist.parse(fs.readFileSync(workflowDir + dir + '/info.plist', 'utf8'));

            fs.readFile(workflowDir + dir + '/packal/package.xml', function(err, data) {
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
                  wfInfoManifest.oldVersion = jsResult.workflow.version;
                  packages.push(wfInfoManifest);
                }
                cb();
              });
            });
          });
        }
      });

    }, function(){
      callback(packages);
    });

  });
};

var downloadFile = function(wf, callback) {

  var filePath = cacheDir + path.basename(wf.file, '.alfredworkflow') + '@' + wf.version + '.alfredworkflow';

  fs.exists(filePath, function(exists){
    if(exists){

      console.info(('Workflow cached at ' + filePath).cyan);
      callback(null, filePath);

    }else{

      var req = request(PACKAL_URL + wf.bundle + '/' + wf.file);
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
          if(err)
            callback('Error downloading file:' + err);
          else {
            console.info(('Saved to ' + filePath).cyan);
            verifySignature(wf, filePath, function(valid){
              if(valid){
                console.info('Verified'.green);
                callback(null, filePath);
              }else{
                fs.remove(filePath, function(delErr){
                  if(delErr) console.error(('Cannot delete workflow file: ' + filePath).red);
                  callback('Invalid workflow signature, please try redownloading or report on http://packal.org');
                });
              }
            });

          }

          bar.tick(bar.total - bar.curr);
        });
    }
  });
};

var getWorkflowDir = function(bundleId, callback) {
  fs.readdir(workflowDir, function(err, dirList){
    if(err){
      console.error(('Error listing workflows directory: ' + err).red);
      process.exit(1);
    }

    if(dirList.length === 0)
      callback(null);
    else{

      var found;

      async.each(dirList, function(dir, cb){

        fs.lstat(workflowDir + dir, function(err, stats){

          if(err){
            console.error(('Error getting file status'));
            process.exit(1);
          }

          if(stats.isDirectory()){

            var plistFile = workflowDir + dir + '/info.plist';
            var settings = plist.parse(fs.readFileSync(plistFile, 'utf8'));

            fs.exists(workflowDir + dir + '/packal/', function(exists){
              if(exists && settings.bundleid == bundleId){
                found = workflowDir + dir + '/';
              }
              cb();
            });
          }else cb();
        });
      }, function(){
        callback(found);
      });
    }
  });
};

module.exports = {
  fetchAndParseManifest : fetchAndParseManifest,
  writeManifest : writeManifest,
  readManifest : readManifest,
  getOutdated : getOutdated,
  downloadFile : downloadFile,
  getWorkflowDir: getWorkflowDir,
  config: {
    packalUrl: PACKAL_URL,
    directory: LOCAL_STORAGE_DIR,
    cacheDir: cacheDir,
    manifest: manifestFile,
    workflowDir: workflowDir
  }
};

function splitArrayValues(jsManifest){

  _(jsManifest.manifest.workflow).each(function(wf){
    if(wf.categories) wf.categories = _.map(wf.categories.split('|||'), function(str){ return str.trim(); });
    if(wf.osx) wf.osx = _.map(wf.osx.split('|||'), function(str){ return str.trim(); });
    if(wf.tags) wf.tags = _.map(wf.tags.split('|||'), function(str){ return str.trim(); });
    if(wf.webservices) wf.webservices = _.map(wf.webservices.split('|||'), function(str){ return str.trim(); });
  });

  return jsManifest;

}

function verifySignature(wf, filePath, callback){

  console.info('Verifying package signature...'.cyan);
  var appcastURL = PACKAL_URL + wf.bundle + '/' + 'appcast.xml';

  request.get(appcastURL, function(err, res, body) {

    if(res.statusCode != 200)
      callback('Cannot fetch workflow\'s appcast file');
    else{

      parser.parseString(body, function(err, jsResult){

        if(err)
          callback('Cannot parse the appcast.xml in the packal repository');
        else{

          var signature = jsResult.workflow.signature;
          var decodedSign = new Buffer(signature, 'base64');

          var file = fs.readFile(filePath, function(err, data){
            if(err) callback('Cannot read downloaded file');
            else{

              var hashedData = crypto.createHash('sha1').update(data).digest('hex');

              var zip = new jszip(data);
              var pubkey = zip.file('packal/' + wf.bundle + '.pub').asText();
              var verifier = crypto.createVerify('SHA1');
              verifier.update(hashedData);

              callback(verifier.verify(pubkey, decodedSign));
            }
          });
        }
      });
    }
  });
}
