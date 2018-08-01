var express = require('express')
var https = require('https');
var app = express();
var port = process.env.PORT || 8000;

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('public/index.html');
});

app.get('/weather', function(req, res) {
  var darkskyURL = "https://api.darksky.net/forecast/7fd171ad4210ae3f291089be679e5658/" + req.query.loc;

  function sendResponse(data) {
    res.send(data);
  }

  https.get(darkskyURL, function(res) {
    var data = '';

  // A chunk of data has been recieved.
  res.on('data', function(chunk) {
    data += chunk;
  });

  // whole response received
  res.on('end', function() {
    sendResponse(data);
  });

  }).on("error", function(err) {
    console.log("Error: " + err.message);
  });
  
});

app.listen(port, function() {
  console.log("running on port: ", port);
});
