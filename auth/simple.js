var fs = require('fs');
function SimpleAuthLib(fileName) {
	var authl = this;
	this.filename = fileName || process.cwd() + "/auth.txt";
	this.users = [];
}
SimpleAuthLib.prototype.fetchUsers = function() {
	var authl = this;
	this.users = [];
	fs.readFile(this.filename, function(err, data) {
		if(err) throw err;
		var arr = data.toString().split("\n");
		for(i in arr) {
			arr[i] = arr[i].trim();
			str = arr[i].indexOf(":") > -1 ? arr[i].split(":") : [arr[i],"", "|"];
			authl.users.push({
				username: str[0],
				password: str[1],
				servers: str[2].indexOf("|") > -1 ? str[2].split("|") : [str[2]]
			});
		}
	});
};
SimpleAuthLib.prototype.auth = function(username, password, server, callback) {
	for(i in this.users) {
		if(this.users[i].username == username &&
			 this.users[i].password == password &&
			 this.users[i].servers.indexOf(server) != -1) {
				callback(true);
				return;
		}
	}
	callback(false);
}
module.exports = SimpleAuthLib;
