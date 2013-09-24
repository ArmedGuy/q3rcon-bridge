var fs = require('fs');
function SimpleAuthLib(fileName) {
	authl = this;
	this.filename = fileName || process.cwd() + "/auth.txt";
	this.users = new Array();
	fs.readFile(this.filename, function(err, data) {
		if(err) throw err;
		var arr = data.toString().split("\n");
		for(i in arr) {
			arr[i] = arr[i].trim();
			str = arr[i].indexOf(":") > -1 ? arr[i].split(":") : [arr[i],""];
			authl.users.push({username: str[0], password: str[1]});
		}
	});
}
SimpleAuthLib.prototype.auth = function(username, password, callback) {
	for(i in this.users) {
		if(this.users[i].username == username && this.users[i].password == password) {
			return callback(true);
		}
	}
	return callback(false);
}
module.exports = SimpleAuthLib;