var http = require('http');
var deploy = require('./deploy');


http.Server(function(req, res) {
  if (req.url.match(/d23dd36-N634Ntre-q354nq6-56qn4356/))
    deploy();

  res.end();
}).listen(8889);
