var colors = require('colors');
module.exports.helper = function (app) {

    var config = app.get("config");

    /**
     * @todo write to file...
     */


    var Logger = {
        log: function (text) {
            var date = new Date();
            var timestring = date.toLocaleTimeString();
            console.log(timestring.grey.bold + ' ['.white + config.app.name.white + ']'.white + ' ' + text.white);
        },
        info: function (text) {
            var date = new Date();
            var timestring = date.toLocaleTimeString();
            console.log(timestring.grey.bold + ' ['.white + config.app.name.white + ']'.white + ' ' + text.grey);
        },
        success: function (text) {
            var date = new Date();
            var timestring = date.toLocaleTimeString();
            console.log(timestring.grey.bold + ' ['.white + config.app.name.white + ']'.white + ' ' + text.green);
        },
        warn: function (text) {
            var date = new Date();
            var timestring = date.toLocaleTimeString();
            console.log(timestring.grey.bold + ' ['.red + config.app.name.red + ']'.red + ' ' + text.yellow);
        },
        error: function (text) {
            var date = new Date();
            var timestring = date.toLocaleTimeString();
            console.log(timestring.grey.bold + ' ['.red.bold + config.app.name.red.bold + ']'.red.bold + ' ' + text.red.bold);
        }
    };


    app.set("helper:log", Logger);
    return Logger;
};