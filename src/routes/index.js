const express = require('express');
const indexRouter = express.Router();

function router(navList) {
	indexRouter.route('/').get((req, res)=> {
		res.render('index', {
			navList: navList,
			user: req.user
		});
	});
	return indexRouter;
}
module.exports = router;
