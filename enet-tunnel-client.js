var net = require('net');
var enet = require('enet');

var client = enet.createClient({
	peers: 1,
	channels: 2,
	down: 0,
	up: 0,
}, function (err, host) {
	if (err) {
		console.error(err);
		return;
	}
});

var server = net.createServer(function (conn) {
	console.log("connect");
	var peer = client.connect({
		address: '127.0.0.1',
		port: 1234,
	}, 2, 7777, function (err, peer) {
		if (err) {
			console.error(err);
			return;
		}
		var rstream = peer.createReadStream(0);
		var wstream = peer.createWriteStream(0);
		rstream.pipe(conn);
		conn.pipe(wstream);
		peer.on("disconnect", function () {
			conn.end();
		});
	});
	conn.on("end", function() {
		peer.disconnect();
	});
});
server.listen(1234);
