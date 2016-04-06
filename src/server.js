/**
 * Module dependencies.
 */
var express = require('express.io');
var fs = require('fs');
var colors = require('colors');
var crypt = require('bcrypt-nodejs');
var validator = require('validator');
var i18n = require("i18n");
var errorhandler = require('errorhandler');
var sanitize = require('html-css-sanitizer').sanitize;
var util = require("util");
var path = require('path');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');
var moment = require('moment');
var errorHandler = require('errorhandler');
var EventEmitter = require('events').EventEmitter;
var cluster = require('express-cluster');
var nunjucks = require('express-nunjucks');
var cookie = require('cookie');
var redis   = require("redis");
var RedisStore = require('connect-redis')(express.session);
var crypto = require('crypto');
var logo = require('./logo');
var signature = require('cookie-signature');
var uuid = require('node-uuid');
var webshot = require('webshot');

// get global config
var Config = require("./core/config/System.js");

var redis_client  = redis.createClient({auth_pass:Config.redis.pass});



    /**
     * Translation config
     */
    i18n.configure({
        locales: Config.app.languages,
        directory: __dirname + '/translation',
        defaultLocale: 'de',
        //cookie: uuid.v4() + '_lng'
        //indent: "\t"
    });


    var mysql      = require('mysql');

    var pool  = mysql.createPool({
        connectionLimit : 10,
        host            : Config.mysql.host,
        user     : Config.mysql.user,
        password : Config.mysql.pass,
        database : Config.mysql.name
    });


    /**
     * Start message
     */
    logo(Config.app.name);

    var date = new Date();
    var timestring = date.toLocaleTimeString();
    console.log('\n\n' + timestring.grey.bold + ' ['+Config.app.name+']'.white + ' App starting...'.cyan);


    // create app
    express = require('express.io');
    var app = express();
    app.http().io();

    app.set("mysql:pool",pool);
    app.set("redis:client",redis_client);

    var ee = new EventEmitter();

    util.inherits(app, EventEmitter);

    app.set('config', Config);
    app.set('EventEmitter', ee);
    app.set('helper:crypt', crypt);
    app.set('helper:sanitize', sanitize);
    app.set('helper:validator', validator);
    app.set('port', Config.app.port || 3000);
    app.set('views', path.join(__dirname, 'templates', Config.app.theme));
    app.set('view engine', 'html');
    app.enable('trust proxy');
    app.set("trust proxy", 'loopback');
    app.use(methodOverride());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(multer());
    app.use(express.static(path.join(__dirname, 'public')));
    //app.use(i18n.init);


    var redisSessionStore =  new RedisStore({
        host: Config.redis.host,
        port: Config.redis.port,
        pass: Config.redis.pass,
        client: redis_client
    });

    app.set('redis:store',redisSessionStore);

    // you will need to use cookieParser to expose cookies to req.cookies
    app.use(express.cookieParser());

    // i18n init parses req for language headers, cookies, etc.
    app.use(i18n.init);


    app.set("i18n",i18n);

    // init session store
    var expressSession = {
        store: redisSessionStore,
        resave: true,
        saveUninitialized: true,
        secret: Config.app.secret
    };
    var oExpressSession = express.session(expressSession);
    app.use(oExpressSession);


    // setup nunjucks
    nunjucks.setup({
        autoescape: false,
        watch: true
    }, app);



    // assign global template vars
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        res.locals.app_name = Config.app.name;
        next();
    });


    // invoked before each action: set locale from URL
    app.all('*', function(req, res, next) {
        var sRegEx = '('+Config.app.languages.join('|')+')';
        var rxLocal = new RegExp(sRegEx, "g");
        var arr = rxLocal.exec(req.url);
        if(arr != null){
            if(arr[1]){
                var local=arr[1];
                i18n.setLocale(local);
                req.setLocale(local);
            } else {
                i18n.setLocale('de');
                req.setLocale('de');
            }
        }
        // add extra logic
        next();
    });



    /**
     * Load and initialize autoloader
     */
    var Autoloader = require("./core/modules/Autoloader.js");
    Autoloader.initialize(app, true);


    // error handling middleware should be loaded after the loading the routes
    if ('development' == app.get('env')) {
        app.use(errorHandler());
    }

    var server = app.listen(app.get('port'), function () {
        console.log('Severnode  online');
    });

