const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');
const logger = require('../logger');
const mongoose = require('mongoose');

const COLLECTION_NAME = 'collectionForTest';
mongoose.Promise = global.Promise;

class DbContext {
	constructor() {
		this._connection = null;
		this._db = null;
	}

	async connect(options = {}) {
		if (DbContext._connection !== undefined) {
			return DbContext._connection;
		}
		const connection = DbContext._connection = await mongoose.connect(`mongodb://${options.host}:${options.port}/${options.name}`, { useNewUrlParser: true });
		//const connection = DbContext._connection = await MongoClient.connect(`mongodb://${options.host}:${options.port}`, { useNewUrlParser: true });
		//DbContext._db = connection.db(options.name);
		await DbContext._setupDb();

		return connection;
	}

	disconnect() {
		if(!DbContext._connection) {
			throw new Error(`Can't disconnect. Connection isn't established.`)
		}

		DbContext._connection.close();
		DbContext._connection = DbContext._db = null;
	}

	static getInstance() {
		return DbContext._instance || (DbContext._instance = new DbContext());
	}

	static _setupDb() {
		//dbClient.collection(COLLECTION_NAME).createIndex([{"type": 1}, {name: "text"}]);
	}
}

module.exports = DbContext;
