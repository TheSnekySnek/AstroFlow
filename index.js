const express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
var scope = require('./scope')
var camera = require('./camera')
var api = require('./api')
var sudo = require('sudo-js');
var sextant = require('sextant.js')
const { exec } = require('child_process');
var screen = require('./screen')
var network = require('./network')
var usb = require('usb');
const Gpio = require('onoff').Gpio;

var wifiData = {connected: false}
var scopeData = {connected: false}
var cameraData = {connected: false}

async function connectScope() {
  var scopeState = await scope.connect()
  console.log(scopeState)
  if(scopeState){
    screen.setScope("OK")
    var coor = await scope.getPos()
    console.log(coor)
    scopeConnected = true
    scopeData = coor
    scopeData.connected = true;
  }
  else{
    screen.setScope("ERROR")
    scopeConnected = false;
    scopeData.connected = false
  }
  io.emit("scopeStatus", scopeData)
}

async function displayWifi() {
  var wifi = await network.getWifi()
  if(wifi){
    screen.setWifiSignal(wifi.quality)
    screen.setWifiName(wifi.ssid)
  }
  setInterval(async() => {
    var wifi = await network.getWifi()
    if(wifi){
      screen.setWifiSignal(wifi.quality)
      screen.setWifiName(wifi.ssid)
      wifiData = wifi
      wifiData.connected = true;
      io.emit("wifiStatus", wifiData)
    }
  }, 3000);
}

async function connectCamera() {
  var cameraState = await camera.check()
  if(cameraState.connected){
    screen.setCamera("OK")
    cameraConnected = true;
    cameraData = cameraState
    cameraData.connected = true;
  }
  else{
    screen.setCamera("ERROR")
    cameraData.connected = false;
  }
  io.emit("cameraStatus", cameraData)
}

async function displayIp() {
  var ip = await network.getIp()
  if(ip){
    screen.setIp(ip)
  }
  else{
    screen.setIp("X")
  } 
}

async function bootSeq() {
  await screen.displayBoot();
  displayWifi()
  displayIp()
  connectScope()
  connectCamera()
}

bootSeq()

usb.on('attach', function(device) {
  if(!scopeData.connected)
    connectScope()
  if(!cameraData.connected)
    connectCamera()
});
usb.on('detach', function(device) {
  connectScope()
  connectCamera()
});

var stop = false;

var scopeConnected = false
var cameraConnected = false

var isImaging = false
var currN = 0
var maxN = 0


app.use(express.static(path.join(__dirname,'dashboard')));

sextant.login("brdwqjigvufzexkj")

io.on('connection', async function(socket){
  
  socket.emit("scopeStatus", scopeData)
  socket.emit("wifiStatus", wifiData)
  socket.emit("cameraStatus", cameraData)


  socket.on('refreshUsb', async function(msg){
    connectScope()
    connectCamera()
  });

  socket.on('cnCam', async function(msg){
    await camera.updateLastImage()
    cameraConnected = true
    socket.emit("cm", {})
  });
  
  socket.on('restart', async function(msg){
    console.log("RES")
    process.exit(0)
  });

  socket.on('slew', async function(msg){
    scope.slew(msg.dir, msg.stp, msg.rate)
  });

  socket.on('setIso', async function(msg){
    camera.setIso(msg.iso)
  });

  socket.on('cancelImg', async function(msg){
    stop = true
  });

  socket.on('prev', async function(msg){
    /*cleanImages()
    var li = await camera.getLastImage()
    console.log(li)
    socket.emit("preview", {image: li})*/
    exec('gphoto2 --set-config /main/capturesettings/shutterspeed=' + msg.expo, (err, stdout, stderr) => {
      exec('gphoto2 --set-config /main/capturesettings/imagequality=1', (err, stdout, stderr) => {
        exec('gphoto2 --set-config /main/capturesettings/imagesize=2', (err, stdout, stderr) => {
          exec('cd dashboard/images/live && gphoto2  --capture-image-and-download  --force-overwrite', (err, stdout, stderr) => {
            exec('gphoto2 --set-config /main/capturesettings/shutterspeed=52 && gphoto2 --set-config /main/capturesettings/imagequality=6 && gphoto2 --set-config /main/capturesettings/imagesize=0', (err, stdout, stderr) => {
              socket.emit("preview", {})
            })
          })
        })
      })
    })
  });
  socket.on('prevl', async function(msg){
    cleanImages()
    var li = await camera.getLastImage()
    console.log(li)
    socket.emit("previewL", {image: li})
  });
  socket.on('snap', async function(msg){
    isImaging = true
    await camera.setIso(msg.iso)
    for (let i = 0; i < msg.num; i++) {
      if(stop)
        break
      await camera.takeExposure(msg.expo * 1000)
      io.emit("pic", {n: i+1, max: msg.num, expo: msg.expo * 1000})
    }
    stop = false
    isImaging = false
  });

  socket.on('shut', async function(msg){
    sudo.setPassword(msg.pwd);
    var command = ['halt'];
    sudo.exec(command, function(err, pid, result) {
        console.log("OFF");
    });
  });

  socket.on('goTo', async function(msg){
    try {
      var object = await api.getObject(msg.name)
      scope.goTo(object.ra.decimal, object.dec.decimal)
    } catch (error) {
      console.log(error)
    }
    
  });

  socket.on('solve', async function(msg){
    var co = await scope.getPos()
    console.log(co)
    var data = await sextant.solve("http://localhost:3000/images/live.jpg", {
      center_ra: co.ra,
      center_dec: co.dec,
      radius: 10
    })
    scope.sync(data.ra, data.dec)
    console.log("Scoped Synced")
    socket.emit("solved", data)
  });

});



function cleanImages() {
  fs.readdir("dashboard/images", (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join("dashboard/images", file), err => {
        if (err) throw err;
      });
    }
  });
}

http.listen(3000);


