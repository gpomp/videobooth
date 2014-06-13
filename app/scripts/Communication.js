(function() {
  var Comm; 
	window.Comm = Comm = (function() {

		function Comm() {  
			this.socket = io.connect();
			this.connected = false;

			this.socket.on('message', this.getMessage.bind(this));

			document.addEventListener(CountDown.READY, this.launch.bind(this));
		};

		//Messages
		Comm.CONNECT_OK = "connect_ok";
		Comm.TYPE_VIDEO = "video";
		Comm.TYPE_PHOTO = "photo";
		Comm.GET_PICTURE = "get_picture";

		//Events
		Comm.LAUNCH_VDO = "launch_video";
		Comm.LAUNCH_PHOTO = "launch_photo";
		Comm.STOP = "stop_recording";
		Comm.SEND_PIC_URL = "send_pic";

		Comm.prototype.getMessage = function(data) {
			switch(data.message) {
				case Comm.CONNECT_OK :
					this.connected = true;
				break;
				case Comm.TYPE_VIDEO :
					document.dispatchEvent(new CustomEvent(Comm.LAUNCH_VDO, { bubbles:false, cancelable:false }));
				break;
				case Comm.TYPE_PHOTO :
					document.dispatchEvent(new CustomEvent(Comm.LAUNCH_PHOTO, { bubbles:false, cancelable:false }));
				break;
				case Comm.GET_PICTURE :
					document.dispatchEvent(new CustomEvent(Comm.SEND_PIC_URL, { 
						bubbles:false, 
						cancelable:false,
						detail: {
							'url' : data.url
						}
					}));
				break;
				case Comm.STOP :
					this.socket.emit('client-message', { 'type' : Comm.STOP });
					document.dispatchEvent(new CustomEvent(Comm.STOP, { bubbles:false, cancelable:false }));
				break;
			}

			console.log("from server", data.message);
		};

		Comm.prototype.emit = function(message) {
			this.socket.emit('client-message', { 'type' : message });
		};

		Comm.prototype.launch = function(event) {
			this.emit(event.detail.type);
		};

		return Comm;
	})();
}).call(this);