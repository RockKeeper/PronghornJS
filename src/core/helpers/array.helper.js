module.exports.helper = function (app) {
    var unique = function(value) {
        var a = value.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };

    app.set("array:unique", unique);
};
