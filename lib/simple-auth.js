var fs = require('fs');
function AuthLib() {
	authl = this;
	this.users = new Array();
	fs.readFile(process.cwd() + "/auth.txt", function(err, data) {
		if(err) throw err;
		var arr = data.toString().split("\n");
		for(i in arr) {
			arr[i] = arr[i].trim();
			str = arr[i].indexOf(":") > -1 ? arr[i].split(":") : [arr[i],""];
			authl.users.push({username: str[0], password: str[1]});
		}
	});
}
AuthLib.prototype.auth = function(username, password) {
	for(i in this.users) {
		if(this.users[i].username == username && this.users[i].password == password) {
			return true;
		}
	}
	return false;
}
exports.AuthLib = AuthLib;