
var scopeData = {
  connected: false
}
var cameraData = {
  connected: false
}
var wifiData = {
  connected: false
}


function autoCalibrate() {
  if(!scopeData.connected){
    Swal({
      type: 'error',
      title: 'No Scope/Mount Connected',
      text: 'Make sure the scope/mount is plugged in and turned on.',
      footer: '<a href>Why do I have this issue?</a>'
    })
    return
  }
  if(!cameraData.connected){
    Swal({
      type: 'error',
      title: 'No Camera Connected',
      text: 'Make sure the camera is plugged in and turned on.',
      footer: '<a href>Why do I have this issue?</a>'
    })
    return
  }
}

function refreshUsb() {
  socket.emit("refreshUsb", {})
}


function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

var socket = io();
socket.on('scopeStatus', async function(msg){
  if(msg.connected){
    $('#scopeStatusConnection').text("Connectected")
    $('#scopeStatusConnection').addClass("isOk")
    $('#scopeStatusConnection').removeClass("isBad")
    $('#scopeStatusRA').text(msg.ra)
    $('#scopeStatusDEC').text(msg.dec)
    
  }
  else{
    $('#scopeStatusConnection').text("Disconnectected")
    $('#scopeStatusConnection').removeClass("isOk")
    $('#scopeStatusConnection').addClass("isBad")
    $('#scopeStatusRA').text("")
    $('#scopeStatusDEC').text("")
  }
  scopeData = msg
  
});

socket.on('cameraStatus', async function(msg){
  if(msg.connected){
    $('#cameraStatusConnection').text("Connectected")
    $('#cameraStatusConnection').addClass("isOk")
    $('#cameraStatusConnection').removeClass("isBad")
    $('#cameraStatusBrand').text(msg.brand)
    $('#cameraStatusModel').text(msg.model)
    
  }
  else{
    $('#cameraStatusConnection').text("Disconnectected")
    $('#cameraStatusConnection').removeClass("isOk")
    $('#cameraStatusConnection').addClass("isBad")
    $('#cameraStatusBrand').text("")
    $('#cameraStatusModel').text("")
  }
  cameraData = msg
  
});

socket.on('wifiStatus', async function(msg){
  if(msg.connected){
    $('#wifiStatusConnection').text("Connectected")
    $('#wifiStatusConnection').addClass("isOk")
    $('#wifiStatusConnection').removeClass("isBad")
    $('#wifiStatusSSID').text(msg.ssid)
    $('#wifiStatusQuality').text(msg.quality + "%")
  }
  else{
    $('#wifiStatusConnection').text("Disconnectected")
    $('#wifiStatusConnection').removeClass("isOk")
    $('#wifiStatusConnection').addClass("isBad")
    $('#wifiStatusSSID').text("")
    $('#wifiStatusQuality').text("")
  }
  wifiData = msg
  
});
socket.on('preview', async function(msg){
  d = new Date();
  $("#prev").attr("src", "/images/capt0000.jpg?"+d.getTime());
});
socket.on('previewL', async function(msg){
  $(".camBtn").prop("disabled",false);
  d = new Date();
  $("#prev").attr("src", "/images/live.jpg?"+d.getTime());
});
socket.on('solved', async function(msg){
  $(".camBtn").prop("disabled",false);
  $("#psImg1").attr("src", "http://nova.astrometry.net/annotated_display/" + msg.jobId + ".jpg")
  $("#psImg2").attr("src", "http://nova.astrometry.net/sky_plot/zoom1/" + msg.calId)
  $("#psImg3").attr("src", "http://nova.astrometry.net/sky_plot/zoom2/" + msg.calId)
  $("#psText").text("RA: " + msg.data.ra + "\nDEC: " + msg.data.dec)
});
socket.on('cm', async function(msg){
  $("#cnCam").prop("disabled",true);
  $(".camBtn").prop("disabled",false);
  $("#cnCam").text("Camera Connected")
  
});
socket.on('pic', async function(msg){
  $('#progressBar').width(parseInt((msg.n / msg.max) *100) + "%")
  $('#progressBar').text(parseInt((msg.n / msg.max) *100) + "%")

  var ttime = msg.expo * msg.max
  timer += msg.expo
  diff = ttime - timer
  var minutes = Math.floor(parseInt((ttime - timer) / 1000) / 60);
  var seconds = parseInt((ttime - timer) / 1000) - minutes * 60;
  $('#progressInfo').text("Time Left: " + str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2))
  if(diff < 10){
      $(".camBtn").prop("disabled",false);
      $('#progressInfo').text("")
  }
});
socket.on('cs', async function(msg){
  $("#cnScope").prop("disabled",true);
  $(".scopeBtn").prop("disabled",false);
  $("#cnScope").text("Scope Connected")
});
function cnScope() {
  $("#cnScope").prop("disabled",true);
  socket.emit('cnScope', {});
}
function solve() {
  $(".camBtn").prop("disabled",true);
  socket.emit('solve', {});
}
function cnCam() {
  $("#cnCam").prop("disabled",true);
  socket.emit('cnCam', {});
}
function slew(direction, stp) {
  var rate = $( "#slewrate" ).find(":selected").val();
  console.log(rate)
  socket.emit('slew', {dir: direction, stp: stp, rate: rate});
}
function shut() {
  var pass = $('#shutpass').val()
  socket.emit('shut', {pwd: pass});
}
function restart() {
  socket.emit('restart', {});
}
function goTo() {
  socket.emit('goTo', {name: document.getElementById('target').value});
}
function prev() {
  var exp = $( "#prevTime" ).find(":selected").val();
  socket.emit('prev', {expo: exp});
}
function prevl() {
  socket.emit('prevl', {});
}
function snap() {
  socket.emit('snap', {num: document.getElementById('num').value, expo: document.getElementById('expo').value, iso: document.getElementById('iso').value});
  $(".camBtn").prop("disabled",true);
}