const request = require('request');
const logger = require('../logger');

function instagramService() {
	function getById(accessToken) {
		return new Promise((resolve, reject) => {
			request('https://api.instagram.com/v1/users/self/media/recent/?access_token='+accessToken, { json: true }, (err, res, body) => {
				if (err) { reject(err); }
				resolve(body.data);
			});
		});
	}
	return {getById}
}
module.exports = instagramService();
