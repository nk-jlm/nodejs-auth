/*let winston = require('winston');
let ENV = process.env.NODE_ENV;

function getLogger(module) {
	console.log(ENV)
	return winston.createLogger({
		level: (ENV==='development') ? 'debug' : 'error',
		transports: [
			new winston.transports.Console()
		]
	});
}

module.exports = getLogger;*/

module.exports = {
	log: (...args) => {
		return console.log.apply(console, args)
	},
	error: (...args) => {
		return console.error.apply(console, args)
	},
	info: (...args) => {
		return console.log.apply(console, args)
	},
	//TODO: add trace, debug methods
}
