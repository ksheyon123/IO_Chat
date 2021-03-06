var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
// Sessions
const session = require('express-session');
const FileStore = require('session-file-store')(session);

//Middle Wares
var Router = require('./routes/router');
app.use(Router);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling : true,
  store: new FileStore(),
  cookie : {
   maxAge: 2592000000,
  }
}));


// view engine setup
app.set('/views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var http = require('http').createServer(app);
var controllers = require('./routes/controller');
controllers.io.listen(http);
http.listen(3000, '192.168.0.120', () => {
  console.log('http://192.168.0.120:3000')
});