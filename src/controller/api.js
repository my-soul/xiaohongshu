var Multiparty = require('multiparty');
var uuidv1 = require('uuid/v1');
var FS = require('fs');

/**
 * 文件上传
 */
exports.upload = function(req, res) {
    var form = new Multiparty.Form();
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            res.status(500).send({ error: err });
        } else {
            try {
                Object.keys(files).forEach(function(name) {
                    console.log('got file named ' + name);
                    var inputFile = files[name][0];
                    var uploadedPath = inputFile.path;
                    var fileName = uuidv1();
                    var dstPath = __dirname + '/../public/img/upload/' + fileName;
                    console.log(dstPath);
                    FS.rename(uploadedPath, dstPath, function(err) {
                        if (err) {
                            res.end('{"code": 500, "msg": "upload error"}');
                        } else {
                            res.end('{"code": 200, "url": "/img/upload/' + fileName + '"}');
                        }
                    });
                });
            } catch (e) {
                console.log(e);
            }
        }
    });
}