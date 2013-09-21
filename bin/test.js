var rcon = require('../lib/rcon-proxy');
var options = {
	listenHost: "127.0.0.1", // What host should proxy listen on?
	listenPort: "28962", // What port should proxy listen on?
	proxyHost: "127.0.0.1", // What host should it proxy to? (server's net_ip)
	proxyPort: 28960, // What port should it proxy to? (server's net_port)
	bindHost: "127.0.0.1", // What host should proxy clients connect from?
	serverPassword: "pass", // The RCon password the server has
	authLib: new require('../auth/simple')(process.cwd() + "/bin/auth.txt")
}

var srv = rcon.createServer(options);
srv.start();
setTimeout(function() {
	process.exit();
}, 10000);