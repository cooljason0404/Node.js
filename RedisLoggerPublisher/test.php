<html>
<head>
<!--載入jQuery-->
<script   src="https://code.jquery.com/jquery-1.12.4.min.js"   integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="   crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>
<script>
var serverip = "<?=$_SERVER["SERVER_ADDR"]?>"
var port = "9999";
var socket, reconnect=0;
var userinfo = {id: -1, rows: 0};
jQuery(function($){
    $("#clearBtn").click(function(){
        $("#message").empty();
        $("#message").append('<tr><td>Redis</td></tr>');
    });
    $("#autoRenew").change(function(){
        if($("#autoRenew").prop("checked") == true){
            createWebSocket();
        }else{
            reconnect = 1;
            socket.emit('discon', userinfo.id);
            socket.disconnect();
        }
    });
});
function createWebSocket(){
    socket = io.connect('http://'+serverip+':'+port);
    initWebSocketEvent();
}
function initWebSocketEvent(){
    socket.on('connect', function(){
        socket.on('newConnect', function(data){
            if(userinfo.id == -1){
                socket.emit('newUser', "");
            }else{
                socket.emit('oldUser', userinfo.id);
            }
            console.log(userinfo);
        });
        socket.on('userid', function(data){
            if(isNaN(data)) data=parseInt(date);
            console.log('userid %s connect', data);
            userinfo.id = data;
        });
        socket.emit('getData', userinfo);

        socket.on('redisData', function(data){
            printlog(data);
        });
    });
}
function printlog(data){
    $("#setlog").append('<tr><td style="border:1px solid;padding: 5px;"><pre>'+ JSON.parse(data) +'</pre></td></tr>');
}
function sendMessage(){
    var message = $('#userInput').val();
    socket.emit('message', {message});//傳送訊息給Server
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