var express = require('express');
var path = require('path');
var createError = require('http-errors');
//let logger = require('./src/logger');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', indexRouter);
app.use('/users', usersRouter);

//Middleware
app.get('/', (req, res, next)=> {
	res.render('index', {
		'title' : 'HOME'
	});
});
/*app.use((req, res, next) => {
	if (req.url === '/') {
		res.end("Hello");
	} else {
		next();
	}
});*/

app.use('/test', (req, res, next) => {
	res.end("Test page");
	next();
});

app.use('/error', (req, res, next) => {
	next(new Error("AAAA"));
});
// catch 404 and forward to error handler
app.use( (req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next)=>{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
