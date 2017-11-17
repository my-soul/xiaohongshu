var DBM = require('../util/dbm');
var Eventproxy  = require('eventproxy');

exports.queryProductById = function(param, callback) {
    var sql = "SELECT * FROM t_product WHERE product_id=?";
    var args = [param.product_id];
    DBM.query(sql, args, callback);
}

exports.getProductList = function(param, callback) {
    if(!param.page)param.page=1;
    if(!param.count)param.count=20;
    if(!param.sort)param.sort='create_time';
    
    var ep = new Eventproxy();
	var start = (param.page-1)*param.count;
    var sql = "SELECT * FROM t_product ORDER BY "+param.sort+" DESC LIMIT ?,?";
    if(param.hot){
        sql = "SELECT * FROM t_product WHERE hot=1 ORDER BY "+param.sort+" DESC LIMIT ?,?";
    }
    var args = [start,param.count];
    DBM.query(sql, args, ep.done('list'));

    var sql_count  = 'SELECT COUNT(*) FROM t_product';
    DBM.query(sql_count, [], ep.done('count'));

    ep.all('list','count',function(list,count){
        callback(null,{data:list,count:count[0]['COUNT(*)']});
    });
}


exports.addProduct = function(param, callback) {
    var sql = "INSERT INTO t_product (product_name,product_subtitle,product_price,product_market_price,product_image,product_image_more,product_spec,product_body,sort,stock,create_time,isdel) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),?)";
    var args = [
        param.product_name,
        param.product_subtitle,
        param.product_price,
        param.product_market_price,
        param.product_image,
        param.product_image_more,
        param.product_spec,
        param.product_body,
        param.sort,
        param.stock,
        '0',
    ];
    DBM.query(sql, args, callback);
}

exports.updateProduct = function(param, callback) {
    var sql = "UPDATE t_product SET product_name=?,product_subtitle=?,product_price=?,product_market_price=?,product_image=?,product_image_more=?,product_spec=?,product_body=?,sort=?,stock=?,create_time=NOW()  WHERE product_id=?";

    var args = [
        param.product_name,
        param.product_subtitle,
        param.product_price,
        param.product_market_price,
        param.product_image,
        param.product_image_more,
        param.product_spec,
        param.product_body,
        param.sort,
        param.stock,

        param.product_id
    ];
    DBM.query(sql, args, callback);
}

exports.updateProduct_hot = function(param, callback) {
    var sql = "UPDATE t_product SET hot=? WHERE product_id=?";

    var args = [

        param.hot,

        param.product_id
    ];
    DBM.query(sql, args, callback);
}

exports.delProduct = function(product_id, callback) {
    var sql = "DELETE FROM t_product WHERE product_id=?";
    if(!product_id){
        return;
    }
    DBM.query(sql, [product_id], callback);
}
