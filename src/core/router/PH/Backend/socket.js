module.exports.router = function (app) {
    return {
        name: "SocketRouter",
        environments: ["Backend"],
        init: function(server){

            
            server.io.route('index:say', app.get("PH/Backend/Controller/MainController").indexSocket);

        }
    }
};
