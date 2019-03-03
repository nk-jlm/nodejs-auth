const {MongoClient} = require('mongodb');
const config = require('../../config');
const logger = require('../logger');

const COLLECTION_NAME = 'photos';

class DbContext {
	constructor() {
		this._connection = null;
		this._db = null;
	}

	async connect(options = {}) {
		if (DbContext._connection !== undefined) {
			return DbContext._connection;
		}
		const connection = DbContext._connection = await MongoClient.connect(`mongodb://${options.host}:${options.port}`, { useNewUrlParser: true });
		DbContext._db = connection.db(options.name);
		await DbContext._setupDb(DbContext._db);
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

	static _setupDb(dbClient) {
/*		dbClient.collection(COLLECTION_NAME).insertMany([
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
		]);*/
	}
}

module.exports = DbContext;
