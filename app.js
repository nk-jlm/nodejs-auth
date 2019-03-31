const express = require('express');
const path = require('path');
const createError = require('http-errors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const navList = [
	{title: 'Home', link: '/'},
	{title: 'Photos', link: '/photos'}
];
const indexRouter = require('./src/routes/index')(navList);
const photosRouter = require('./src/routes/photos')(navList);
const authRouter = require('./src/routes/auth')(navList);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
	secret: 'photo',
	resave: false,
	saveUninitialized: true
}));
require('./src/middleware/passport')(app);

app.use(flash());
//Routes initialization
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/photos', photosRouter);

app.use('/error', (req, res, next) => {
	next(new Error('You have got error'));
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
