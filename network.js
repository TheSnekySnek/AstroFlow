const internalIp = require('internal-ip');
var wifi = require('node-wifi');

wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null
});

var isConnected = false;
var ipAdd



module.exports = {

    getIp: function() {
        return new Promise(function(resolve, reject) {
            internalIp.v4().then(ip => {
                resolve(ip)
            });
        })
    },
    getWifi: function() {
        return new Promise(function(resolve, reject) {
            wifi.getCurrentConnections(function(err, currentConnections) {
                if (err) {
                    console.log(err);
                }
                resolve(currentConnections[0])
            });
        })
    }
}