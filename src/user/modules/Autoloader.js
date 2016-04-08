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
var _load = function(loadPath, loadExport, app, verbose) {
    var config = app.get("config");

    var _log = function(message, verbose) {
        if (verbose || verbose === undefined) {
            var date = new Date();
            console.log(date.toLocaleTimeString().grey.bold + (' [' + config.app.name + '] ').white + message);
        }
    };

    _log(('Loading user ' + loadExport + ' from path ' + loadPath + '...').yellow, verbose);

    var loaded = 0, inactive = 0, failed = 0;

    // find all files in loadPath and require/ignore them
    fs.readdirSync(__dirname + path.sep + '..' + path.sep + loadPath).forEach(function (file) {
        var ext = file.substr(-3);
        if (ext === '.js') {
            var coreModule = require(__dirname + path.sep + '..' + path.sep + loadPath + path.sep + '' + file);
            if (coreModule[loadExport]) {
                loaded++;
                coreModule[loadExport](app);
            } else {
                failed++;
            }
        } else if (ext === 'off') {
            inactive++;
        }
    });

    _log(('[' + loaded + '] user ' + loadExport + ' loaded').green, verbose);
    if (failed) {
        _log(('[' + failed + '] user ' + loadExport + ' failed').yellow, verbose);
    }
    if (inactive) {
        _log(('[' + inactive + '] user ' + loadExport + ' inactive').gray, verbose);
    }
};

var Autoloader = {

    // load everything
    initialize: function(app, verbose) {

        this.initializeTypes(['helpers', 'drivers', 'libs', 'models','controllers'], app, verbose);

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
                _load('helpers', 'helper', app, verbose);
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
                _load('models', 'model', app, verbose);
                break;
            case 'controller':
            case 'controllers':
                _load('controllers', 'controller', app, verbose);
                break;
            default:
                throw new Error('unknown initialization type "' + type + '"');
        }
    }
};

module.exports = Autoloader;