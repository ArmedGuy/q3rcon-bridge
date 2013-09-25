var mysql = require('mysql');
function EchelonAuthLib(options) {
	authl = this;
	this.users = new Array();
	this.options = options;
	this.fetchUsers();
}
EchelonAuthLib.prototype.fetchUsers = function() {
	this.users = [];
	this.conn = mysql.createConnection({
		host: this.options.host,
		user: this.options.user,
		password: this.options.password
	});
	this.conn.connect();
	this.conn.query("SELECT * FROM `" + this.options.database + "`.`users`", function(err, rows) {
		for(var i in rows) {
			authl.users.push({username: rows[i].username, password: rows[i].password});
		}
	});
	this.conn.end();
}
EchelonAuthLib.prototype.auth = function(username, password, callback) {
	password = require('crypto').createHash('md5').update(password).digest("hex")
	for(i in this.users) {
		if(this.users[i].username == username && this.users[i].password == password) {
			return callback(true);
		}
	}
	return callback(false);
}
module.exports = EchelonAuthLib;