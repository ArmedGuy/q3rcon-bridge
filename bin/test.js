var rcon = require('../lib/rcon-proxy');
var dgram = require('dgram');
alib = require('../auth/simple');
simple_auth = new alib(process.cwd() + "/bin/auth.txt");
var options = {
	proxyHost: "127.0.0.1", // What host should it proxy to? (server's net_ip)
	proxyPort: 28960, // What port should it proxy to? (server's net_port)
	bindHost: "127.0.0.1", // What host should proxy clients connect from?
	serverPassword: "pass", // The RCon password the server has
	authLib: simple_auth
}

var srv = rcon.createServer(options);
srv.listen(28962, "127.0.0.1");
setTimeout(function() {
	var message = new Buffer("\xFF\xFF\xFF\xFFrcon test:test status", "ascii");
	console.log("Test: sending test udp payload!");
	console.log(message);
	var client = dgram.createSocket("udp4");
	client.send(message, 0, message.length, 28962, "localhost", function(err, bytes) {
	  console.log("Payload sent!");
	  client.close();
	  setTimeout(function() {
		process.exit();
	  }, 3000);
	});
}, 1000);