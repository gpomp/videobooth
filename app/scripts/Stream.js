navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.navigator ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

 (function() {
  var Stream; 
	window.Stream = Stream = (function() {

		function Stream() {  
			navigator.getMedia({
	      	video: {
			    	mandatory: {
			      		minWidth: 1280,
			      		minHeight: 720
			      	}
			    },
		      	audio: false
		    }, this.success.bind(this), this.error.bind(this));
		}

		Stream.prototype.success = function(stream) {
			this.createVideo(stream);
		};

		Stream.prototype.error = function() {
			console.log("stream error");
		};

		Stream.prototype.createVideo = function(stream) {
			this.video = document.querySelector('#webcam');
			
			if (navigator.mozGetUserMedia) {
        		this.video.mozSrcObject = stream;
      		} else {
        		var vendorURL = window.URL || window.webkitURL;
        		this.video.src = vendorURL.createObjectURL(stream);
      		}
      		this.video.play();

      		this.video.addEventListener('canplay', this.videoCanPlay.bind(this), false);
		};

		Stream.prototype.videoCanPlay = function(ev) {
			console.log("videoCanPlay", ev);
			if (!this.streaming) {
				console.log("set Size");

				var vdoWidth = 1280;
				var vdoHeight = 720;

				$("#webcam").attr('width', '100%');
				$("#webcam").attr('height', '100%');
		      	this.streaming = true;
		    }
		}

		return Stream;
	})();
}).call(this);