var merge = require('merge');

var initRegistry = function(app){

    function eachKeyValue(obj, callback) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                callback(i, obj[i]);
            }
        }
    }

    function convertNamespaceToObject(namespace, value) {
        var result = {};
            var parts = namespace.split(".");
            var last = parts.pop();
            var node = result;
            parts.forEach(function(key) {
                node = node[key] = node[key] || {};
            });
            node[last] = value;
        return result;
    }

    var ucfirst = function(value){
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
    
    var ObjectRegistry = function(app){
        var _objects = {};


        var _get = function(){
            return _objects;
        };

        var _dump = function(){
            console.log(_objects);
        };

        var _register = function(sObjectNamespace,sIdentifier, oObject, loadPath){

            var sNamespace = loadPath.replace(sObjectNamespace,"");
            if(sNamespace.length <= 0){
                sNamespace = ucfirst(sObjectNamespace)
            }else{
                sNamespace = sNamespace + "/" + ucfirst(sObjectNamespace);
            }
            if(sNamespace.substr(0,1) == "/"){
                sNamespace = sNamespace.slice(1);
            }

            var aNamespaces = sNamespace.split("/");
            var sNamespaceObject = aNamespaces.join(".");
            var oNamespace = convertNamespaceToObject(sNamespaceObject+"."+sIdentifier, oObject);

            _objects = merge.recursive(true,_objects, oNamespace);
            app.set(sNamespace+"/"+sIdentifier, oObject);
        };

        return {
            get: _get,
            register: _register
        };
    };
    
    return new ObjectRegistry(app);
};


module.exports.init = initRegistry;