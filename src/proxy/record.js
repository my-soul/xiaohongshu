var DBM = require('../util/dbm');
var uuidv1 = require('uuid/v1');
var Eventproxy = require('eventproxy');


exports.queryRecordById = function(param, callback) {
    var sql = "SELECT * FROM t_record WHERE record_id=? ";
    var args = [param.record_id];
    DBM.query(sql, args, callback);
}

exports.getRecordList = function(param, callback) {
    var ep = new Eventproxy();
	var start = (param.page-1)*param.count;
    var sql = "SELECT * FROM t_record ORDER BY create_time DESC LIMIT ?,?";
    var args = [start,param.count];
    DBM.query(sql, args, ep.done('list'));

    var sql_count  = 'SELECT COUNT(*) FROM t_record';
    DBM.query(sql_count, [], ep.done('count'));

    ep.all('list','count',function(list,count){
        callback(null,{data:list,count:count[0]['COUNT(*)']});
    });
}

exports.delRecord = function(record_id, callback) {
    var sql = "DELETE FROM t_record WHERE record_id=?";
    DBM.query(sql, [record_id], callback);
}



/**
 * 增加购买记录
 */
exports.newRecord = function(param, callback) {
    var sql = "INSERT INTO t_record (record_id,buyer_id,product_id,product_image,product_name,product_price,attr,price,amount,state,create_time) VALUES (?,?,?,?,?,?,?,?,?,?,NOW())";

    var args = [
        param.record_id,
        param.buyer_id,

        param.product_id,
        param.product_image,
        param.product_name,
        param.product_price,

        param.attr,
        param.price,
        param.amount,
        'new'
    ];
    DBM.query(sql, args, callback);
};


exports.prePay = function(param, callback) {
    var sql = 'UPDATE t_record SET customer=?,cellphone=?,address=?,note=?,state=?,create_time=NOW() WHERE record_id=?';

    var args = [
        param.address_name,
        param.address_phone,
        param.address_address1 + param.address_address2,
        '',
        'prepay',
        param.id,
    ];
    DBM.query(sql, args, callback);
};