const express = require('express');
const photosRouter = express.Router();
const dbContext = require('../db');
const config = require('../../config');
const logger = require('../logger');

function router(navList) {
	photosRouter.use((req, res, next)=> {
		if(req.user) {
			next();
		} else {
			res.redirect('/');
		}
	});
	photosRouter.route('/').get((req, res)=> {
		initDb().then(connection => {
			try {
				let client = connection.db(config.get('db').name);
				let collection = client.collection('photos');
				collection.find().toArray((err, data)=> {
					res.render('photos', {
						user: req.user,
						navList: navList,
						photos: data
					});
					}
				)

			} catch (err){
				logger.error(err);
			}
		});
	});
	return photosRouter;
}
async function initDb() {
	try {
		return await dbContext.getInstance().connect(config.get('db'));
	} catch (err) {
		logger.error(`Can't initialize connection to db. error: `, err)
	}
}
module.exports = router;
