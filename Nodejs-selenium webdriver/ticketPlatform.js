var https = require('https');
//var querystring = require('querystring'); 

//var url = 'https://api.slotgain.com/ticket/getJobList?filter=ticket&limit=3';
var url = {
    host: 'api.slotgain.com',
    path: '/ticket/getJobList?filter=ticket&limit=3',
    JSON: true,
    headers: {'User-Agent': 'request'}
};

https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        try {
            var data = JSON.parse(body);

            console.log(data.code);
        } catch (e) {
            console.log('Error parsing JSON!');
        }
    });
}).on('error', function(err){
      console.log("Got an error: ", err);
});
