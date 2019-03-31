const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dbContext = require('../db');
const config = require('../../config');
const logger = require('../logger');
const flash = require('express-flash');
const account = {user: "", pass: ""};

function authController() {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: account.user, // generated ethereal user
			pass: account.pass // generated ethereal password
		}
	});
	async function sendEmail(user, host, token){
		let mailOptions = {
			from: 'Nina',
			to: user.email,
			subject: 'Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process: http://' + host + '/reset/' + token+' If you did not request this, please ignore this email and your password will remain unchanged.'
		};
		let info = await transporter.sendMail(mailOptions);
		return logger.log("Message sent: %s", info.messageId);
	}
	async function sendConfirmation(user) {
		let mailOptions = {
			from: 'Nina',
			to: user.email,
			subject: 'Your password has been changed',
			text: 'Hello, This is a confirmation that the password for your account ' + user.email + ' has just been changed.'
		};
		let info = await transporter.sendMail(mailOptions);
		return logger.log("Message sent: %s", info.messageId);
	}
	function resetPassword (req, res) {
		initDb().then((connection) => {
			try {
				let client = connection.db(config.get('db').name);
				let collection = client.collection('users');
				collection.findOne({email: req.body.email}, ((err, user) => {
					if (user) {
						let token = crypto.randomBytes(32).toString('hex');
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
						collection.save(user, (err)=> {
							if (err) {
								logger.error(err);
							} else {
								try {
									sendEmail(user, req.headers.host + '/auth', token).then(() => {
										logger.log('email was sent!');
										req.flash('info', 'Letter with link to change password was sent');
										res.redirect('/auth/forgot');
									});
								} catch (e){
									logger.error(e);
								}
							}
						})
					} else {
						req.flash('error', 'No account with that email address exists.');
						res.redirect('/auth/forgot');
					}
				}));
			} catch (err){
				logger.error(err);
			}
		});
	}
	function signUp(req, res) {
		const {username, email, password} = req.body;
		if (password.length === 0) {
			req.flash('error', 'Please enter correct password');
			res.redirect('/auth/signUp');
		}
		initDb().then((connection) => {
			try {
				let client = connection.db(config.get('db').name);
				let collection = client.collection('users');
				collection.findOne({email: email}, ((err, user)=> {
					if (user) {
						logger.log(user);
						req.flash('success', 'User with such email has already existed');
						res.redirect('/auth/signUp');
					} else {
						const user = {username, email, password};
						let result = collection.insertOne(user);
						logger.log(result);
						req.login(req.body, ()=> {
							req.flash('success', 'You are signed up successfully');
							res.redirect('/auth/profile');
						});
					}
				}));
			} catch (err){
				logger.error(err);
			}
		});
	}
	function loadResetPage(req, res) {
		initDb().then(connection => {
			try {
				let client = connection.db(config.get('db').name);
				let collection = client.collection('users');
				collection.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, ((err, user) => {
					if (user) {
						res.render('reset', {
							user: req.user,
							navList: []
						});

					} else {
						logger.log(user);
						req.flash('error', 'Password reset token is invalid or has expired.');
						res.redirect('/auth/forgot');
					}
				}));
			} catch(err){
				logger.error(err);
			}
		});
	}
	function updatePassword(req, res) {
		if (req.body.password === req.body.confirm) {
			initDb().then(connection => {
				try {
					logger.log(req.body);
					let client = connection.db(config.get('db').name);
					let collection = client.collection('users');
					collection.findOne({'resetPasswordToken': req.params.token, resetPasswordExpires: { $gt: Date.now()}}, ((err, user) => {
						if (user) {
							user.password = req.body.password;
							user.resetPasswordToken = undefined;
							user.resetPasswordExpires = undefined;
							collection.save(user, (err)=> {
								sendConfirmation(user).then( ()=> {
									req.login(req.body, (user)=> {
										req.flash('success', 'Password changed successfully');
										logger.log('req.user', req.user);
										res.redirect('/auth/profile');
									});
								});
							});
						} else {
							req.flash('error', 'Password reset token is invalid or has expired.');
							res.redirect('/auth/forgot');
						}
					}));
				} catch(err){
					logger.error(err);
				}
			});
		} else {
			logger.log('password and confirm should be the same');
			req.flash('error', 'password and confirm should be the same');
			res.redirect('/auth/reset/' + req.params.token);
		}
	}
	async function initDb() {
		try {
			return await dbContext.getInstance().connect(config.get('db'));
		} catch (err) {
			logger.error(`Can't initialize connection to db. error: `, err)
		}
	}
	return {resetPassword, signUp, loadResetPage, updatePassword};
}
module.exports = authController;
