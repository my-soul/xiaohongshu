var Crypto = require('crypto');

exports.MD5 = function(str){
	var md5 = Crypto.createHash('md5');
	md5.update(str);
	return md5.digest('hex');
}

exports.BASE64 = function(param){
	var buffer = null;
	if(typeof(param) === 'string'){
		buffer = new Buffer(param.toUpperCase());
	}else{
		buffer = new Buffer(param, 'binary');
	}
	return buffer.toString('base64');
}

exports.UNBASE64 = function(str){
	return new Buffer(str, 'base64').toString();
}
