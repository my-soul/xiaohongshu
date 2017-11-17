var express = require('express');
var router = express.Router();

//首页相关
var index = require('../controller/index');
router.get('/', index._index); //首页
router.get('/index', index._index);
router.get('/address', index._address);

module.exports = router;