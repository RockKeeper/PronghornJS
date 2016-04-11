var frontend = require('./frontend');
var backend = require('./backend');

// mount backend
frontend.use("/backend", backend);

frontend.listen(frontend.get('port'), function () {
    console.log('Severnode  online');
});