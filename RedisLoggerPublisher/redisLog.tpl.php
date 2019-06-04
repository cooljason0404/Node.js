<?php include($TMPL_PATH.'/common/head.tpl.php');?>
<script src="<?=URL_STATIC?>/js/jquery-ui.js"></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js'></script>
<script type="text/javascript">
var serverip = "https://admin.slotgain.com/";//"http://admin.grouphelper.com/";
var socket;
var userinfo = {index: <?=$TMPL_VAR['userinfo']['index']?>, renewstate: true, limit: <?=$TMPL_VAR['userinfo']['limit']?>};
jQuery(function($){
    var $aelement = $(window.parent.document).find("a");
    $aelement.each(function(i,item){  
        var classid = $(item).attr("class");
        if(classid == "otabActive"){
            alert($(this).attr("id"));
            $(this).on('click',function(){
                var scrollHeight = $("#messagelist").prop("scrollHeight");
                $("#messagelist").scrollTop(scrollHeight);
            });
        }
    });  
    $("#autoRenew").change(function(){
        if($("#autoRenew").prop("checked")){
            userinfo.renewstate = true;
            socket.emit('getRedisData', userinfo);
        }else{
            userinfo.renewstate = false;
        }
    });
    $("#btnClear").click(function(){
        $("#setlog").empty();
    });
    $("#btnTest").click(function(){
        $.ajax({
            type:"POST",
            url:"/<?=MODULE_NAME?>/add?method=ajax",
            data:{data: 0},
            dataType:'json',
        });
    });
});
function createWebSocket(){
    socket = io.connect(serverip);
    initWebSocketEvent();
}
function initWebSocketEvent(){
    socket.on('connect', function(){
        socket.on('newConnect', function(data){
            console.log('newConnect =>', userinfo.index);
            socket.emit('getRedisData', userinfo);// inint
        });
        socket.on('sync', function(data){
            console.log('sync',userinfo.index);
            socket.emit('getRedisData', userinfo);
        });
        socket.on('redisData', function(data){
            if(data.index > 0){
                var diffindex = data.index - userinfo.index;
                if(userinfo.renewstate == true){
                    for(var key in data.data){
                        printlog(data.data[key]); 
                    }
                    userinfo.index = data.index;
                    diffindex = 0;
                }
            }else{
                diffindex = 0;
            }
            $("#renewRows").empty();
            $("#renewRows").append('等待更新 ' + diffindex + ' 筆');
            console.log('redisData => %s', userinfo.index);  
        });
    });
}
function printlog(data){
    var $dataeffect = $('<tr><td style="border:1px solid;padding: 5px;"><pre>'+ data +'</pre></td></tr>');
    $("#setlog").append($dataeffect);
    $dataeffect.effect("highlight", {}, 500);
    var scrollHeight = $("#messagelist").prop("scrollHeight");
    while(scrollHeight > 5000){
        $("#setlog").find("tr:first").remove(); 
        scrollHeight = $("#messagelist").prop("scrollHeight");
    }
    $("#messagelist").scrollTop(scrollHeight);
}
createWebSocket();
</script>
</head>
<body>
<div id="messagelist" style="overflow:auto;height: 95%;">
    <div>
        <table id="setlog" name="setlog" style="border:1px solid;text-align: left;width: 80%;"></table>
    </div>
</div>
<div id="toolbar" class="text_left" style="margin: 5px 0;">
    <input type="checkbox" id="autoRenew" name="autoRenew" checked="checked"/>自動更新
    <input type="button" value="清空" class="btn" id="btnClear" />
    <label id="renewRows" name="renewRows"></label>
    <input type="button" value="TEST" class="btn" id="btnTest" />
</div>
</body>
</html>