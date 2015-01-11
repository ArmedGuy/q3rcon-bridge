var mysql = require('mysql');
function MySQLAuthLib(options) {
  this.options = options;
  this.users = [];
  this.conn = null;
  this.fetchUsers();
}
MySQLAuthLib.prototype.fetchUsers = function() {
  var authl = this;
  this.conn = mysql.createConnection({
    host: this.options.host,
    user: this.options.user,
    password: this.options.password
  });
  this.conn.connect();
  this.conn.query("SELECT * FROM `" + this.options.database + "`.`rcon_users`", function(err, rows) {
    for(var i in rows) {
      authl.users.push({
        username: rows[i].username,
        password: rows[i].password,
        servers: rows[i].servers.indexOf("|") > -1 ? rows[i].servers.split("|") : [rows.servers]
      });
    }
    this.conn.end();
  });
};
MySQLAuthLib.prototype.auth = function(username, password, server, callback) {
  password = require('crypto').createHash('md5').update(password).digest("hex");
  for(var i in this.users) {
    if(this.users[i].username == username &&
       this.users[i].password == password &&
       this.users[i].servers.indexOf(server) != -1) {
         callback(true);
    } else {
      callback(false);
    }
  }
};
module.exports = MySQLAuthLib;
