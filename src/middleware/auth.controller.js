var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('../logger');
var User = require('../models/user');

class AuthController {
	constructor(navList) {
		AuthController.navList = navList;
	}

	static home(req, res) {
		res.render('index', {
			navList : AuthController.navList,
			user: req.user
		});
	};

	static register(req, res) {
		res.render('register', {
			navList : AuthController.navList
		});
	};

	// Post registration
	static doRegister(req, res) {
		User.register(new User({username: req.body.username, name: req.body.name}), req.body.password, (err, user) => {
			if (err) {
				return res.render('register', {user: user, navList : AuthController.navList});
			}

			passport.authenticate('local')(req, res, function () {
				res.redirect('/');
			});
		});
	};

	static login(req, res) {
		res.render('login',
			{navList: AuthController.navList}
		);
	};

	// Post login
	static doLogin(req, res, next) {
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login'
		})(req, res, next)
	};

	static logout(req, res) {
		req.logout();
		res.redirect('/');
	};

	static forgetPass(req, res) {
		//Todo
	};

	// Todo - login and registration via instagram
}

module.exports = AuthController;
