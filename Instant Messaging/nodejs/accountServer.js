// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var http = require('http');
var server = http.createServer(app); 
var mysql  = require('mysql');
 
/**定義*/
var port = 9998;
var mysql_conn = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '123456',       
  port: '3306',                   
  database: 'test' 
}); 

//init
mysql_conn.connect();
/**監聽PORT*/
server.listen(port, '0.0.0.0', () => {
	console.log('---------------');
	console.log('Server listening at port %d', port);
	console.log('Static:'+ path.join(__dirname, 'public'))
    console.log('---------------');
    initMapServer();
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

app.post('/login', (req, res) => {
    var account = req.body.account | null;
    var sercet = req.body.password | null;
    if(account != null && sercet != null){
        // todo db server verfiy
        res.send(JSON.stringify({code:1,msg:"Login success !"}));
    }else{
        res.send(JSON.stringify({code:0,err:"Login fail !"}));
    }
});

app.post('/register', (req, res) => {
    
});

app.post('/reviseAccount', (req, res) => {
    
});

app.post('/addFriend', (req, res) => {
    
});

app.post('/getFriendList', (req, res) => {
    
});

socket = io.connect(serverip);





function connMapServer(path, callback){
    var mapServerIp = '127.0.0.1';
    var mapServerPort = 9999;
    const options = {
        host: mapServerIp,
        port: mapServerPort,
        path: path,
        method: 'GET',
    };
    const req = http.request(options, callback);
    req.on('error', (e) => {
        console.error(`Error Problem: ${e.message}`);
    });
    req.end();
}

function initMapServer(){
    connMapServer('/init?type=account', (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
            console.log('Connect end');
        });
    });
}

function addUser(){
    connMapServer('/addUser?user=&device=', (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
            console.log('Connect end');
        });
    });
}







