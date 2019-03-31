const express = require('express');
const authRouter = express.Router();
const logger = require('../logger');
const authController = require('../controllers/authController');
const passport = require('passport');

function router(navList) {
	const {resetPassword, signUp, loadResetPage, updatePassword} = authController();

	authRouter.route('/signUp')
		.get((req, res)=> {
			res.render('signup', {
				navList: navList,
				user: req.user
			});
		})
		.post(signUp);
	authRouter.route('/profile')
		.get((req, res)=> {
			logger.log(req.user);
			//res.json(req.user);
			res.render('profile', {
				navList: navList,
				user: req.user
			});
		});

	authRouter.route('/signIn')
		.get((req, res)=> {
			res.render('signin', {
				navList: navList,
				user: req.user
			});
		})
		.post(passport.authenticate('local', {
			successRedirect: '/auth/profile',
			failureRedirect: '/auth/signIn'
		}));


	authRouter.route('/instagram')
		.get(passport.authenticate('instagram'),
			function(req, res){});

	authRouter.route('/instagram/callback')
		.get(passport.authenticate('instagram',
			{ failureRedirect: '/auth/signIn' }),
			function(req, res) {
				res.redirect('/auth/profile');
			});

	authRouter.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	authRouter.route('/forgot')
		.get( (req, res) =>
			res.render('forgot', {
				user: req.user
			})
		)
		.post(resetPassword);

	authRouter.route('/reset/:token')
		.get(loadResetPage)
		.post(updatePassword);

	return authRouter;
}
module.exports = router;
