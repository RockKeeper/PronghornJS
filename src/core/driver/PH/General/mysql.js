module.exports.driver = function (app) {

    var config = app.get("config");

    var knex = require('knex')({
        client: 'mysql',
        debug: false,
        connection: {
            host     : config.mysql.host,
            user     : config.mysql.user,
            password : config.mysql.pass,
            database : config.mysql.name,
            charset  : 'utf8'
        }
    });

    var MySQL = require('bookshelf')(knex);
    app.set("driver:mysql", MySQL);

    
    return MySQL;
};