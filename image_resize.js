var g_isCanvasSupported = null;

var ImageResize = function(jImage) {
	this.jImage = jImage;
};

ImageResize.prototype.resize = function(width, height, duration) {
	if(this._isCanvasSupported())
		this._resizeCanvas(width, height, duration);
	else
		this._resizeImage(width, height, duration);
};

ImageResize.prototype._isCanvasSupported = function() {
	if(g_isCanvasSupported === null) {
		var canvas = document.createElement('canvas');
		g_isCanvasSupported = !!canvas.getContext && !!canvas.getContext('2d');
	}
	return g_isCanvasSupported;
};

ImageResize.prototype._resizeImage = function(width, height, duration) {
	this.jImage.animate({
		width: width,
		height: height
	}, duration);
};

ImageResize.prototype._resizeCanvas = function(width, height, duration) {
	var startWidth = this.jImage.width();
	var startHeight= this.jImage.height();	
	
	var canvas = document.createElement('canvas');
	canvas.width = width > startWidth ? width : startWidth;
	canvas.height = height > startHeight ? height : startHeight;
	canvas.style.display = 'block'; 
		
	var ctx = canvas.getContext('2d');
	var image = new Image();
	var startTime = new Date().getTime();
	var jImage = this.jImage;
	image.onload = function() {	
		jImage.hide();	
		jImage.after(canvas);
		
		var tick = function(){
			var d = (new Date().getTime() - startTime) / duration;
			
			if(d >= 1) {
				clearInterval(timer);
				canvas.parentNode.removeChild(canvas);	
				jImage.css({
					width: width,
					height: height
				});
				jImage.show();
			} else {
				var w = startWidth + d*(width - startWidth);
				var h = startHeight+ d*(height- startHeight);
				
				ctx.drawImage(image, 0, 0, w, h);
			}
		};
		
		var timer = setInterval(tick, 1);
		tick();
	};
	image.src = this.jImage.attr('src');
};