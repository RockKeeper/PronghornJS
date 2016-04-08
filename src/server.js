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
var crypto = require('crypto');
var logo = require('./logo');
var signature = require('cookie-signature');

// get global config
var Config = require("./core/config/System.js");

   

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

    var ee = new EventEmitter();

    util.inherits(app, EventEmitter);

    app.set('config', Config);
    app.set('EventEmitter', ee);
    app.set('helper:crypt', crypt);
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

    // you will need to use cookieParser to expose cookies to req.cookies
    app.use(express.cookieParser());

    
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


    /**
     * Load and initialize autoloader
     */
    var Autoloader = require("./core/modules/Autoloader.js");
    Autoloader.initialize(app, true);

    /**
     * Load and initialize autoloader
     */
    var UserAutoloader = require("./user/modules/Autoloader.js");
    UserAutoloader.initialize(app, true);


    // error handling middleware should be loaded after the loading the routes
    if ('development' == app.get('env')) {
        app.use(errorHandler());
    }

    var server = app.listen(app.get('port'), function () {
        console.log('Severnode  online');
    });

