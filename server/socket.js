function Communication() {
	
}

Communication.prototype.connect = function(server) {
	console.log("create socket communication...");

	this.recorder = require("./video.js");

	this.io = require('socket.io').listen(server);
	this.io.sockets.on('connection', this.onConnection.bind(this));
};

Communication.prototype.onConnection = function(socket) {
	socket.emit('message', {'message': 'connect_ok'});
	socket.on('client-message', this.onMessage.bind(this));
};

Communication.prototype.onMessage = function(data) {
	console.log("onMessage", data);
	var recorder = require("./video.js");
	var d = new Date().getTime();
	switch(data.type) {
		case 'photo' :
			recorder.takePicture('p' + d);
			console.log('take a photo');
		break;
		case 'video' :
			recorder.record('v' + d);
			console.log('take a video');
		break;
		case 'stop_recording' :
			recorder.closeRecording();
			console.log('stop video');
		break;
	}
};

Communication.prototype.emit = function(data) {
	console.log("emit", data);
	this.io.sockets.emit('message', data);
	
};

module.exports = new Communication();