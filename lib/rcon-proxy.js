var udpnat = require('./udp-nat');
var util = require('util');
var events = require('events');
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
var needsOptions = ["bindHost", "proxyHost", "proxyPort", "serverPassword", "authLib"];
function rconproxy(options) {
	for(i in needsOptions) {
		if(!(needsOptions[i] in options)) {
			throw new Error("Missing arguments for rconproxy: " + needsOptions[i]);
			return;
		}
	}
	proxy = this;
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
					this.emit("command", {user: authuser[0], ip: sender.address, port: sender.port}, command);
					rcon_msg = [rawcmd, options.serverPassword, command].join(" ");
					
					var buf = new Buffer(4 + rcon_msg.length);
					msg.copy(buf, 0, 0, 4);
					buf.write(rcon_msg, 4, rcon_msg.length);
					return callback(buf);
				} else {
					this.emit("badauth", {user: authuser[0], ip: sender.address, port: sender.port}, command);
					return callback(msg);
				}
			});
		} else {
			return callback(false);
		}
	});
}
util.inherits(rconproxy, events.EventEmitter);

rconproxy.prototype.listen = function(port, host) {
	this.nat.listen(port, host);
	this.emit("listening");
}
exports.createServer = function(options) {
	return new rconproxy(options);
}