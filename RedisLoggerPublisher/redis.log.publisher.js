//引入 http socket.io redis
var app = require('http').createServer()
var redis = require('redis');

var dataSize = 1000;/**定義redisData Sava量*/
var redisDataList = []; /**定義SAVE redis data list*/
var totalindex = 0;

var PORT = 9999;/**定義PORT*/
var RDS_PORT = 6379,    
	RDS_HOST = '127.0.0.1',
	RDS_PWD = "ZYJbDv76Gjfvv5DG4BSqMXsF";

var io = require('socket.io')(app);	
io.on('connection', function(socket){
    socket.emit('newConnect', "connect success");
    socket.on('getRedisData', function(result){
        console.log('getRedisData => %s', result);
        socket.emit('redisData', outputdata(result));
    });
    socket.on('disconnect', function(){
        console.log('disconnect => %s',socket);
    });
})
function outputdata(userinfo){
    if(userinfo.renewstate == false){
        //只傳目前Server筆數
        return {index: totalindex, data: ""};
    }else{
        var outputdata = [];
        var limit = userinfo.limit;
        var startindex = userinfo.index;
        var endindex = 0;
        var totalSize = redisDataList.length;
        if(limit == 0) limit = totalSize;
        if(startindex == 0){
            //初始化 全部Output
            if(totalSize < 50){
                for(var key in redisDataList){ 
                    outputdata.push(redisDataList[key].redisdata);
                }  
            }else{
                // 取後50筆
                for(var i=totalSize-50; i<totalSize; i++){
                    outputdata.push(redisDataList[i].redisdata);
                }  
            }
            endindex = redisDataList[totalSize-1].index;
        }else{
            for(var key in redisDataList){
                if(outputdata.length == limit)  break;
                var rdindex = redisDataList[key].index;
                if(rdindex > startindex){
                    outputdata.push(redisDataList[key].redisdata);
                    endindex = rdindex;
                }
            }
        }
        return {index: endindex, data: JSON.stringify(outputdata)};
    }  
}

/**建立 Redis Client*/
var redisclient;
function createRedis(){
    //log 0:online@127.0.0.1:6379
    //cache 1:online@127.0.0.1:6379
    //slotgain ZYJbDv76Gjfvv5DG4BSqMXsF
    try{
        redisclient = redis.createClient(RDS_PORT, RDS_HOST, {
            auth_pass: RDS_PWD,
            retry_strategy: function (options) {
                if (options.error.code === 'ECONNREFUSED') { 
                    console.log('Redis連線被拒');
                }
                if (options.times_connected > 10) {
                    console.log('Redis重新連線超過10次');      
                }
                // reconnect after 
                return Math.max(options.attempt * 100, 3000);
            }
        });
        initRedisEventHandle();
    }catch(e){
        console.log(e);
    }
}
/**建立 Redis Event*/
function initRedisEventHandle(){
    redisclient.on('connect',function(){
        console.log('Redis連線成功');    
    });
    redisclient.lrange('bufferLogger', 0, -1,function(err, data){
        if(redisDataList.length == 0){
            for(var key in data){
                var obj = {index: key, redisdata: data[key]};
                redisDataList.push(obj);
                totalindex = key;
            }
            console.log('Redis第一次撈取資料');
        }
    });
    //固定時間向Redis Server撈取資料
    setInterval(function(){
        redisclient.lrange('bufferLogger', 0, -1,function(err, data){
            var booldata = false;
            for(var dkey in data){
                var samedata = false;
                for(var rkey in redisDataList){
                    var rdata = redisDataList[rkey].redisdata;
                    if(data[dkey] == rdata){
                        samedata = true;
                        break;
                    }
                }
                if(!samedata){
                    booldata = true;
                    totalindex++;
                    var obj = {index: totalindex, redisdata: data[dkey]};
                    redisDataList.push(obj);
                    //console.log('add redis data:%s', data[dkey]);
                    var difSize = redisDataList.length - dataSize;
                    while(difSize > 0){
                        var temp = redisDataList.shift();
                        difSize--;
                    }
                }
            }
            if(booldata == true)    io.sockets.emit('sync', "");
        });
    },500);
}

createRedis();//Redis 初始化;
app.listen(PORT);/**監聽PORT*/