var frontend = require('./frontend');

frontend.listen(frontend.get('port'), function () {
    console.log('Severnode  online');
});