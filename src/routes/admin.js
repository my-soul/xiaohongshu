var express = require('express');
var router = express.Router();
var Auth = require('../middlewares/auth');

var admin = require('../controller/admin');

router.use(Auth.adminRequired);

router.get('/', admin._index); //首页

router.get('/login', admin._login); //登录页面

router.post('/login', admin.login); //登录

router.get('/logout', admin._logout); //退出登录

router.get('/product_add', admin._product_add); //
router.post('/product_add', admin.product_add); //

router.get('/product_edit', admin._product_edit); //
router.post('/product_edit', admin.product_edit); //

router.get('/product_list', admin._product_list); //

router.get('/record_list', admin._record_list); //

router.get('/qrcode', admin._qrcode); //
router.post('/qrcode', admin.qrcode); //设置支付二维码

router.get('/pass', admin._pass); //
router.post('/pass', admin.pass); //修改密码

router.get('/setting', admin._setting); //
router.post('/setting', admin.setting); //

module.exports = router;