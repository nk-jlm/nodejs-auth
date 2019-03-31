const express = require('express');
const authRouter = express.Router();
const dbContext = require('../db');
const config = require('../../config');
const logger = require('../logger');
const passport = require('passport');


function router(navList) {
	authRouter.route('/signUp')
		.get((req, res)=> {
			res.render('signup', {
				navList: navList,
				user: req.user
			});
		})
		.post((req, res)=> {
			logger.log(req.body);
			const {username, email, password} = req.body;
			initDb().then(connection => {
				try {
					let client = connection.db(config.get('db').name);
					let collection = client.collection('users');
					const user = {username, email, password};
					let result = collection.insertOne(user);
					logger.log(result);
				} catch (err){
					logger.error(err);
				}
			});
			req.login(req.body, ()=> {
				res.redirect('/auth/profile');
			});
		});
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
	async function initDb() {
		try {
			return await dbContext.getInstance().connect(config.get('db'));
		} catch (err) {
			logger.error(`Can't initialize connection to db. error: `, err)
		}
	}

	return authRouter;
}
module.exports = router;
