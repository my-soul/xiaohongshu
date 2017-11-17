var express = require('express');
var Auth = require('../middlewares/auth');
var router = express.Router();

//首页相关
var product = require('../controller/product');

router.get('/', product._detail);
router.get('/detail', product._detail);

router.post('/del',Auth.adminRequired, product.delProduct);

router.post('/list', product.product_list);
router.post('/hot', Auth.adminRequired,product.hot);

module.exports = router;
