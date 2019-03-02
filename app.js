var express = require('express');
var path = require('path');
const createError = require('http-errors');
let logger = require('./src/logger');
//const logger = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const User = require('./src/models/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//app.use(logger.log('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
//app.use('/users', usersRouter);

//Middleware
app.use(require('express-session')({
	secret: 'keyboard',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//Todo - check methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/error', (req, res, next) => {
	next(new Error('You have got error'));
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
