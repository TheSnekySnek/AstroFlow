var request = require('request')

module.exports = {
    getObject: function(name) {
        return new Promise(function(resolve, reject) {
            request("http://www.strudel.org.uk/lookUP/json/?name=" + name, function(err, resp, body) {
                var response = JSON.parse(body)
                if(response.message){
                    reject("Unknown")
                }
                else{
                    if(response.ra.decimal < 0)
                        response.ra.decimal = 360 + response.ra.decimal
                    if(response.dec.decimal < 0)
                        response.dec.decimal = 360 + response.dec.decimal
                    resolve(response)
                }
            })
        })
    }
}