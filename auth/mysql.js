var mysql = require('mysql');
function MySQLAuthLib(options) {
  this.options = options;
  this.users = [];
  this.conn = null;
}
MySQLAuthLib.prototype.fetchUsers = function() {
  var authl = this;
  this.conn = mysql.createConnection({
    host: this.options.host,
    user: this.options.user,
    password: this.options.password
  });
  this.users = [];
  this.conn.connect(function(err) {
    if(err) {
      console.error("Error connecting to MySQL server: " + err.stack);
      return;
    }
    authl.conn.query("SELECT * FROM `" + authl.options.database + "`.`rcon_users`", function(err, rows) {
      for(var i in rows) {
        authl.users.push({
          username: rows[i].username,
          password: rows[i].password,
          servers: rows[i].servers.indexOf(",") > -1 ? rows[i].servers.split(",") : [rows[i].servers]
        });
      }
      authl.conn.end();
    });
  });
};
MySQLAuthLib.prototype.auth = function(username, password, server, callback) {
  password = require('crypto').createHash('md5').update(password).digest("hex");
  for(var i in this.users) {
    if(this.users[i].username == username &&
       this.users[i].password == password &&
       this.users[i].servers.indexOf(server) != -1) {
         callback(true);
         return;
    }
  }
  callback(false);
};
module.exports = MySQLAuthLib;
