var passport = require('passport');

module.exports.router = function (app) {

    app.get('/', app.get("PH/Backend/Controller/MainController").index);
    app.get('/test', app.get("PH/Backend/Controller/MainController").test);
};
