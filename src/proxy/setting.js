var DBM = require('../util/dbm');

// exports.getAdminPasscode = function(callback) {
//     var sql = "SELECT * from t_setting WHERE k=?";
//     var args = ['passcode'];
//     DBM.query(sql, args, callback);
// }
// exports.setAdminPasscode = function(param, callback) {
//     var sql = "UPDATE t_setting SET v=? WHERE k=?";
//     var args = [param.passcode, 'passcode'];
//     DBM.query(sql, args, callback);
// }


// exports.getSitename = function(callback) {
//     var sql = "SELECT * from t_setting WHERE k=?";
//     var args = ['store'];
//     DBM.query(sql, args, callback);
// }
// exports.setSitename = function(param, callback) {
//     var sql = "UPDATE t_setting SET v=? WHERE k=?";
//     var args = [param.sitename, 'store'];
//     DBM.query(sql, args, callback);
// }


// exports.getAdminLogin_name = function(callback) {
//     var sql = "SELECT * from t_setting WHERE k=?";
//     var args = ['login_name'];
//     DBM.query(sql, args, callback);
// }

// exports.getPayQrcode = function(callback) {
//     var sql = "SELECT * from t_setting WHERE k=?";
//     var args = ['qrcode'];
//     DBM.query(sql, args, callback);
// }
// exports.setPayQrcode = function(param, callback) {
//     var sql = "UPDATE t_setting SET v=? WHERE k=?";
//     var args = [param.img, 'qrcode'];
//     DBM.query(sql, args, callback);
// }


exports.set = function(key, value, callback) {
    var sql = "UPDATE t_setting SET v=? WHERE k=?";
    var args = [value, key];
    DBM.query(sql, args, callback);
}
exports.get = function(key, callback) {
    var sql = "SELECT * from t_setting WHERE k=?";
    var args = [key];
    DBM.query(sql, args, function(err, data){
        if(err){
            callback(err,null);
        }else{
            callback(null,data[0].v);
        }
    });
}
