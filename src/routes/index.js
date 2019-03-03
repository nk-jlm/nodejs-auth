var express = require('express');
var router = express.Router();
var navList = [
	{title: 'Home', link: '/'},
	{title: 'Photos', link: '/photos'}
];
var PhotosController = require('../middleware/photos.controller.js');
var AuthController = require('../middleware/auth.controller.js');
new AuthController(navList);
new PhotosController(navList);
// restrict index for logged in user only
router.get('/', AuthController.home);

// route to register page
router.get('/register', AuthController.register);

// route for register action
router.post('/register', AuthController.doRegister);

// route to login page
router.get('/login', AuthController.login);

// route for login action
router.post('/login', AuthController.doLogin);

// route for logout action
router.get('/logout', AuthController.logout);

router.get('/photos', PhotosController.getPhotos);

// route for logout action
router.get('/forget', AuthController.forgetPass);

//Todo - new routing for content pages
module.exports = router;
