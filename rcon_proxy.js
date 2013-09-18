var udpnat = require('./lib/udp-nat');
var auth = require('./lib/simple-auth').AuthLib;
var options = { 
	bindHost: "localhost",
	proxyHost: "localhost",
	proxyPort: 28961,
	server_password: "pass",
};
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
var authlib = new auth();
var nat = udpnat.createServer(options, function(msg, sender) {
		if(arr_compare(msg.slice(0, 8).toJSON(), rconheader)) {
			var str = msg.toString('utf8').substr(4).trim();
			var parts = str.split(" ", 3);
			if(parts[0] != "rcon") {
				return false;
			}
			
			authuser = parts[1].indexOf(":") > -1 ? parts[1].split(":") : [parts[1],""];
			if(authlib.auth(authuser[0], authuser[1])) {
				parts[1] = options.server_password;
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
	}).listen(28962, "localhost");