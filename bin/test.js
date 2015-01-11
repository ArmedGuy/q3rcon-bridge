var rcon = require('../lib/rcon-proxy');
var dgram = require('dgram');
var alib = require('../auth/simple');
var simple_auth = new alib(process.cwd() + "/bin/auth.txt");
var options = {
	listenHost: "127.0.0.1",
	listenPort: 28962,
	bindHost: "127.0.0.1",
	servers: {
		"srv1": {
			host: "127.0.0.1",
			port: 28960,
			password: "pass"
		}
	},
	authLib: simple_auth
}

var srv = rcon.createServer(options);
srv.on("command", function(auth, command) {
	console.log(auth.user + " sent command: " + command);
});
srv.on("badauth", function(auth, command) {
	console.log(auth.user + " failed to authenticate!");
});
srv.listen(28962, "127.0.0.1");
setTimeout(function() {
	var goodAuthMessage = new Buffer("\xFF\xFF\xFF\xFFrcon test:test status", "ascii");
	var badAuthMessage = new Buffer("\xFF\xFF\xFF\xFFrcon test:badpassword status", "ascii");
	var client = dgram.createSocket("udp4");

	console.log("Sending good payload!");
	client.send(goodAuthMessage, 0, goodAuthMessage.length, 28962, "localhost", function(err, bytes) {
	  console.log("Good payload sent!");

	  console.log("Sending bad payload!");
	  client.send(badAuthMessage, 0, badAuthMessage.length, 28962, "localhost", function(err, bytes) {
		  console.log("Bad payload sent!");

		  client.close();
		  setTimeout(function() {
			process.exit();
		  }, 3000);
		});
	});
}, 1000);
