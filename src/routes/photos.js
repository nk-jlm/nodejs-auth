const express = require('express');
const photosRouter = express.Router();
const dbContext = require('../db');
const config = require('../../config');
const logger = require('../logger');
const instagramService = require('../services/instagramService');
const photosController = require('../controllers/photosController');

function router(navList) {
	let {loadUserPosts} = photosController(instagramService, navList);
	photosRouter.use((req, res, next)=> {
		if(req.user) {
			next();
		} else {
			res.redirect('/');
		}
	});
	photosRouter.route('/').get(loadUserPosts);
	return photosRouter;
}
module.exports = router;
