var logger = require('../logger');

var photos = [
	{
		path: '/images/img.png',
		title: 'my photo',
		hash: '#newPhoto'
	},
	{
		path: '/images/img.png',
		title: 'my photo',
		hash: '#newPhoto'
	},
	{
		path: '/images/img.png',
		title: 'my photo',
		hash: '#newPhoto'
	}
];

class PhotosController {
	constructor(navList) {
		PhotosController.navList = navList;
	}

	static getPhotos(req, res) {
		res.render('photos', {
			user: req.user,
			navList : PhotosController.navList,
			photos
		});
	};
}
module.exports = PhotosController;
