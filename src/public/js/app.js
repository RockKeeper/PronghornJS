!(function(){
    "use strict";

    io.connect();
    var _connection = io.connect();

    /**
     * Socket Events
     */
    _connection.on('connect', function(err) {
        //console.log('IO connect');
    });

    _connection.on('connect_error', function(err) {
        //console.log('IO Error: connect_error');
    });

    _connection.on('connect_failed', function(err) {
        //console.log('IO Error: connect_failed');
    });

    _connection.on('error', function(err) {
        //console.log('IO Error: error');
    });

    _connection.on('disconnect', function(err) {
        //console.log('IO disconnect');
    });


    // demo event
    _connection.on('index:helloworld', function (data) {
        document.getElementById("io").innerHTML = data.message;
    });

})();