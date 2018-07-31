var express = require('express')
var https = require('https');
var app = express();
var port = process.env.PORT || 8000;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('public/index.html');
});

app.get('/weather', function(req, res) {
  console.log(req.query.lat);
  console.log(req.query.lon);
  var darkskyURL = "https://api.darksky.net/forecast/7fd171ad4210ae3f291089be679e5658/" + req.query.lat + "," + req.query.lon;

  function sendResponse(data) {
    res.send(data);
  }

  https.get(darkskyURL, function(res) {
    var data = '';

    // A chunk of data has been recieved.
    res.on('data', function(chunk) {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on('end', function() {
      // console.log(data);
      // console.log(JSON.parse(data).explanation);
      sendResponse(data);
    });

  }).on("error", function(err) {
    console.log("Error: " + err.message);
  });

  // res.send('Waiting for response from server');
});

app.listen(port, function() {
  console.log("running on port: ", port);
});
