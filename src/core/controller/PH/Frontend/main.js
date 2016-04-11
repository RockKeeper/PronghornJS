
module.exports.controller = function (app) {

    return {
        name: "MainController",
        environments: ["Frontend"],
        /**
         *
         * @param req
         * @param res
         */
        index: function(req, res){
            res.render('index',{message: "Hello from controller"});
        },


        /**
         * 
         * @param request
         */
        indexSocket: function(request){
            request.io.emit('index:helloworld',{message: 'Socket.io OK!'});
        }
    };
};
