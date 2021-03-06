
/**
 * Module dependencies.
 */

var auth = require('basic-auth');
var basicAuth = require('basic-auth-connect');
var express = require('express');
var multer = require('multer');
var path = require('path');
var serve = require('serve-static');

/**
 * Locals.
 */

var app = module.exports = express();

/**
 * Accept file uploads.
 */

app.use(multer({ inMemory: true }).single('upload'));

/**
 * Echo uploaded files for testing assertions.
 */

app.post('/upload', function (req, res) {
  res.send(req.files);
});

/**
 * Echo HTTP Basic Auth for testing assertions.
 */

app.get('/auth', basicAuth('my', 'auth'), function (req, res) {
  res.send(auth(req));
});

/**
 * Echo HTTP Headers for testing assertions.
 */

app.get('/headers', function (req, res) {
  res.header('Cache-Control', 'no-cache');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.send(req.headers);
});

/**
 * Redirect to the provided URL for testing redirects and headers
 */

app.get('/redirect', function (req, res) {
  var code = Number(req.query.code) || 301;
  var url = req.query.url || '/';
  res.redirect(code, url);
});

/**
 * Simply hang up on the connection for testing interrupted page loads
 */

app.get('/do-not-respond', function(req, res) {
  res.socket.end();
});

/**
 * Serve the fixtures directory as static files.
 */

app.use(serve(path.resolve(__dirname, 'fixtures')));

/**
 * Serve the test files so they can be accessed via HTML as well.
 */

app.use('/files', serve(path.resolve(__dirname, 'files')));

/**
 * Start if not required.
 */

if (!module.parent) app.listen(7500);
