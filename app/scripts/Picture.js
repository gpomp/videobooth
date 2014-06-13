 (function() {
  var Picture; 
	window.Picture = Picture = (function() {

		function Picture() { 
			this.canvas = document.getElementById("pic-canvas");
			this.context = this.canvas.getContext('2d');
			this.isRender = false;
			this.timer = -1;

			document.addEventListener(Comm.SEND_PIC_URL, this.drawPic.bind(this));
		}

		Picture.prototype.drawPic = function(event) {
			var img = new Image();
			var self = this;
			img.onload = function() {
				self.imgLoaded(this);
			}

			img.src = "photos/" + event.detail.url;
		};

		Picture.prototype.imgLoaded = function(img) {
			this.isRender = true;
			this.white = 1;
			var w = img.width;
			this.canvas.width = $(window).width();
			this.canvas.height = $(window).width() / w * img.height;
			$(this.canvas).css("top", ($(window).height() - this.canvas.height) * .5);
			this.img = img;

			$(this.canvas).addClass("show");
			
			TweenLite.to(this, 3, { white : 0, ease : Expo.easeOut, onComplete : this.endAnimation.bind(this) });
		};

		Picture.prototype.endAnimation = function() {
			this.isRender = false;

			window.clearTimeout(this.timer);
			window.setTimeout(this.hidePicture.bind(this), 5000);
		};

		Picture.prototype.hidePicture = function() {
			$(this.canvas).removeClass("show");
		};

		Picture.prototype.render = function() {
			if(!this.isRender) {
				return;
			}
			this.context.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = 'rgba(255, 255, 255, ' + this.white + ')';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		};

		Picture.prototype.resize = function() {
			
		};



		return Picture;
	})();
}).call(this);