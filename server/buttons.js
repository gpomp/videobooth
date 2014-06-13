var arduino = require('duino');

function Buttons() {

	this.comm = require("./socket.js");
	this.recorder = require("./video.js");

	this.photoBtn = 6;
	this.videoBtn = 5;
	this.stopBtn = 4;

	this.stopLED = 1;
	this.photoLED = 2;
	this.videoLED = 3;

    this.board = new arduino.Board();
    this.board.on('ready', this.boardReady.bind(this));
}


Buttons.prototype.boardReady = function() {
	this.buttonList = [
		new arduino.Button({
		  	board: this.board,
		  	pin: this.photoBtn
		}),
		new arduino.Button({
		  	board: this.board,
		  	pin: this.videoBtn
		}),
		new arduino.Button({
		  	board: this.board,
		  	pin: this.stopBtn
		})
	];

	this.ledList = [
		new arduino.Led({
		  	board: this.board,
		  	pin: this.videoLED
		}),
		new arduino.Led({
		  	board: this.board,
		  	pin: this.photoLED
		}),
		new arduino.Led({
		  	board: this.board,
		  	pin: this.stopLED
		})
	];

	var self = this;

	for (var i = 0; i < this.buttonList.length; i++) {
		var b = this.buttonList[i];
		b.on('down', function() {
			self.btnDown(this);
		});
	};

	for (var i = 0; i < this.ledList.length; i++) {
		var l = this.ledList[i];
		l.on();
	};

	this.afterRecording();
};

Buttons.prototype.btnDown = function(button) {
	var recorder = require("./video.js");
	var comm = require("./socket.js");
	switch(button.pin) {
		case this.photoBtn : 
			if(recorder.recording) {
				return;
			}
			//this.ledList[0].blink(500);
			comm.emit({ 'message' : 'photo' });
		break;
		case this.videoBtn :  
			if(recorder.recording) {
				return;
			}
			//this.ledList[1].blink(500);
			comm.emit({ 'message' : 'video' });
		break;
		case this.stopBtn :  
			console.log("stopBtn", recorder.recording);
			if(!recorder.recording) {
				return;
			}
			//this.ledList[1].blink(500);
			comm.emit({ 'message' : 'stop_recording' });
		break;
	}
};

Buttons.prototype.afterRecording = function() {
	
};

module.exports = new Buttons();