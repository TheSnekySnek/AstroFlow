const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyUSB0', { stopbits: 1, baudRate: 9600, autoOpen: false })
var hasOpen = false;


module.exports = {
    connect: function() {
      return new Promise(function(resolve, reject) {
        if(!hasOpen){
          console.log("Connecting to scope...")
          port.open(function (err) {
            if (err) {
              console.log("Scope is disconnected")
              resolve(false)
            }else{
              hasOpen = true;
              console.log("Scope is connected")
              resolve(true)
            }
          })
        }
      })
    },

    /*getInfo: function() {
      var info = []
      return new Promise(function(resolve, reject) {
        done = false
        port.on('readable', function () {
          if(done)
            return

          var buf = port.read()
          var bytes = [...buf]
          info = info.concat(bytes)
          if(info.length == 10){
            done = true
            var data = info.toString()
            console.log(info)
            resolve({ra: parseInt(data.substr(0, 3), 16), dec: parseInt(data.substr(5, 8), 16)})
          }
        })
        port.write('w', function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('message written')
        })
      })
    },*/

    getPos: function() {
      return new Promise(function(resolve, reject) {
        var done = false
        var info = ""
        port.on('data', function (data) {
          if(done)
            return

          var buf = data
          console.log(buf)
          info = info.concat(buf.toString())
          if(info.length == 10){
            done = true
            console.log(info)
            console.log(parseInt(info.substr(0, 4), 16))
            resolve({ra: parseInt(info.substr(0, 4), 16) / 65536 * 360, dec: parseInt(info.substr(5, 4), 16)  / 65536 * 360})
          }
        })
        port.write('E', function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('message written')
        })
      })
    },

    sync: function(ra, dec) {
      return new Promise(function(resolve, reject) {
        var hra = ("0000" + (parseInt(ra/360 * 65536)).toString(16)).substr(-4).toUpperCase()
        var hdec = ("0000" + (parseInt(dec/360 * 65536)).toString(16)).substr(-4).toUpperCase()
        console.log(hra, hdec)
        port.write('S' + hra + "," + hdec, function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('message written')
        })
      })
    },

    goTo: function(ra, dec) {
      return new Promise(function(resolve, reject) {
        var hra = ("0000" + (parseInt(ra/360 * 65536)).toString(16)).substr(-4).toUpperCase()
        var hdec = ("0000" + (parseInt(dec/360 * 65536)).toString(16)).substr(-4).toUpperCase()
        console.log(hra, hdec)
        port.write('R' + hra + "," + hdec, function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('message written')
        })
      })
    },

    slew: function(dir, stop, rate = 6) {
      console.log(rate)
      var pos
      var way
      console.log(stop)
      if(stop == 1){
        console.log("stop")
        rate = 0
      }
        
      switch (dir) {
        case "right":
          way = 16
          pos = 36
          break;
        case "left":
          way = 16
          pos = 37
          break;
        case "up":
          way = 17
          pos = 36
          break;
        case "down":
          way = 17
          pos = 37
        break;
        default:

          break;
      }
      
      if(!stop){
        //Disable tracking
        port.write('T0', function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('Slewing')
        })
      }
        
      port.write('P' + String.fromCharCode(2) + String.fromCharCode(way) + String.fromCharCode(pos) + String.fromCharCode(rate) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0), function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log('Slewing')
      })

      if(stop){
        //Enable tracking
        port.write('T2', function(err) {
          if (err) {
            return console.log('Error on write: ', err.message)
          }
          console.log('Slewing')
        })
      }
    },
}