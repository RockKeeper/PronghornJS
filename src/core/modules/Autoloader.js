var path = require('path');
var colors = require('colors');
var fs = require('fs');

/*
 * Loads all .js-files (e.g. "testing.js") from a given loadPath, requires
 * them and (if successfully) finds them with the given loadExport and
 * executes them.
 * Explicitly counts files ending with "off" (eg. "testing.js.off") which
 * will be logged (along other things) if verbose is true.
 */
var loaded = 0, inactive = 0, failed = 0;
var _load = function(loadPath, loadExport, app, verbose) {
    var config = app.get("config");

    var _log = function(message, verbose) {
        if (verbose || verbose === undefined) {
            var date = new Date();
            console.log(date.toLocaleTimeString().grey.bold + (' [' + config.app.name + '] ').white + message);
        }
    };
    loaded = 0;
    inactive = 0;
    failed = 0;

    _log(('Loading ' + loadExport + ' at ' + loadPath + '...').yellow, verbose);

    _readLoadDir(app, loadPath, loadExport,[]);


    _log(('[' + loaded + '] ' + loadExport + ' loaded').green, verbose);
    if (failed) {
        _log(('[' + failed + '] ' + loadExport + ' failed').yellow, verbose);
    }
    if (inactive) {
        _log(('[' + inactive + '] ' + loadExport + ' inactive').gray, verbose);
    }
};


var _readLoadDir = function(app, loadPath, loadExport){


    // find all files in loadPath and require/ignore them
    fs.readdirSync(__dirname + path.sep + '..' + path.sep + loadPath).forEach(function (file) {


        var sPath = __dirname + path.sep + '..' + path.sep + loadPath + path.sep + '' + file;
        var bIsDir = fs.lstatSync(sPath).isDirectory();

        if(bIsDir){
            _readLoadDir(app, loadPath + path.sep + file, loadExport);
        }else{
            var ext = file.substr(-3);
            var sFilename = file.slice(0,-3);
            if (ext === '.js') {
                var coreModule = require(sPath);
                if (coreModule[loadExport]) {
                    loaded++;
                    var oObject = coreModule[loadExport](app);
                    if(oObject) {
                        var sObjectName = sFilename;
                        if(oObject.name){
                            sObjectName = oObject.name;
                        }
                        app.get("registry").register(loadExport, sObjectName, oObject, loadPath);
                    }
                } else {
                    failed++;
                }
            } else if (ext === 'off') {
                inactive++;
            }
        }
    });
};


var Autoloader = {

    // load everything
    initialize: function(app, verbose) {

        this.initializeTypes(['helper', 'driver', 'lib', 'model', 'controller','router'], app, verbose);

        if (verbose || verbose === undefined) {
            console.log("");
        }

        app.emit("controllers_loaded", app);
    },

    // load specific types
    initializeTypes: function(types, app, verbose) {
        var that = this;
        types.forEach(function(type) {
            that.initializeType(type, app, verbose)
        });
    },

    // load only one type
    initializeType: function(type, app, verbose) {
        switch(type) {
            case 'helper':
            case 'helpers':
                _load('helper', 'helper', app, verbose);
                break;
            case 'driver':
            case 'drivers':
                _load('driver', 'driver', app, verbose);
                break;
            case 'lib':
            case 'libs':
                _load('lib', 'lib', app, verbose);
                break;
            case 'model':
            case 'models':
                _load('model', 'model', app, verbose);
                break;
            case 'controller':
            case 'controllers':
                _load('controller', 'controller', app, verbose);
                break;
            case 'router':
                _load('router', 'router', app, verbose);
                break;
            default:
                throw new Error('unknown initialization type "' + type + '"');
        }
    }
};

module.exports = Autoloader;