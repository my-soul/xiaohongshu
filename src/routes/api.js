var express = require('express');
var router = express.Router();

var api = require('../controller/api');
router.post('/upload', api.upload);

module.exports = router;
