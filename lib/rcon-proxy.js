var udpnat = require('./udp-nat');
function arr_compare(arr1, arr2) {
	if(arr1.length != arr2.length) {
		return false;
	}
	for(i in arr1) {
		if(arr1[i] != arr2[i]) {
			return false;
		}
	}
	return true;
}
var rconheader = [0xFF, 0xFF, 0xFF, 0xFF, "r".charCodeAt(0), "c".charCodeAt(0), "o".charCodeAt(0), "n".charCodeAt(0)];
var needsOptions = ["listenHost", "listenPort", "bindHost", "proxyHost", "proxyPort", "serverPassword", "authLib"];
function rconproxy(options) {
	for(i in needsOptions) {
		if(!(needsOptions[i] in options)) {
			console.log("Missing option " + needsOptions[i] + ", aborting!");
			return;
		}
	}
	proxy = this;
	console.log("Starting simple q3 rcon proxy...");
	this.options = options;
	this.authlib = options.authLib;
	this.nat = udpnat.createServer(options, function(msg, sender, callback) {
		if(arr_compare(msg.slice(0, 8).toJSON(), rconheader)) {
		
			var str = msg.toString('utf8').substr(4).trim();
			var parts = str.split(" ");
			rawcmd = parts.shift();
			password = parts.shift();
			command = parts.join(" ").trim();
			if(command.toLowerCase().indexOf("rcon_password") > -1) {
				return callback(false);
			}
			if(rawcmd != "rcon") {
				return callback(false);
			}
			
			authuser = password.indexOf(":") > -1 ? password.split(":") : [password,""];
			proxy.authlib.auth(authuser[0], authuser[1], function(loggedIn) {
				if(loggedIn) {
					console.log("User " + authuser[0] + "(" + sender.address + ":" + sender.port + ") authenticated, sending command \"" + command + "\"");
					rcon_msg = [rawcmd, options.serverPassword, command].join(" ");
					
					var buf = new Buffer(4 + rcon_msg.length);
					msg.copy(buf, 0, 0, 4);
					buf.write(rcon_msg, 4, rcon_msg.length);
					return callback(buf);
				} else {
					console.log("User " + authuser[0] + "(" + sender.address + ":" + sender.port + ") not authenticated! Sent " + command);
					return callback(msg);
				}
			});
		} else {
			return callback(false);
		}
	});
}
rconproxy.prototype.start = function() {
	this.nat.listen(this.options.listenPort, this.options.listenHost);
	console.log("Now accepting connections!");
}
exports.createServer = function(options) {
	return new rconproxy(options);
}