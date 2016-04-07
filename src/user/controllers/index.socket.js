var fs   = require("fs");
var util = require("util");
var path = require('path');

module.exports.controller = function (app) {
    /**
     * demo socket route
     */
    app.io.route('index:say', function(request) {
        request.io.emit('index:helloworld',{message: 'Socket.io OK!'});
    });

};
