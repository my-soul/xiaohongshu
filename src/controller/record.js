/**************************************
 * author: rk
 * 2017年7月3日
 */
var Eventproxy = require('eventproxy');
var proxy_product = require("../proxy/product");
var proxy_record = require("../proxy/record");
var proxy_setting = require("../proxy/setting");
var uuidv1 = require('uuid/v1');

exports._order = function(req, res) {
    var ep = new Eventproxy();
    var record_id = req.query.id;

    proxy_record.queryRecordById({ record_id: record_id }, function(err, record) {
        ep.emit('record', record[0]);
    });

    ep.all('record', function(record) {
        res.render('order', { record: record });
    });

}

exports._pay = function(req, res) {
    var ep = new Eventproxy();
    var record_id = req.query.id;

    proxy_record.queryRecordById({ record_id: record_id }, function(err, record) {
        ep.emit('record', record[0]);
    });

    proxy_setting.get('qrcode',function(err, data) {
        if (err) {

        }
        ep.emit('qrcode', data);
    });

    ep.all('record', 'qrcode', function(record, qrcode) {
        res.render('pay', { record: record, qrcode: qrcode });
    });

}

exports.pay = function(req, res) {
    var ep = new Eventproxy();

    proxy_record.prePay(req.body, function(err, record) {
        if (err) {

        }
        res.send(JSON.stringify({ code: 200, id: req.body.id }));
    });
}


exports.new = function(req, res) {
    var ep = new Eventproxy();

    var body = req.body;

    var record_id = uuidv1();

    var product_id = body.product_id;
    var attr = body.attr;
    var amount = body.amount;

    if (!req.cookies.buyer_id) {
        req.cookies.buyer_id = uuidv1();
    }

    var buyer_id = req.cookies.buyer_id;

    proxy_product.queryProductById({ product_id: product_id }, function(err, data) {
        if (err) {
            return;
        }
        ep.emit('product', data[0]);
    });


    ep.on('product', function(product) {
        var param = {
            record_id: record_id,
            buyer_id: buyer_id,
            product_id: product.product_id,
            product_image: product.product_image,
            product_name: product.product_name,
            product_price: product.product_price,
            attr: attr,
            price: new Number(product.product_price * amount).toFixed(2),
            amount: amount,
            state: 'new',
            create_time: new Date()
        }

        proxy_record.newRecord(param, function(err, data) {
            if (err) {

            } else {
                res.end('{"code": 200,"record_id":"' + record_id + '"}');
            }
        });
    });
}

exports.del = function(req,res,next){
    var record_id = req.body.id;
    proxy_record.delRecord(record_id,function(err, data){
        if(err){
            return next(err);
        }
        res.end('{"code":200}');
    });
}