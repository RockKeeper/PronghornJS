module.exports.router = function (app) {

    app.get('/', app.get("PH/Frontend/Controller/MainController").index);
};
