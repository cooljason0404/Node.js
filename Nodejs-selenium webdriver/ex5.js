var request = require('request');

var url = 'https://api.slotgain.com/ticket/getJobList?filter=ticket&limit=3';

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
      console.log(JSON.stringify(data.code));
    }
});