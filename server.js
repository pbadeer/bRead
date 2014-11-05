var connect = require('connect');
var serveStatic = require('serve-static');
var port = 8080;

connect().use(serveStatic(__dirname)).listen(port);

console.log('listening on http://localhost:' + port);