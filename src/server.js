var frontend = require('./frontend');


// // mount backend
// frontend.use("/backend", backend);

frontend.listen(frontend.get('port'), function () {
    console.log('Severnode  online');
});