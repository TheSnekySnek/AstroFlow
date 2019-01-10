var oled = require('oled-js-pi');
var font = require('oled-font-5x7');
var pngparse = require('pngparse');
 
var opts = {
  width: 128,
  height: 64,
  address: 0x3C
};


 
var oled = new oled(opts);
oled.clearDisplay();

module.exports = {
  displayBoot: async function(){
    return new Promise(function(resolve, reject) {
      pngparse.parseFile('logo.png', function(err, image) {
        oled.drawBitmap(image.data);
      });

      setTimeout(() => {
        oled.clearDisplay();
        oled.setCursor(1, 1);
        oled.writeString(font, 2, '    INFO', 1, false);
        oled.setCursor(1, 16);
        oled.writeString(font, 1, 'WiFi: ---', 1, false);
        oled.setCursor(1, 24);
        oled.writeString(font, 1, 'Signal: ---', 1, false);
        oled.setCursor(1, 32);
        oled.writeString(font, 1, 'Ip: ---', 1, false);
        oled.setCursor(1, 40);
        oled.writeString(font, 1, 'Scope: ---', 1, false);
        oled.setCursor(1, 48);
        oled.writeString(font, 1, 'Camera: ---', 1, false);
        oled.setCursor(1, 56);
        oled.writeString(font, 1, 'Guiding: ---', 1, false);
        resolve()
      }, 3000);
    })
  },
  setIp: function(ip) {
    oled.setCursor(1, 32);
    oled.writeString(font, 1, 'Ip: ' + ip, 1, false);
  },
  setScope: function(scope) {
    oled.setCursor(1, 40);
    oled.writeString(font, 1, 'Scope: ' + scope, 1, false);
  },
  setCamera: function(camera) {
    oled.setCursor(1, 48);
    oled.writeString(font, 1, 'Camera: ' + camera, 1, false);
  },
  setWifiSignal: function(signal) {
    oled.setCursor(1, 24);
    oled.writeString(font, 1, 'Signal: ' + signal + "%", 1, false);
  },
  setWifiName: function(name) {
    if(name.length > 12)
      name = name.substr(0, 12);
    oled.setCursor(1, 16);
    oled.writeString(font, 1, 'WiFi: ' + name, 1, false);
  }
}



