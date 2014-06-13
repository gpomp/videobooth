spawn = require('child_process').spawn;
function Recorder() {	
	var path = require('path');
	var topModule = module;

	while(topModule.parent)
	  topModule = topModule.parent;

	var appDir = path.dirname(__dirname);
	this.videoFolder = appDir + "\\app\\videos\\";
	this.photoFolder = appDir + "\\app\\photos\\";

	this.comm = require("./socket.js");
	this.buttons = require("./buttons.js");

	this.vdoMaxTime = 120000;
	this.vdoTimer = -1;

	this.picDelayTime = 3000;
	this.picTimer = -1;
	this.cmd = 'ffmpeg';

	this.vdoOptions = [
		'-f', 'dshow',
		'-s', '1920x1080',
		'-rtbufsize', '702000k',
		'-i', 'video=Logitech HD Pro Webcam C920:audio=Microphone (HD Pro Webcam C920)',
		'-copyinkf',
		'-r', '30',
		'-g', '0',
		'-threads', '0',
		'-vcodec', 'libx264',
		'-acodec', 'libmp3lame',
		'-tune', 'zerolatency',
		'-b:v', '20000k',
		'-qscale', '4',
		'-ab', '24k',
		'-ar', '22050'
	];

	

	this.picOptions = [
		'-f', 'dshow',
		'-s', '2304x1536',
		'-i', 'video=Logitech HD Pro Webcam C920',
		'-copyinkf',
		'-threads', '0',
		'-qscale', '2',
		'-vframes', '3'
	]

	this.vdoFormat = ".mp4";
	this.picFormat = ".jpg";

	this.recording = false;
}

Recorder.prototype.record = function(fileName) {
	if(this.recording) return;
	clearTimeout(this.vdoTimer);
	clearTimeout(this.picTimer);

	var opt = this.vdoOptions.slice(0);
	opt.push(this.videoFolder + fileName + this.vdoFormat);

	this.recordInstance = spawn(this.cmd, opt);
	this.addEvents();

	this.recording = true;

	this.vdoTimer = setTimeout(this.closeRecording.bind(this), this.vdoMaxTime);
}

Recorder.prototype.takePicture = function(fileName) {
	if(this.recording) return;

	var opt = this.picOptions.slice(0);
	opt.push(this.photoFolder + fileName + "%3d" + this.picFormat);
	this.currFileName = fileName;
	this.recordInstance = spawn(this.cmd, opt);
	this.addEvents();

	this.recording = true;

	this.picTimer = setTimeout(this.getPicture.bind(this), this.picDelayTime);
}

Recorder.prototype.addEvents = function() {
	this.recordInstance.stdout.on('data', this.getLog.bind(this));
	this.recordInstance.stderr.on('data', this.getLog.bind(this));
	this.recordInstance.on('close', this.onClose.bind(this));
}

Recorder.prototype.getLog = function(data) {
	console.log('log: ' + data);
}

Recorder.prototype.getPicture = function() {
	
	this.closeRecording();
	this.comm.emit({'message' : 'get_picture', 'url' : this.currFileName + "003" + this.picFormat});
	var fs = require('fs');
	for (var i = 1; i < 3; i++) {
		fs.unlink(this.photoFolder + this.currFileName + "00" + i + this.picFormat);
	};
};

Recorder.prototype.closeRecording = function() {
	clearTimeout(this.vdoTimer);
	clearTimeout(this.picTimer);
	if(!this.recording) {
		return;
	}
	this.recordInstance.stderr.on('data', function() {
		this.recordInstance.stdin.setEncoding('utf8');
	    this.recordInstance.stdin.write('q');
	}.bind(this));
}

Recorder.prototype.onClose = function(code) {
	console.log('child process exited with code ' + code);
	this.recording = false;
	this.buttons.afterRecording();
}

module.exports = new Recorder();