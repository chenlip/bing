var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var index = require('./routes/index');
var weibo = require('./routes/weibo');
var request = require('superagent');
var session = require('express-session');
var methodOverride = require('method-override');
// 设置与安全相关的HTTP头的中间件
var helmet = require('helmet');
//
var passport = require('passport');
// 定时器
var schedule = require('node-schedule');

function scheduleCancel() {
    var counter = 1;
    var t = schedule.scheduleJob('* * * * * *', function() {
        console.log('定时器触发次数：' + counter);
        counter++;
    });
    setTimeout(function() {
        console.log('定时器取消！');
        t.cancel();
    }, 5000);
}
scheduleCancel();
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride());
app.use(session({
    secret: 'bing.ioliu.cn',
    cookie: {
        maxAge: 60000,
        secure: true
    }
}));
app.use(logger('dev'));
app.use(cookieParser('sefaalsfNLjKXklasflnNLKNJLJFNlnknlkjfsLFSN'));
// 启用 passport 组件
app.use(passport.initialize());
app.use(passport.session());
// 启用 helmet 
app.use(helmet());
//sass
//app.use(sassMiddleware({
//    src: __dirname
//    , dest: __dirname
//    , sourceMap: false
//    , outputStyle: 'compressed'
//    , debug: true
//}));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', index);
app.use('/weibo', weibo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;