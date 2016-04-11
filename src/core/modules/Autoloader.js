var path = require('path');
var colors = require('colors');
var fs = require('fs');


/**
 * 
 * @param value
 * @returns {string}
 */
var ucfirst = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 *
 * @param message
 * @param verbose
 * @param config
 * @private
 */
var _log = function (message, verbose, config) {
    if (verbose || verbose === undefined) {
        var date = new Date();
        console.log(date.toLocaleTimeString().grey.bold + (' [' + config.app.name + '] ').white + message);
    }
};
/*
 * Loads all .js-files (e.g. "testing.js") from a given loadPath, requires
 * them and (if successfully) finds them with the given loadExport and
 * executes them.
 * Explicitly counts files ending with "off" (eg. "testing.js.off") which
 * will be logged (along other things) if verbose is true.
 */
var loaded = 0, inactive = 0, failed = 0;
var _load = function (loadPath, loadExport, app, verbose) {
    var config = app.get("config");
    var sEnv = app.get('environment');

    loaded = 0;
    inactive = 0;
    failed = 0;

    _log(('Loading ' + ucfirst(app.get('environment')) + ": " + loadExport).yellow, verbose, config);

    _readLoadDir(app, loadPath, loadExport, []);


    _log(('[' + loaded + '] ' + loadExport + ' loaded').green, verbose, config);
    if (failed) {
        _log(('[' + failed + '] ' + loadExport + ' failed').yellow, verbose, config);
    }
    if (inactive) {
        _log(('[' + inactive + '] ' + loadExport + ' inactive').gray, verbose, config);
    }
};


var _readLoadDir = function (app, loadPath, loadExport) {


    // find all files in loadPath and require/ignore them
    fs.readdirSync(__dirname + path.sep + '..' + path.sep + loadPath).forEach(function (file) {


        var sPath = __dirname + path.sep + '..' + path.sep + loadPath + path.sep + '' + file;
        var bIsDir = fs.lstatSync(sPath).isDirectory();

        if (bIsDir) {
            _readLoadDir(app, loadPath + path.sep + file, loadExport);
        } else {
            var ext = file.substr(-3);
            var sFilename = file.slice(0, -3);
            if (ext === '.js') {
                if (loadPath.toLowerCase().indexOf("/" + app.get('environment')) >= 0 || loadPath.toLowerCase().indexOf("/general") >= 0) {
                    var coreModule = require(sPath);
                    if (coreModule[loadExport]) {
                        loaded++;
                        var oObject = coreModule[loadExport](app);
                        if (oObject) {
                            var sObjectName = sFilename;
                            if (oObject.name) {
                                sObjectName = oObject.name;
                            }

                            app.get("registry").register(loadExport, sObjectName, oObject, loadPath);

                        }
                    } else {
                        failed++;
                    }
                }
            } else if (ext === 'off') {
                inactive++;
            }
        }
    });
};


var Autoloader = {

    // load everything
    initialize: function (app, verbose, sNonStandardLoadPath) {
        sNonStandardLoadPath = sNonStandardLoadPath || "";
        var config = app.get("config");
        var _custom_loadpath = false;
        if (sNonStandardLoadPath != "") {
            _custom_loadpath = true;
        }
        if (_custom_loadpath === false) {
            _log(('INIT [' + app.get('environment').toUpperCase() + "]").red, verbose, config);
        } else {
            _log(('INIT CUSTOM LAODPATH FOR [' + app.get('environment').toUpperCase() + "]").red, verbose, config);
        }


        this.initializeTypes(['helper', 'driver', 'lib', 'model', 'controller', 'router'], app, verbose, sNonStandardLoadPath);

        if (verbose || verbose === undefined) {
            console.log("");
        }

        app.emit("controllers_loaded", app);
    },

    // load specific types
    initializeTypes: function (types, app, verbose, sNonStandardLoadPath) {
        var that = this;
        types.forEach(function (type) {
            that.initializeType(type, app, verbose, sNonStandardLoadPath)
        });
    },

    // load only one type
    initializeType: function (type, app, verbose, sNonStandardLoadPath) {
        switch (type) {
            case 'helper':
            case 'helpers':
                _load(sNonStandardLoadPath + 'helper', 'helper', app, verbose);
                break;
            case 'driver':
            case 'drivers':
                _load(sNonStandardLoadPath + 'driver', 'driver', app, verbose);
                break;
            case 'lib':
            case 'libs':
                _load(sNonStandardLoadPath + 'lib', 'lib', app, verbose);
                break;
            case 'model':
            case 'models':
                _load(sNonStandardLoadPath + 'model', 'model', app, verbose);
                break;
            case 'controller':
            case 'controllers':
                _load(sNonStandardLoadPath + 'controller', 'controller', app, verbose);
                break;
            case 'router':
                _load(sNonStandardLoadPath + 'router', 'router', app, verbose);
                break;
            default:
                throw new Error('unknown initialization type "' + type + '"');
        }
    }
};

module.exports = Autoloader;