var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('../logger');
var User = require('../models/user');

var auth = {};

// class AuthController {
//
// }

auth.home = (req, res) => {
	res.render('index', {user: req.user});
};

auth.register = (req, res) => {
	res.render('register');
};

// Post registration
auth.doRegister = (req, res) => {
	User.register(new User({username: req.body.username, name: req.body.name}), req.body.password, function (err, user) {
		if (err) {
			return res.render('register', {user: user});
		}

		passport.authenticate('local')(req, res, function () {
			res.redirect('/');
		});
	});
};

auth.login = (req, res) => {
	res.render('login');
};

// Post login
auth.doLogin = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login'
	})(req, res, next)
};

auth.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

auth.forgetPass = (req, res) => {
	//Todo
};

// Todo - login and registration via instagram
module.exports = auth;
