module.exports.router = function (app) {

    app.get('/', app.get("PH/Backend/Controller/MainController").index);
};
