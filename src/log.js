var log4js = require("log4js");
var Config = require("./config");

exports.configure = function(){
	log4js.configure({
		appenders:[
			{type: 'console'},
			{
				type: 'file',
				filename: 'logs/'+Config.app_name+'.log',
				maxLogSize: 1024*1024*10,
				backups: 10,
			//	category: 'app',
			}
		]
	});
};

exports.logger = function(name){
	var dateFileLog = log4js.getLogger(name);
	var level;
	switch(Config.log_level){
		case 1: level = log4js.levels.FATAL; break;
		case 2: level = log4js.levels.ERROR; break;
		case 3: level = log4js.levels.WARN; break;
		case 4: level = log4js.levels.INFO; break;
		case 5: level = log4js.levels.DEBUG; break;
		case 6: level = log4js.levels.TRACE; break;
	}
	dateFileLog.setLevel(level);
	return dateFileLog;
};

exports.useLog = function(loger){
	var level;
	switch(Config.log_level){
		case 1: level = log4js.levels.FATAL; break;
		case 2: level = log4js.levels.ERROR; break;
		case 3: level = log4js.levels.WARN; break;
		case 4: level = log4js.levels.INFO; break;
		case 5: level = log4js.levels.DEBUG; break;
		case 6: level = log4js.levels.TRACE; break;
	}
	return log4js.connectLogger(loger, {level: level});
}
