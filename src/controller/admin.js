/**************************************
 * author: rk
 * 2017年7月3日
 */
var Log = require('../log').logger('controller/admin');
var proxy_Setting = require("../proxy/setting");
var proxy_product = require("../proxy/product");
var proxy_record = require("../proxy/record");

var Eventproxy = require('eventproxy');
var util = require('util');

exports._index = function(req, res) {

    res.render('admin/index', {});
}


exports._login = function(req, res) {
    res.render('admin/login', {});
}

exports.login = function(req, res) {
    var ep = new Eventproxy();
    var login_name = req.body.name;
    var passcode = req.body.password;

    proxy_Setting.get('login_name',function(err, data) {
        if (err) {
            Log.error(err);
            ep.emit('prop_err', '服务器忙');
        } else {
            if (login_name == data) {
                ep.emit('login_name', login_name);
            } else {
                ep.emit('prop_err', '账号错误');
            }
        }
    });

    ep.on('login_name', function(login_name) {
        proxy_Setting.get('passcode', function(err, data) {
            if (err) {
                Log.error(err);
                ep.emit('prop_err', '服务器忙');
            } else {
                if (passcode == data) {
                    ep.emit('passcode', passcode);
                } else {
                    ep.emit('prop_err', '密码错误');
                }
            }
        });
    });

    ep.on('prop_err', function(msg) {
        res.status(422);
        return res.render('admin/login', { error: msg });
    });

    ep.all('login_name', 'passcode', function(login_name, passcode) {
        req.session.admin = {
            login_name: login_name
        }
        return res.redirect("/admin/record_list");
    });
}

exports._logout = function(req, res) {
    req.session.admin = null;
    res.redirect('/admin/login');
}

exports._product_add = function(req, res) {
    res.render('admin/product_add', { product: {} });
}
exports.product_add = function(req, res) {
    var param = req.body;

    var product_name = param.title;
    var product_subtitle = param.sub_title;
    var product_price = param.price;
    var product_market_price = param.market_price;
    var product_image = param.image;
    var product_image_more = param.image_more;
    var product_spec = param.spec;
    var product_body = param.body
    var sort = param.sort;
    var stock = param.stock;


    var product = {
        product_name: product_name,
        product_subtitle: product_subtitle,
        product_price: product_price,
        product_market_price: product_market_price,
        product_image: product_image,
        product_image_more: product_image_more,
        product_spec: product_spec,
        product_body: product_body,
        sort: sort,
        stock: stock
    };

    proxy_product.addProduct(product, function(err, data) {
        res.redirect('/admin/product_list');
    });


}
exports._product_edit = function(req, res) {
    var product_id = req.query.id;

    proxy_product.queryProductById({ product_id: product_id }, function(err, data) {
        if (err) {
            return;
        }
        var product = data[0];
        if (product.product_spec) {
            try {
                product.product_spec = JSON.parse(product.product_spec);
            } catch (error) {
                product.product_spec = [];
            }
        }
        res.render('admin/product_add', { product: product });
    });
}

exports.product_edit = function(req, res) {
    var param = req.body;

    var product_id = param.product_id;

    var product_name = param.title;
    var product_subtitle = param.sub_title;
    var product_price = param.price;
    var product_market_price = param.market_price;
    var product_image = param.image;
    var product_image_more = param.image_more;
    var product_spec = param.spec;
    var product_body = param.body
    var sort = param.sort;
    var stock = param.stock;


    var product = {
        product_name: product_name,
        product_subtitle: product_subtitle,
        product_price: product_price,
        product_market_price: product_market_price,
        product_image: product_image,
        product_image_more: product_image_more,
        product_spec: product_spec,
        product_body: product_body,
        sort: sort,
        stock: stock,

        product_id: product_id
    };

    proxy_product.updateProduct(product, function(err, data) {
        res.redirect('/admin/product_list');
    });
}

exports._product_list = function(req, res) {
    var page = req.query.page || 1;
    proxy_product.getProductList({page:page,count:20}, function(err, data) {
        if (err) {
            return;
        }
        res.render('admin/product_list', { products: data.data,page: page,page_count:Math.ceil(data.count/20)});
    });

}

exports._record_list = function(req, res) {
    var page = req.query.page || 1;
    proxy_record.getRecordList({page:page,count:30}, function(err, data) {
        if (err) {
            return;
        }
        res.render('admin/record_list', { records: data.data,page: page,page_count:Math.ceil(data.count/30)});
    });
}

exports._qrcode = function(req, res) {

    proxy_Setting.get('qrcode',function(err, data) {
        if (err) {

        }
        res.render('admin/qrcode', { qrcode: data });
    });
}

exports.qrcode = function(req, res) {
    var img = req.body.img;
    proxy_Setting.set('qrcode', img, function(err, data) {
        if (err) {

        }
        res.send(JSON.stringify({ code: 200 }));
    });

}


exports._pass = function(req, res) {
    res.render('admin/pass');
}

exports.pass = function(req, res) {
    var ep = new Eventproxy();
    var body = req.body;
    var old_pass = body.mpass;

    var new_pass = body.newpass;
    var renew_pass = body.renewpass;

    ep.on('prop_err', function(msg) {
        res.send("<script>alert('" + msg + "');location.href='/admin/pass';</script>");
    });

    if (new_pass != renew_pass) {
        ep.emit('prop_err', '两次密码不一致');
    }


    proxy_Setting.get('passcode', function(err, data) {
        if (err) {
            Log.error(err);
        } else {
            if (old_pass == data) {

                proxy_Setting.set('passcode', new_pass, function(err, data) {
                    if (err) {

                    }
                    res.send("<script>alert('" + '修改成功' + "');location.href='/admin/logout';</script>");
                });

            } else {
                ep.emit('prop_err', '密码错误');
            }
        }
    });


}

exports._setting = function(req, res,next) {
    var ep = new Eventproxy();
    ep.fail(next);

    proxy_Setting.get('sitehost', ep.done('sitehost'));
    proxy_Setting.get('domain', ep.done('domain'));    
    proxy_Setting.get('banner', ep.done('banner'));   

    ep.all('sitehost','domain','banner',function(sitehost,domain,banner){
        res.render('admin/setting',{ banner:JSON.parse(banner) ,domain:domain, sitehost:sitehost});
    });    
}

exports.setting = function(req, res) {
    var ep = new Eventproxy();
    var body = req.body;
    var sitename = body.sitename;
    var banner = body.banner;

    var sitehost = body.sitehost;
    var domain = body.domain;

    proxy_Setting.set('sitehost', sitehost, function(err, data) {
        if (err) {

        }
        global.sitehost = sitehost;
        ep.emit('sitehost');
    });

    proxy_Setting.set('domain', domain, function(err, data) {
        if (err) {

        }
        global.sitedomain = domain;
        ep.emit('domian');
    });

    proxy_Setting.set('sitename', sitename, function(err, data) {
        if (err) {

        }
        req.app.locals.sitename = sitename;
        ep.emit('sitename');
    });

    proxy_Setting.set('banner', banner, function(err, data) {
        if (err) {

        }
        ep.emit('banner');
    });

    ep.all('banner','sitename','sitehost','domian',function(){
        res.send("<script>alert('" + '修改成功' + "');location.href='/admin/setting';</script>");
    });
}