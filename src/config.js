/**
 * Created by zero on 15-12-01.
 */
module.exports = {

	log_level: 6,	//1-6
	app_name: 'store',	//应用名称
	host: 'http://www.iuvei.com',
	port: '6699',

	redis:{
		host: 'localhost',
		port: 6379,
		sessiondb: 14,
		db: 15,
		password: 'Aa@123456'
	},

	database:{
		host:		'localhost',
		port:		33306,
		database:	'store',
		user:		'zero',
		password:	'123456'
	},

  	session_secret: 'store_secret', //
  	auth_cookie_name: 'store_',
}
