var udpnat = require('./udp-nat');
var auth = require('./simple-auth').AuthLib;
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
function rconproxy(options) {
	console.log("Starting simple q3 rcon proxy...");
	this.options = options;
	this.authlib = new auth();
	this.nat = udpnat.createServer(options, function(msg, sender) {
		if(arr_compare(msg.slice(0, 8).toJSON(), rconheader)) {
			var str = msg.toString('utf8').substr(4).trim();
			var parts = str.split(" ", 3);
			if(parts[0] != "rcon") {
				return false;
			}
			
			authuser = parts[1].indexOf(":") > -1 ? parts[1].split(":") : [parts[1],""];
			if(this.authlib.auth(authuser[0], authuser[1])) {
				console.log("User " + authuser[1] + " authenticated, sending command!");
				parts[1] = options.serverPassword;
				rcon_msg = parts.join(" ");
				
				var buf = new Buffer(4 + rcon_msg.length);
				msg.copy(buf, 0, 0, 4);
				buf.write(rcon_msg, 4, rcon_msg.length);
				return buf;
			}
			
			return msg;
		} else {
			return false;
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