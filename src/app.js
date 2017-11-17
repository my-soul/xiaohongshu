var express = require('express');
var path = require('path');
var Url = require('url');
var FS = require('fs');
var Config = require('./config');
var log4js = require('./log');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var proxy_Setting = require("./proxy/setting");
//var RedisStore = require('connect-redis')(session);

//load route files
var modFileNames = FS.readdirSync(__dirname + '/routes');
var modules = {};
for (var i = 0; i < modFileNames.length; i++) {
    if (modFileNames[i].substr(-3) === '.js') {
        var sName = modFileNames[i].substring(0, modFileNames[i].length - 3);
        var modName = './routes/' + modFileNames[i].substring(0, modFileNames[i].length - 3);
        var mod = require(modName);
        modules[sName] = mod;
    }
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser(Config.session_secret));

app.use(session({
    // 	store: new RedisStore({
    // 		host: Config.redis.host,
    // 		port: Config.redis.port,
    // 		ttl: 30*60,
    // 		prefix: "session_",
    // 		db: Config.redis.sessiondb
    //		password: ''
    // 	}),
    secret: Config.session_secret,
    cookie: { maxAge: 1000 * 60 * 30 * 10 },
    resave: true,
    saveUninitialized: true,
    rolling: true
}));

app.use(express.static(path.join(__dirname, 'public')));

log4js.configure();
var Log = log4js.logger('app');
app.use(log4js.useLog(Log));

/**
 * 使所有路由表起作用
 */
for (var mod in modules) {
    var path = '/';
    if (mod != 'index') {
        path += mod;
    }
    app.use(path, modules[mod]);
}

/**
 * 解决跨域问题，给每个请求的response增加头
 */
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With');
    res.header('Access-Content-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', '3.2.1');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
//*/

//启用layout
//app.use(partials());

// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Page:' + req.url + ' Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('maintain', {
            message: err.message,
            error: err
        });
        return;
    });
}
//*/
// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
    Log.error(err);
    if (req.method === "GET") {
        res.status(err.status || 500);
        res.render('maintain', {
            message: err.message,
            error: {}
        });
    } else {
        var msg = "internal error: " + err.message + "\r\n" + err;
        var result = {
            code: -1,
            msg: msg
        };
        res.send(result);
    }
});
//*/

process.on('uncaughtException', function(err) {
    Log.fatal(err);
});


proxy_Setting.get('store',function(err, data) {
    if (err) {
    }
    app.locals.sitename = data;
});

proxy_Setting.get('sitehost',function(err, data) {
    if (err) {
    }
    global.sitehost = data;
});
proxy_Setting.get('domain',function(err, data) {
    if (err) {
    }
    global.sitedomain = data;
});


module.exports = app;