var express = require('express');
var router = express.Router();
var Auth = require('../middlewares/auth');

//首页相关
var record = require('../controller/record');

router.get('/order', record._order);

router.post('/new', record.new);
router.post('/del', Auth.adminRequired, record.del);

router.get('/pay', record._pay);
router.post('/pay', record.pay);



module.exports = router;