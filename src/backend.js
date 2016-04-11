/**
 * Module dependencies.
 */
var express = require('express.io');
var fs = require('fs');
var colors = require('colors');
var crypt = require('bcrypt-nodejs');
var validator = require('validator');
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
// get global config
var Config = require("./user/config/System.js");


// create app
var app = express();
app.http().io();
app.set("environment","backend");

var ee = new EventEmitter();

util.inherits(app, EventEmitter);

app.set('config', Config);
app.set('EventEmitter', ee);
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


nunjucks.register(app);

/**
 * Load object registry
 */
var oObjectRegistry = require("./core/modules/ObjectRegistry.js").init(app);
app.set("registry",oObjectRegistry);

/**
 * Load and initialize autoloader
 */
var Autoloader = require("./core/modules/Autoloader.js");
Autoloader.initialize(app, true);

/**
 * Load and initialize autoloader
 */
var UserAutoloader = require("./core/modules/Autoloader.js");
UserAutoloader.initialize(app, true, "../user/");

module.exports = app;