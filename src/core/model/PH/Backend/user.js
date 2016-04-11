module.exports.model = function (app) {

    var DB = app.get("driver:mysql");
    var emitter = app.get('emitter');

    var User = DB.Model.extend({
        tableName: 'users',
        idAttribute: 'id',
        login: function (username, password, authcallback) {

            var crypt = app.get("helper:crypt");
            this.set("email", username);

            this.fetch().then(function (model) {
                if (model) {
                    var crypt = app.get("helper:crypt");
                    password = crypt.hashSync(password, model.get("salt"));

                    if (model.get("password") == password) {
                        model.set("password", "");
                        model.set("salt", "");
                        authcallback(null, model);
                    } else {
                        authcallback(new Error("error.user_login_failed"));
                    }
                } else {
                    authcallback(new Error("error.user_login_failed"));
                }
            });

        },

        hash: function () {
            var crypt = app.get("helper:crypt");
            return crypt.hashSync(this.get("email") + this.get("first_name") + this.get("last_name") + new Date().toLocaleDateString(), this.get("salt"));
        }
    });


    return User;
};
