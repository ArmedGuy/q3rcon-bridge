var dgram = require('dgram'),
    events = require('events'),
    util = require('util'),
    net = require('net');

function natclient(addr, bind) {
	this.peer = addr;
	this.host = bind;
	this.socket = dgram.createSocket("udp4");
	this.t = null;
	this.bound = false;
}
natclient.prototype.bind = function() {
	this.socket.bind(0, this.host);
	this.bound = true;
}

	
function udpnatserver(options, emCallback) {
	natserv = this;
	this.options = options;
	this._server = dgram.createSocket("udp4");
	this._connections = {};
	this.callback = emCallback;
	this._server.on("message", function(msg, sender) {
		var cid = natserv.hash(sender), _client;
		if(cid in natserv._connections) {
			_client = natserv._connections[cid];
			clearTimeout(_client.t);
		} else {
			_client = new natclient(sender, natserv.options.bindHost);
			natserv._connections[cid] = _client;
		}
		if(!_client.bound) {
			_client.socket.on("listening", function() {
				this.peer = sender;
			}).on("message", function(msg, sender) {
				natserv._server.send(msg, 0, msg.length, _client.peer.port, _client.peer.address, function(err, bytes) {
					if(err) {
					}
				});
			}).on("close", function() {
				delete natserv._connections[cid];
			}).on("error", function(err) {
			});
			_client.bind();
		}
		natserv.callback(msg, sender, function(result) {
			if(result != false) {
				msg = new Buffer(result);
				_client.socket.send(msg, 0, msg.length, natserv.options.proxyPort, natserv.options.proxyHost, function(err, bytes) {
					try {
						clearTimeout(_client.t);
					}
					finally {
						_client.t = setTimeout(function() {
							_client.socket.close();
						}, 20000);
					}
				});
			}
		});
	});
}
util.inherits(udpnatserver, events.EventEmitter);

udpnatserver.prototype.hash = function(addr) {
	return (addr.address + addr.port).replace(/\./g, '');
}
udpnatserver.prototype.listen = function(port, host) {
	if(this._server) {
		this._server.bind(port, host);
	}
}
exports.createServer = function(options, callback) {
	return new udpnatserver(options, callback);
}