(function() {
  var CountDown; 
	window.CountDown = CountDown = (function() {

		function CountDown() { 
			this.timer = -1;
			this.count = 5;
			this.inUse = false;

			this.timerVideo = -1;
			this.thanksTimer = -1;

			document.addEventListener(Comm.LAUNCH_VDO, this.launchVdo.bind(this));
			document.addEventListener(Comm.LAUNCH_PHOTO, this.launchPhoto.bind(this));
			document.addEventListener(Comm.STOP, this.stopVideoTimer.bind(this));

			this.resize();
		}

		CountDown.READY = "cd_ready";

		CountDown.prototype.launchVdo = function(event) {
			if(this.inUse) {
				return;
			}
			this.type = Comm.TYPE_VIDEO;
			this.launch();
		};

		CountDown.prototype.launchPhoto = function(event) {
			if(this.inUse) {
				return;
			}
			this.type = Comm.TYPE_PHOTO;
			this.launch();
		};

		CountDown.prototype.launch = function() {
			window.clearInterval(this.timer);
			this.inUse = true;
			$(".overlay .countdown span").text(this.count);
			$(".overlay .countdown span").addClass("show");
			/*TweenLite.to(this.container.find(".border-circle"), 2, { scale : 2, ease: Expo.easeInOut });
			TweenLite.to(this.container.find(".inner"), 2, { scale : 1, ease: Expo.easeInOut, delay : .5, onComplete :  });*/

			//this.startTimer.bind(this)
			$(".overlay").addClass("show");
			
			window.setTimeout(function() 	{ 
												$(".overlay .countdown").append('<object data="images/svg/countdown_root.svg" id="count-graph" type="image/svg+xml"></object>'); 
												$(".overlay .countdown ." + this.type).addClass("show");
											}.bind(this), 500);

			window.setTimeout(function() { this.startTimer(); }.bind(this), 1600);

		};

		CountDown.prototype.startTimer = function() {
			window.clearInterval(this.timer);
			this.timer = window.setInterval(this.change.bind(this), 1000);			
		};

		CountDown.prototype.change = function() {
			$(".overlay .countdown span").text(this.count);
			this.count--;
			if(this.count < 0) {
				window.clearInterval(this.timer);
				$(".overlay .countdown span").removeClass("show");
				$(".overlay .countdown span").text("");
				document.dispatchEvent(new CustomEvent(CountDown.READY, { 
					detail: {
						'type' : this.type
					},
					bubbles:false, 
					cancelable:false 
				}));
				$(".overlay").removeClass("show");

				TweenLite.to($(".overlay .countdown object"), .4, { autoAlpha : 0, onComplete : function() {
					$(".overlay .countdown object").remove();
				} });

				$(".overlay .countdown .type").removeClass("show");

				this.count = 5;

				this.inUse = false;

				if(this.type === Comm.TYPE_VIDEO) {
					$(".videoTimer span").text("02:00");
					$(".videoTimer .circle-container, .videoTimer span").addClass("show");

					this.totalTimeVideo = 120000;
					this.currTimeVideo = 120000;
					clearInterval(this.timerVideo);
					this.timerVideo = window.setInterval(this.setVideoCountDown.bind(this), 1000);
				}

			}
		};

		CountDown.prototype.setVideoCountDown = function() {
			this.currTimeVideo -= 1000;
			var t = this.currTimeVideo / 1000;
			var min = Math.floor(t / 60);
			var s = (t / 60 - min);

			$(".videoTimer span").text("0" + min + ":" + Math.round(s * 60));
		};

		CountDown.prototype.stopVideoTimer = function() {
			 
			clearInterval(this.timerVideo);
			$(".videoTimer .circle-container, .videoTimer span").removeClass("show");
			$(".overlay, .overlay .thanks").addClass("show");

			window.clearTimeout(this.thanksTimer);
			this.thanksTimer = window.setTimeout(function() {
				window.clearTimeout(this.thanksTimer);
				$(".overlay, .overlay .thanks").removeClass("show");
			}, 6000);
		};

		CountDown.prototype.render = function() {
			
		};

		CountDown.prototype.resize = function() {
			/*this.container.css({
				"top" : ($(window).height() - this.container.height()) * .5,
				"left" : ($(window).width() - this.container.width()) * .5
			});*/
		};

		CountDown.prototype.scaleObj = function(obj, center, scale) {
            obj.attr("transform", "matrix(" + scale + ", 0, 0, " + scale + ", " + (center.x - scale * center.x) + ", " + (center.y - scale * center.y) + ")");
        };

		return CountDown;
	})();
}).call(this); 