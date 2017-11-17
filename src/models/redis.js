var Config = require('../config');
var Redis = require('ioredis');
var Log = require('../log');

var client = new Redis({
	host: Config.redis.host,
	port: Config.redis.port,
	db: Config.redis.db
//	password: Config.redis.password,
});

Log.trace('redis connected');
exports = module.exports = client;
