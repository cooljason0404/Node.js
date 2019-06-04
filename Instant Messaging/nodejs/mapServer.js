// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

/**定義*/
var port = 9999;

/**監聽PORT*/
server.listen(port, '0.0.0.0', () => {
	console.log('---------------');
	console.log('Server listening at port %d', port);
	console.log('Static:'+ path.join(__dirname, 'public'))
	console.log('---------------');
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
// to support JSON-encoded bodies
app.use(bodyParser.json({
	limit:'100mb', 
	extended: true}) );       
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
	limit:'100mb', 
	extended: true
}));

io.on('connection', (socket) => {
    socket.on('init', (result) => {

    });
});


/**connect list */
var connTable = [];
var userTable = [];

app.get('/init', function (req, res) {
    // init?type=(account/chat)
    var type = req.query.type;
    var ipAdress = req.connection.remoteAddress;
    if(type == 'account' || type == 'chat'){
        var have_ip = false;
        for(var key in connTable){
            if(connTable[key].ipAdress == ipAdress && connTable[key].type == type){
                have_ip = true;
                break;
            }
        }
        if(!have_ip){
            connTable.push({ipAdress: ipAdress, type: type, amount: 0});
        }
        res.send(JSON.stringify({code: 1, msg: "Connect MapServer Success"}));
    }else{
        res.send(JSON.stringify({code: 0, err: "Connect MapServer params is illegal"}));
    }
 })

app.get('/addUser', function(req, res){
    // addUser?user=&device=
    var reqUser = req.query.user;
    var reqDevice = req.query.device;
    var ipAdress = req.connection.remoteAddress;
    if(reqUser != undefined && reqDevice != undefined && ipAdress != undefined){
        var check_conn = checkConn(ipAdress, 'account');
        if(check_conn){
            // 此連線存在
            var check_user = false;
            var ukey;
            for(var key in userTable){ 
                var userId = userTable[key].userId;
                if(userId == reqUser){
                    check_user = true;
                    ukey = key;
                    break;
                }
            }
            if(check_user){
                var check_device = false;
                var data = userTable[ukey].data;
                for(var key in data){ 
                    var deviceId = data[key].deviceId;
                    if(deviceId == reqDevice){ 
                        check_device = true;
                        break;
                    }
                }
                if(check_device){
                    res.send(JSON.stringify({code: 0, err: "In User Table"}));
                }else{
                    // 此設備未註冊 表示此用戶多設備連線
                    var chatIp = assignChatIp();
                    data.push({deviceId: reqDevice, chatIp: chatIp});
                    userTable[ukey].data = data;
                    res.send(JSON.stringify({code: 1, chatIp: chatIp, msg: "addUser Success"}));
                }
            }else{
                // 此用戶未註冊 表示未有連線
                var newData = [];
                var chatIp = assignChatIp();
                newData.push({deviceId: reqDevice, chatIp: chatIp});
                userTable.push({userId: reqUser, data: newData});
                res.send(JSON.stringify({code: 1, chatIp: chatIp, msg: "addUser Success"}));
            }
        }else{
            res.send(JSON.stringify({code: 0, err: "Account Server Is Illegal"}));
        }
    }else{
        res.send(JSON.stringify({code :0, err: "Params Is Illegal"}));
    }

});

app.get('/checkIn', function(req, res){
    // checkIn?user=&device=
    var reqUser = req.query.user;
    var reqDevice = req.query.device;
    var ipAdress = req.connection.remoteAddress;
    if (reqUser != undefined && reqDevice != undefined && ipAdress != undefined) {
        var check_conn = checkConn(ipAdress, 'chat');
        if(check_conn){
            // 此連線存在
            var check_user = false;
            var ukey;
            for(var key in userTable){ 
                var userId = userTable[key].userId;
                if(userId == reqUser){
                    check_user = true;
                    ukey = key;
                    break;
                }
            }
            if(check_user){
                var check_device = false;
                var data = userTable[ukey].data;
                for(var key in data){ 
                    var deviceId = data[key].deviceId;
                    var chatIp = data[key].chatIp;
                    if(deviceId == reqDevice && chatIp == ipAdress){ 
                        check_device = true;
                        break;
                    }
                }
                if(check_device){
                    res.send(JSON.stringify({code: 1, msg: "Check In Success"}));
                }else{
                    // 此設備未註冊 表示此用戶新設備連線
                    res.send(JSON.stringify({code: 0, err: "Device Id Param is illegal"}));
                }
            }else{
                // 此用戶未註冊 表示未有連線
                res.send(JSON.stringify({code: 0, err: "User Id Param is illegal"}));
            }
        }else{
            res.send(JSON.stringify({code: 0, err: "Chat Server is illegal"}));
        }
    }else{
        res.send(JSON.stringify({code: 0, err: "Params is illegal"}));
    }
});

app.get('/search', function(req, res){
    // search?user=&device=
    var reqUser = req.query.user;
    var reqDevice = req.query.device;
    if(reqUser != undefined && reqDevice != undefined){
        var check_user = false;
        var ukey;
        for(var key in userTable){ 
            var userId = userTable[key].userId;
            if(userId == reqUser){
                check_user = true;
                ukey = key;
                break;
            }
        }
        if(check_user){
            var check_device = false;
            var data = userTable[ukey].data;
            var chatIp;
            for(var key in data){ 
                var deviceId = data[key].deviceId;
                if(deviceId == reqDevice){ 
                    check_device = true;
                    chatIp = data[key].chatIp;
                    break;
                }
            }
            if(check_device){
                res.send(JSON.stringify({code: 1, chatIp: chatIp, msg: "Search Success"}));
            }else{
                res.send(JSON.stringify({code: 0, err: "Device Id is illegal"}));
            }
        }else{
            res.send(JSON.stringify({code: 0, err: "User Id is not online or user id"}));
        }
    }else{
        res.send(JSON.stringify({code: 0, err: "Params is illegal"}));
    }
});

function assignChatIp(){
    // 分配 user 連線 chat server
    var newKey = [];
    for(var key in connTable){
        if(connTable[key].type == "chat"){
            newKey.push(key);
        }
    }
    if(newKey.length > 0){
        return connTable[newKey[0]].ipAdress;
    }else{
        return '127.0.0.1';
    }
}

function checkConn(ipAdress, type){
    var check_conn = false;
    for(var key in connTable){
        if(connTable[key].ipAdress == ipAdress && connTable[key].type == type){
            check_conn = true;
            break;
        }
    }
    return check_conn;
}