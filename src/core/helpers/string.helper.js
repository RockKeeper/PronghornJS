module.exports.helper = function (app) {
    var stringifyJSON = function(obj) {

        // null
        if (obj === null) {
            return "null";
        }

        // unstringifiable - functions and undefined
        if (obj === undefined || obj.constructor === Function) { return; }

        // strings
        if (obj.constructor === String) {
            return '"' + obj + '"';
        }

        // arrays
        if (obj.constructor === Array) {
            if (obj.length) {
                var partialJSON = [];

                for (var i = 0; i < obj.length; i++) {
                    partialJSON.push(stringifyJSON(obj[i])); // recursion
                }

                return '[' + partialJSON.join(",") + ']';
            } else {
                return '[]';
            }
        }

        // objects
        if (obj.constructor === Object) {
            var keys = Object.keys(obj);
            if (keys.length) {
                var partialJSON = '';
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];

                    if (!key || obj[key] === undefined || typeof key === 'function' || typeof obj[key] === 'function') {

                    } else {
                        if (i === keys.length - 1) {
                            partialJSON += stringifyJSON(key) + ':' + stringifyJSON(obj[key]); // recursion
                        } else {
                            partialJSON += stringifyJSON(key) + ':' + stringifyJSON(obj[key]) + ','; // recursion
                        }
                    }
                }
                return '{' + partialJSON + '}';
            } else {
                return '{}';
            }
        }

        // everything else (numbers, booleans, etc.)
        return obj.toString();
    };

    app.set("helper:stringifyJSON", stringifyJSON);
};