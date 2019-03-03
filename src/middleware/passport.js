const passport = require('passport');
require('./strategies/local.strategy')();

module.exports = function PassportConfig(app) {
	app.use(passport.initialize());
	app.use(passport.session( ));
	//store
	passport.serializeUser((user, done)=> {
		done(null, user);
	});
	//retrieve
	passport.deserializeUser((user, done)=>{
		done(null, user); //find user by id
	});
};
