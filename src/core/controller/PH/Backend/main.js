
module.exports.controller = function (app) {

    return {
        name: "MainController",
        environments: ["Backend"],

        /**
         *
         * @param req
         * @param res
         */
        index: function(req, res){
            res.render('index',{message: "Hello from Backendcontroller"});
        },
        /**
         *
         * @param req
         * @param res
         */
        test: function(req, res){
            res.render('index',{message: "Hello from test"});
        },


        /**
         * 
         * @param request
         */
        indexSocket: function(request){
            request.socket.emit('index:helloworld',{message: 'Socket.io OK!'});
        }
    };
};
