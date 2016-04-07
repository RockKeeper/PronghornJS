
module.exports.controller = function (app) {

    /**
     * demo route
     */
    app.get('/', function (req, res) {
        res.render('index',{message: "Hello from controller"});
    });

};
