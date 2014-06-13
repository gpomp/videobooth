(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
}());

$(document).ready(function() {
	window.stream = new Stream();
	window.communication = new Comm();
	window.countDown = new CountDown();
	window.picture = new Picture();

	$(window).keyup(function(event) {
		//console.log(event.keyCode);
		switch(event.keyCode) {
			case 83 : 
				window.communication.emit(Comm.STOP);
			break;
		}
	});

	window.render();

	$(window).resize(window.resize);
  window.resize();
});

window.render = function() {
	window.animation = window.requestAnimationFrame(window.render);
	window.countDown.render();
	window.picture.render();
};

window.resize = function(event) {
  $(".overlay").css("top", ($("body").height() - $(".overlay").height()) * .5);
	window.countDown.resize();
};