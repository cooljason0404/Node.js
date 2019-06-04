//引入 http socket.io redis
var app = require('http').createServer()
var io = require('socket.io')(app);
var  redis = require('redis');


var redisclient, redisDt;
/**建立 Redis Client*/
function createRedis(){
    //log 0:online@127.0.0.1:6379
    //cache 1:online@127.0.0.1:6379
    var RDS_PORT = 6379,        //Port 3311
        RDS_HOST = '127.0.0.1',    //Redis Server IP
        RDS_PWD = 'online', //slotgain ZYJbDv76Gjfvv5DG4BSqMXsF
        RDS_OPTS = {auth_pass:RDS_PWD};          //設置項
    try{
        redisclient = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
        initRedisEventHandle();
    }catch(e){
            
    }
}
/**建立 Redis Event*/
function initRedisEventHandle(){
    redisclient.auth(RDS_PWD,function(){
        console.log('Redis connection Success');
    });
    redisclient.on('connect',function(){
        console.log('connect');    
    });
    redisclient.lrange('bufferLogger', 0, -1,function(err, redisdata){
        //console.log('err: ', err, ' data: ', redisdata, ' data type: ', typeof redisdata);
        redisDt = redisdata;
    });
    /*
    redisclient.subscribe('bufferPubSub', function(error, count){
        if(error){
            throw new Error(error);
        }else{
            console.log('subscribe sucess');
        }
    });*/
}
createRedis();//Redis 初始化

var msg = [],       // save data array
    discontime = 0, // disconnect time
    limNum = 20,    // save data limit
    num = 0;
var PORT = 9999;/**定義PORT*/
app.listen(PORT);/**監聽PORT*/
/**建立WebSocket Connection */
io.on('connection', function(socket){
    socket.emit('newConnect', "connect success");
    socket.on('newConnect', function(data){
        if(msg.length > 0 && num == 0){
            console.log(msg);
            msg.forEach(function(val, index){
                if(val.time > disconnect){
                    socket.emit('newRedis', JSON.stringify(val.data));
                }
            });          
        }else if(msg.length > 0 && num > 0){
            socket.emit('reloadajax', "");
        }
        msg.length = 0; // clear array
        disconnect = 0; // connect state
    });
    socket.on('message', function(data){
        console.log(data.message);
    });
    /*
    setInterval(function(){
        redisclient.lrange('bufferLogger', 0, -1,function(err, redisdata){
            redisdata.forEach(function(val, key){
                console.log('%s is %s', key, val);
                msg.push(val);
            });;
            //console.log(typeof(redisdata));
        });    
    },2000);*/


    // 收到發布Redis Websocket傳送client
    redisclient.on('message', function(channel, message) {
        //console.log("Message '" + message + "' on channel '" + channel + "' arrived!");
		if(disconnect == 0){
			socket.emit('redis', JSON.stringify(message));
		}else{
            var obj = { time: Date.now(), data: JSON.stringify(message)};
            //console.log(obj);
            if(msg.length < limNum){
                msg.push(obj);
            }else{
                num++;
            }
		}
	});

    socket.on('disconnect', function(){ 
        console.log('socket disconnect');
        discontime = Date.now();
        console.log(discontime);
    });
});

