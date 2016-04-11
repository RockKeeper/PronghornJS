var get_ip = require('ipware')("./../../ipware.json").get_ip;


module.exports.helper = function (app) {
    var check = function(req){
        var ip_info = get_ip(req);
        var ip = req.headers['x-real-ip'] || ip_info.clientIp;
        return true;//(ip == '127.0.0.1' || ip == '::ffff:127.0.0.1' || ip == '84.177.213.229' || ip == '85.183.140.182' || ip == '84.137.179.59' );
    };

    return check;
};