var socket = io();

function getBotData() {
  socket.on('getBot', function(msg){
    console.log(msg)
    $('#botName').val(msg.nickname)
    $('#botToken').val(msg.token)
    $('#botGuild').val(msg.guild)
  });
  socket.emit('getBot', {jwt: getCookie("jwt")});
}

function setBotData(data) {
  socket.emit('setBot', {jwt: getCookie("jwt"), data: data});
}


function getCommands() {
  socket.on('getCommands', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#comms').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.command}</td>
          <td style="vertical-align: middle;">${com.reply}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteCommand('${com.command}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getCommands', {jwt: getCookie("jwt")});
}

function addCommand(data) {
  socket.emit('addCommand', {jwt: getCookie("jwt"), data: data});
}
function deleteCommand(data) {
  socket.emit('deleteCommand', {jwt: getCookie("jwt"), data: data});
  location.reload();
}

$('#addCommand').click(function(e) {
    addCommand({command: $('#commandName').val(), reply: $('#commandReply').val()})
    location.reload();
})

function getRoles() {
  socket.on('getRoles', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#roles').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.name}</td>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteRole('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getRoles', {jwt: getCookie("jwt")});
}

function addRole(data) {
  socket.emit('addRole', {jwt: getCookie("jwt"), data: data});
}
$('#addRole').click(function(e) {
  addRole({name: $('#roleName').val(), alias: $('#roleAlias').val()})
  location.reload();
})
function deleteRole(data) {
  socket.emit('deleteRole', {jwt: getCookie("jwt"), data: data});
  location.reload();
}


function getSounds() {
  socket.on('getSounds', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#sounds').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td style="vertical-align: middle;">${com.url}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteSound('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getSounds', {jwt: getCookie("jwt")});
}

function addSound(data) {
  socket.emit('addSound', {jwt: getCookie("jwt"), data: data});
}
$('#addSound').click(function(e) {
  addSound({alias: $('#soundAlias').val(), url: $('#soundURL').val()})
  location.reload();
})
function deleteSound(data) {
  socket.emit('deleteSound', {jwt: getCookie("jwt"), data: data});
  location.reload();
}




function getChannels() {
  socket.on('getChannels', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      $('#channels').append(
        `
        <tr>
          <td style="vertical-align: middle;">${com.alias}</td>
          <td class="text-right">
              <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteChannel('${com.alias}')" class="btn btn-secondary mb-1 del-btn com-del">
                      <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
              </button>
          </td>
        </tr>
        `
      )
      i++
    });
  });
  socket.emit('getChannels', {jwt: getCookie("jwt")});
}

function addChannel(data) {
  socket.emit('addChannel', {jwt: getCookie("jwt"), data: data});
}
$('#addChannel').click(function(e) {
  addChannel({alias: $('#channelAlias').val()})
  location.reload();
})
function deleteChannel(data) {
  socket.emit('deleteChannel', {jwt: getCookie("jwt"), data: data});
  location.reload();
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
  return parts.pop().split(";").shift();
}


function getMBs() {
  socket.on('getMBs', function(msg){
    console.log(msg)
    var i = 0
    msg.forEach(com => {
      console.log(com.id, com.enabled)
      if(com.enabled){
        $('#MBs').append(
          `
          <tr>
            <td style="vertical-align: middle;">${com.id}</td>
            <td style="vertical-align: middle;">
            <input type="checkbox" class="js-switcher mb-enable" checked onchange="manMB(this.checked, '${com.id}')" />
            </td>
            <td class="text-right">
                <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteMB('${com.id}')" class="btn btn-secondary mb-1 del-btn com-del">
                        <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
                </button>
            </td>
          </tr>
          `
        )
      }
      else{
        $('#MBs').append(
          `
          <tr>
            <td style="vertical-align: middle;">${com.id}</td>
            <td style="vertical-align: middle;">
            <input type="checkbox" class="js-switcher mb-enable" onchange="manMB(this.checked, '${com.id}')" />
            </td>
            <td class="text-right">
                <button style="width: 30px;height: 30px;position: relative;margin-right: 20px;" type="button" onClick="deleteMB('${com.id}')" class="btn btn-secondary mb-1 del-btn com-del">
                        <i class="fas fa-trash-alt" style="position: absolute;top: 6px;left: 7px;"></i>
                </button>
            </td>
          </tr>
          `
        )
      }
      
      i++
    });
    
    
  var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switcher'));

  elems.forEach(function(html) {
    var switchery = new Switchery(html);
  });

  });
  socket.emit('getMBs', {jwt: getCookie("jwt")});
}
function manMB(state, id) {
  if(state) {
    console.log("START")
    socket.emit('startMB', {jwt: getCookie("jwt"), data: id});
  }
  else{
    console.log("STOP")
    socket.emit('stopMB', {jwt: getCookie("jwt"), data: id});
  } 
}

function addMB(data) {
  socket.emit('addMB', {jwt: getCookie("jwt"), data: data});
}
$('#addMB').click(function(e) {
  addMB({
      "id": $('#MBname').val(),
      "token": $('#MBtoken').val(),
      "vc": $('#MBvcs').val(),
      "tc": $('#MBtcs').val(),
      "playlist": "default",
      "queue": [],
      "playing": {},
      "enabled": $("#MBenable").get(0).checked
  })
  location.reload();
})
function deleteMB(data) {
  socket.emit('deleteMB', {jwt: getCookie("jwt"), data: data});
  location.reload();
}

socket.on('mbdebug', function(msg){
 console.log("MB Debug: " + msg)
})

function getCHs(el1, el2) {
  socket.on('getCHs', function(msg){
    if(el1){
      msg.vcs.forEach(vc => {
        $(el1).append(
          `<option value="${vc.id}">${vc.name}</option>`
        )
      });
    }
    if(el2){
      msg.tcs.forEach(tc => {
        $(el2).append(
          `<option value="${tc.id}">${tc.name}</option>`
        )
      });
    }
  })
  socket.emit('getCHs', {jwt: getCookie("jwt")});
}

function getBattleSettings() {
  socket.on('getBattleSettings', function(msg){

    $('#enabled').prop('checked', msg.enabled);
    $('#allowbuy').prop('checked', msg.allowBuy);
    $('#allowsell').prop('checked', msg.allowSell);
    $('#displayarmory').prop('checked', msg.displayArmory);
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
      elems.forEach(function(html) {
      var switchery = new Switchery(html);
    });
    $('#droprate').val(msg.noDropRate)
    $('#duncoins').val(msg.dungeonCoins)
    $('#batcoins').val(msg.battleCoins)
    $('#maxlvl').val(msg.maxLvlDif)
    $('#basehp').val(msg.baseHP)
    $('#baseatk').val(msg.baseATK)
    $('#baseluck').val(msg.baseLuck)
    $('#basebp').val(msg.baseBP)
    if(msg.textChannel != "")
      $('#textch').val(msg.textChannel);
  })
  socket.emit('getBattleSettings', {jwt: getCookie("jwt")});
}

