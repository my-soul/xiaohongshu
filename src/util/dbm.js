var Config = require('../config');
var Generic = require('generic-pool');
var MySQL = require('mysql');
var Log = require("../log").logger('util/dbm');

var pool = Generic.Pool({
	name:	'mysql',
	create:	function(callback){
			Log.trace('create database connection');
			var conn = MySQL.createConnection({
				host:		Config.database.host,
				port:		Config.database.port,
				database:	Config.database.database,
				user:		Config.database.user,
				password:	Config.database.password
			});
			conn.connect(function(){
				Log.info(conn.state);
				return callback(null,conn);
			});
		},
	destroy:function(conn){
			Log.info(conn.state);
			conn.end();
		},
	max:	3,
	min:	1,
	idleTimeoutMillis:30*1000,
	log:	false
});

pool.query = function(query, param, callback) {
	try{
		pool.acquire(function(err,conn){
			conn.query(query, param, function(err,rows,fields){
				try{
					pool.release(conn);
					return callback(err,rows);
				}catch(err){
					Log.trace(err);
				}
			});
		});
	}catch(err){
		Log.trace(err);
	}
};

exports.query = function(sql, args, callback){
	pool.query(sql, args, callback);
};
