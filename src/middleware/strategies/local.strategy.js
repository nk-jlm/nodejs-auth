const passport = require('passport');
const {Strategy} = require('passport-local');
const dbContext = require('../../db');
const config = require('../../../config');
const logger = require('../../logger');

module.exports = function localStrategy() {
	passport.use(new Strategy(
		{
			usernameField: 'username',
			passwordField: 'password'
		},
		(username, password, done) => {
			initDb().then(connection => {
				try {
					let client = connection.db(config.get('db').name);
					let collection = client.collection('users');
					collection.findOne({username}, ((err, user)=> {
						if ((user.password) === password) {
							logger.log(user);
							done(null, user);
						} else {
							done(null, false);
						}
					}));
				} catch (err){
					logger.error(err);
				}
			});
		}
	));

	async function initDb() {
		try {
			return await dbContext.getInstance().connect(config.get('db'));
		} catch (err) {
			logger.error(`Can't initialize connection to db. error: `, err)
		}
	}
};
