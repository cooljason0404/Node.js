// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var server = require('http').createServer(app);

/**定義*/
var port = 9997;

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

app.post('', (req, res) => {

});

function initMapServer(){
    connMapServer('/init?type=chat', (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
            console.log('Connect end');
        });
    });
}

function checkInUser(user, device){
    connMapServer('/checkIn?user=&device=', (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
            console.log('Connect end');
        });
    });
}

function searchUser(user, device){
    connMapServer('/search?user=&device=', (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
        res.on('end', () => {
            console.log('Connect end');
        });
    });
}


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

