const {Strategy} = require('passport-instagram');
const passport = require('passport');
const logger = require('../../logger');
const dbContext = require('../../db');
const config = require('../../../config');
const INSTAGRAM_CLIENT_ID = '2bc1a2d6269a409e92cde1fa24213f3f';
const INSTAGRAM_CLIENT_SECRET = 'be696c6bb01f45c7927ddb9e8a7e2c4b';

module.exports = function instagramStrategy() {
	passport.use(new Strategy({
			clientID: INSTAGRAM_CLIENT_ID,
			clientSecret: INSTAGRAM_CLIENT_SECRET,
			callbackURL: "http://localhost:3001/auth/instagram/callback"
		},
		(accessToken, refreshToken, profile, done) => {
			initDb().then(connection => {
				try {
					const userData = {
						instagramId: profile.id,
						username: profile.username,
						avatar: profile._json.data.profile_picture,
						counts: profile._json.data.counts
					};
					let client = connection.db(config.get('db').name);
					let collection = client.collection('users');
					logger.log(profile);
					collection.findOne({instagramId: userData.instagramId}, ((err, user)=> {
						if (user) {
							logger.log('user', user);
							done(null, user);
						} else {
							collection.insertOne(userData, (err, result)=> {
								logger.log('result', result);
								done(null, userData);
							});
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
