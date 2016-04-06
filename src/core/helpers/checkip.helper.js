/**
 *
 *          _           _                       _
 *         | |         | |                     | |
 *      ___| | __ _ ___| |____      _____  _ __| | _____
 *     / __| |/ _` / __| '_ \ \ /\ / / _ \| '__| |/ / __|
 *     \__ \ | (_| \__ \ | | \ V  V / (_) | |  |   <\__ \
 *     |___/_|\__,_|___/_| |_|\_/\_/ \___/|_|  |_|\_\___/
 *                                        web development
 *
 *     http://www.slash-works.de </> hallo@slash-works.de
 *
 *
 * @author      rwollenburg
 * @copyright   rwollenburg@slashworks
 * @since       09.07.15 13:54
 * @package     Core
 *
 */


var get_ip = require('ipware')("./../../ipware.json").get_ip;


module.exports.helper = function (app) {
    var check = function(req){
        var ip_info = get_ip(req);
        var ip = req.headers['x-real-ip'] || ip_info.clientIp;
        return true;//(ip == '127.0.0.1' || ip == '::ffff:127.0.0.1' || ip == '84.177.213.229' || ip == '85.183.140.182' || ip == '84.137.179.59' );
    };

    app.set("checkip", check);
};