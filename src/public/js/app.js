!(function($){
    "use strict";

    var _connection = io.connect();

    /**
     * Socket Events
     */
    _connection.on('connect', function(err) {
        console.log('IO connect',err);
	    _connection.emit('index:say');
    });

    _connection.on('connect_error', function(err) {
        console.log('IO Error: connect_error',err);
    });

    _connection.on('connect_failed', function(err) {
        console.log('IO Error: connect_failed',err);
    });

    _connection.on('error', function(err) {
        console.log('IO Error: error',err);
    });

    _connection.on('disconnect', function(err) {
        console.log('IO disconnect',err);
    });


    // demo event
    _connection.on('index:helloworld', function (data) {
	    console.log('hello world');
        document.getElementById("io").innerHTML = data.message;
    });

})(jQuery);
