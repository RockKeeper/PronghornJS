module.exports.router = function (app) {

    app.get('/', app.get("PH/Backend/Controller/MainController").index);


    app.io.route('index:say', app.get("PH/Backend/Controller/MainController").indexSocket);

};
