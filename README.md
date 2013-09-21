q3rcon-bridge
=============

Simple web &amp; rcon-based bridge that enabled adminisistration for q3 rcon-enabled servers without exposing master password


### How to run:
```node
var rcon = require('q3rcon-bridge');
var options = {
	listenHost: "127.0.0.1", // What host should proxy listen on?
	listenPort: "28961", // What port should proxy listen on?
	proxyHost: "127.0.0.1", // What host should it proxy to? (server's net_ip)
	proxyPort: 28960, // What port should it proxy to? (server's net_port)
	bindHost: "127.0.0.1", // What host should proxy clients connect from?
	serverPassword: "rcon_password", // The RCon password the server has
	authLib: new require('q3rcon-bridge/auth/simple')() // Which auth library to use, simple uses auth.txt
}

var srv = rcon.createServer(options);
srv.start();
```
