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
var needsOptions = ["bindHost", "servers", "listenHost", "listenPort", "authLib"];
function rconproxy(options) {
	for(i in needsOptions) {
		if(!(needsOptions[i] in options)) {
			throw new Error("Missing arguments for rconproxy: " + needsOptions[i]);
			return;
		}
	}
	var $proxy = this;
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
			var userServer = password.indexOf("/") > -1 ? password.split("/") : 0;
			if(!(userServer[1] in this.options.servers)) {
				return callback(false);
			}
			var authuser = userServer[0].indexOf(":") > -1 ? userServer[0].split(":") : [userServer[0],""];
			$proxy.authlib.auth(authuser[0], authuser[1], userServer[1], function(loggedIn) {
				if(loggedIn) {
					$proxy.emit("command", {user: authuser[0], ip: sender.address, port: sender.port}, userServer[1], command);
					rcon_msg = [rawcmd, options.servers[userServer[1]].password, command].join(" ");

					var buf = new Buffer(4 + rcon_msg.length);
					msg.copy(buf, 0, 0, 4);
					buf.write(rcon_msg, 4, rcon_msg.length);
					return callback(buf, this.options.servers[userServer[1]]);
				} else {
					$proxy.emit("badauth", {user: authuser[0], ip: sender.address, port: sender.port}, userServer[1], command);
					return callback(msg, options.servers[userServer[1]]);
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
