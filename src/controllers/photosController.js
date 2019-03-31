const dbContext = require('../db');
const config = require('../../config');
const logger = require('../logger');

function photosController(instagramService, navList) {
	async function loadUserPosts(req, res) {
		if (req.user.instagramId) {
			let data = await instagramService.getById(req.user.accessToken);
			if(data) {
				logger.error(data);
				res.render('photos', {
					user: req.user,
					navList: navList,
					posts: data
				});
			} else {
				req.flash('error', 'Couldn\'t get any data about user');
				res.redirect('/photos');
			}
		} else {
			initDb().then(connection => {
				try {
					let client = connection.db(config.get('db').name);
					let collection = client.collection('photos');
					collection.find().toArray((err, data)=> {
							res.render('photos', {
								user: req.user,
								navList: navList,
								posts: data
							});
						}
					)
				} catch (err){
					logger.error(err);
				}
			});
		}
	}
	async function initDb() {
		try {
			return await dbContext.getInstance().connect(config.get('db'));
		} catch (err) {
			logger.error(`Can't initialize connection to db. error: `, err)
		}
	}
	return {
		loadUserPosts
	};
}
module.exports = photosController;
