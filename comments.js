// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a server
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  var ext = path.extname(filename);
  var contentType = 'text/html';
  if (ext === '.css') {
    contentType = 'text/css';
  }
  if (ext === '.js') {
    contentType = 'text/javascript';
  }
  if (ext === '.png') {
    contentType = 'image/png';
  }
  if (ext === '.jpg') {
    contentType = 'image/jpg';
  }
  if (ext === '.ico') {
    contentType = 'image/ico';
  }
  if (ext === '.json') {
    contentType = 'application/json';
  }
  if (ext === '.html') {
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
      return res.end();
    });
  }
}).listen(8080);

// Create a server for comments
app.get('/comments', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

app.post('/comments', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(comments));
    });
  });
});

app.listen(3000, function() {
  console.log('Server is running on port 3000');
});