/**************************************
 * author: rk
 * 2017年7月3日
 */
var Captcha = require("../util/captcha");
var Codec = require("../util/codec");
var proxy_product = require("../proxy/product");
var proxy_Setting = require("../proxy/setting");
var Log = require('../log').logger('models/redis');
var Eventproxy = require('eventproxy');

exports._index = function(req, res) {
    if(global.sitehost == req.headers.host){
		res.redirect(302, "http://"+global.sitedomain);
        return;
	}

    var ep = new Eventproxy();
    var page = req.query.page || 1;

    proxy_Setting.get('banner', function(err, data) {
        if (err) {

        }
        ep.emit('banner',JSON.parse(data));
    }); 
    
    proxy_product.getProductList({sort:'sort',count:10000}, function(err, data) {
        if (err) {
            return;
        }
        ep.emit('products',data.data);
    });
    proxy_product.getProductList({hot:'1'}, function(err, data) {
        if (err) {
            return;
        }
        ep.emit('hot',data.data);
    });

    ep.all('products','hot','banner',function(products,hot,banner){
        res.render('index', {banner:banner, hot:hot, products: products ,page: page,page_count:1});
    })
}



exports._address = function(req, res) {
    res.render('address_add');
}