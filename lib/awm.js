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
