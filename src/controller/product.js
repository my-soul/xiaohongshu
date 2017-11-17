/**************************************
 * author: rk
 * 2017年7月3日
 */
var proxy_product = require("../proxy/product");

exports._detail = function(req, res) {
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
                product.product_spec = [{ spec_name: '规格', spac_value: "默认" }];
            }
        }
        res.render('product_detail', { product: product });
    });
}

exports.product_list = function(req, res) {
    var page = req.query.page || 1;
    proxy_product.getProductList({page:page,count:5}, function(err, data) {
        if (err) {
            return;
        }
        res.end(JSON.stringify({ products: data.data,page: page,page_count:Math.ceil(data.count/5)}));
    });

}

exports.delProduct = function(req, res) {
    var param = req.body;

    var product_id = param.id;

    proxy_product.delProduct(product_id, function(err, data) {
        res.end('{"code":200}');
    });
}

exports.delProduct = function(req, res) {
    var param = req.body;

    var product_id = param.id;

    proxy_product.delProduct(product_id, function(err, data) {
        res.end('{"code":200}');
    });
}

exports.hot = function(req, res) {
    var param = req.body;

    var product_id = param.id;
    var hot = param.hot;

    proxy_product.updateProduct_hot({hot:hot,product_id:product_id}, function(err, data) {
        res.end('{"code":200}');
    });
}