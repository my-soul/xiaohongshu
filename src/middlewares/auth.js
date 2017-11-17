var Url = require('url');

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
  var path = Url.parse(req.originalUrl).pathname;
  var admin_log = /\/admin\/login/g;

  if (!req.session.admin && !admin_log.test(path)) {
    return res.render('admin/login');
  }

  next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user || !req.session.user._id) {
    return res.status(403).send('forbidden!');
  }

  next();
};

