var net = require('net');
var enet = require('enet');

enet.createServer({
	address: {
		address: '::',
		port: 1234,
	},
	peers: 32,
	channels: 8,
	down: 0,
	up: 0,
}, function (err, host) {
	if (err) {
		console.error(err);
		return;
	}
	
	host.on("connect", function (peer, data) {
		console.log("connect");
		rstream = peer.createReadStream(0);
		wstream = peer.createWriteStream(0);
		var localsock = net.connect({port: data}, function() {
			rstream.pipe(localsock);
			localsock.pipe(wstream);
			localsock.on("end", function () {
				peer.disconnect();
			});
		});
		peer.on("disconnect", function (data) {
			localsock.end();
		});
	});
	
	host.start();
});
