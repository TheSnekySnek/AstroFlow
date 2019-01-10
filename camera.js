const SerialPort = require('serialport')
const { exec } = require('child_process');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600, autoOpen: false })
const fs = require("fs")
const moveFile = require('move-file');
const sharp = require('sharp');
const Gpio = require('onoff').Gpio;

const trigger = new Gpio(26, 'out');

var lastImage = 0

module.exports = {
    check: function() {
        return new Promise(function(resolve, reject) {
            exec('gphoto2 --summary', (err, stdout, stderr) => {
                if(stdout[0] == 'C'){
                    var stdLines = stdout.split('\n')
                    resolve({
                        connected: true,
                        brand: stdLines[1].replace("Manufacturer: ", ""),
                        model: stdLines[2].replace("Model: ", "")
                    })
                }
                else{
                    resolve({connected: false})
                }
                resolve(stdout[0] == 'C')
            })
        })
    },
    takeExposure: function(time) {
        return new Promise(function(resolve, reject) {
            trigger.writeSync(1)
            console.log("Shutter Open")
            setTimeout(() => {
                trigger.writeSync(0)
                console.log("Shutter Closed")
              setTimeout(() => {
                  lastImage+=2
                resolve()
              }, 2000);
            }, time);
          })
    },
    setIso: function(iso) {
        return new Promise(function(resolve, reject) {
            exec('gphoto2 --set-config=/main/imgsettings/iso=' + iso, (err, stdout, stderr) => {
                console.log(stdout)
                resolve()
            })

        })
    },
    updateLastImage: function() {
        return new Promise(function(resolve, reject) {
            exec('gphoto2 --list-files', (err, stdout, stderr) => {
                console.log(stdout)
                var lines = stdout.split("\n")
                if(lines[lines.length-2].includes(".JPG")){
                    lastImage = parseInt(lines[lines.length-2].split(" ")[0].replace('#', ''))
                    resolve()
                }
                else if(lines[lines.length-3].includes(".JPG")){
                    lastImage = parseInt(lines[lines.length-3].split(" ")[0].replace('#', ''))
                    resolve()
                }
            })
        })
    },
    getLastImage: function() {
        return new Promise(function(resolve, reject) {        
            exec('cd dashboard/images && gphoto2 --get-file ' + lastImage, (err, stdout, stderr) => {
                var photoP = stdout.split(" ")[3].replace("\n", "")
                
                sharp("dashboard/images/" + photoP)
                  .resize(1080, 960)
                  .toFile("dashboard/images/live/live.jpg", (err, info) => {
                    console.log(err)
                    resolve("live.jpg")
                  } );
            })
        })
    },

}
