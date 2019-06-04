//引入websocket
const  websocket  = require('ws');
const  redis = require('redis');

//log 0:online@127.0.0.1:6379
//cache 1:online@127.0.0.1:6379
var RDS_PORT = 6379,        //端口号 3311
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_PWD = 'online', //slotgain ZYJbDv76Gjfvv5DG4BSqMXsF 24 online
    RDS_OPTS = {auth_pass:RDS_PWD}          //设置项

var redisclient;
function createRedis(){
    try{
        redisclient = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
        initRedisEventHandle();
    }catch(e){
        
    }
}
function initRedisEventHandle(){
    redisclient.auth(RDS_PWD,function(){
        console.log('Redis connection Success');
    });
    redisclient.on('connect',function(){
        console.log('connect');    
    });
    redisclient.subscribe('bufferPubSub', function(error, count){
        if(error){
            throw new Error(error);
        }else{
            console.log('subscribe sucess');
        }
    });
}

/**
 * 建立server 並監聽Port 9999
 */
// 產生websocketServer
const webSocketServer = new websocket.Server({
    port : 9999
});
var msg = [];
//當使用者連入時 觸發此事件
webSocketServer.on('connection', function(wsocket){
    wsocket.on('open',function(){
        console.log("open");      
    });
    wsocket.on('message',function(message){
        //當websocket server收到訊息時 觸發此事件
        console.log(message);
        if(message == "連線完成！" && msg.length > 0){
            wsocket.send(JSON.stringify(msg));
        }
        /*
        redisclient.lrange('bufferLogger', 0, -1,function(err, redisdata){
            //console.log('err: ', err, ' data: ', redisdata, ' data type: ', typeof redisdata);
            wsocket.send(JSON.stringify(redisdata));
        });
        */
    });
    wsocket.on('close',function(){
        //當使用者socket連線中斷時 例如：關閉瀏覽器 觸發此事件
        console.log('Close');
    });

    redisclient.on('message', function(channel, message) {
        //console.log("Message '" + message + "' on channel '" + channel + "' arrived!");
        //console.log("Connection =" + wsocket.readyState);
        if(wsocket.readyState === 1){
            msg.length = 0;
            wsocket.send(JSON.stringify(message));
        }else{
            msg.push(message);
        }
    });
});
createRedis();//Redis 初始化