<html>
<head>
<!--載入jQuery-->
<script   src="https://code.jquery.com/jquery-1.12.4.min.js"   integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="   crossorigin="anonymous"></script>
<script type="text/javascript"> 
jQuery(function($){
    $("#clearBtn").click(function(){
        $("#message").empty();
        $("#message").append('<tr><td>Redis</td></tr>');
    });
});

var websocket;//websocket实例
var lockReconnect = false;//避免重复连接
var wsUrl = "ws://192.168.123.24:9998";
function createWebSocket(url){
    try{
        websocket = new WebSocket(url);
        initEventHandle();
    }catch(e){
        reconnect(url);
    }
}
 
function initEventHandle(){
    websocket.onclose = function(evnt){
        reconnect(wsUrl);
    };
    websocket.onerror = function(evnt){
        reconnect(wsUrl);
    };
    websocket.onopen = function(evnt){
        websocket.send('連線完成！');
        heartCheck.reset().start();
    };
    websocket.onmessage = function(evnt){
        alert(typeof(evnt.data));
        if(typeof(evnt.data)=="string"){
            $('#message').append('<tr><td style="border:1px solid;padding: 5px;"><pre>' + JSON.parse(evnt.data) + '</pre></td></tr>');
        }else{
            $.each(evnt.data,function(ekey, evalue){
                $('#message').append('<tr><td style="border:1px solid;padding: 5px;"><pre>' + evalue + '</pre></td></tr>');
            });
        }
        heartCheck.reset().start();
    }
}
 function reconnect(url) {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function(){
        createWebSocket(url);
        lockReconnect = false;
    }, 2000);
}
 
//心跳检测
var heartCheck = {
    timeout: 60000,//60秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            websocket.send("HeartBeat");
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                websocket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}

createWebSocket(wsUrl);//初始化websocket

function sendMessage() {
    message = $('#userInput').val();
    //傳送訊息給Server
    websocket.send(message);
    $('#userInput').val('');
}
</script>
</head>
<body>
<div id="toolbar">
    <input type="text" id="userInput">
    <button id="sendButton" onClick="sendMessage()">Send</button>
    <input type="checkbox" id="autoRenew" name="autoRenew" />自動更新
    <button id="clearBtn" name="clearBtn">清除</button>
</div>
<div>
    <table id="message">
        <tr><td>Redis</td></tr>    
    </table>
</div>
</body>
</html>

