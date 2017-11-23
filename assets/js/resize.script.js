window.addEventListener('resize', function () {
	liveArtResponsive.resize();
});

window.addEventListener('load', function () {
	liveArtResponsive.resize();
});

/**
 * Utils object for adaprive LieArt Canvas (uses all available space)
 * Requires: add to '#liveart-main-container' class 'fullSize'
 * Dependencies: requires file 'assets\js\resize.less.js' with 'laLessConst' object
 */

liveArtResponsive = {};

liveArtResponsive.resize = function() {
	var wrap = document.getElementById("liveart-isolate-container");
	var container = document.getElementById("liveart-main-container");
	var canvas = document.getElementById("canvas-container");
		
	var wrapWidth = wrap.offsetWidth;
	//get max viewport height
	var wrapHeight = window.innerHeight;

	var needResize = wrapWidth > laLessConst.mainContainerWidth && wrapHeight > laLessConst.mainContainerHeight;
	//resize only marked with 'fullSize' container
	if (container.classList.contains('fullSize') && needResize) {		
		container.style['width'] = Math.floor(wrapWidth) + "px";
		container.style['height'] = Math.floor(wrapHeight) + "px";
		canvas.style['width'] = Math.floor(liveArtResponsive.getCanvasWidth(wrapWidth)) + "px";
		canvas.style['height'] = Math.floor(liveArtResponsive.getCanvasHeight(wrapHeight)) + "px";
	} else {
		container.style['width'] = "";
		container.style['height'] = "";
		canvas.style['width'] = "";
		canvas.style['height'] = "";
	}
}

liveArtResponsive.getHeight = function(wrapWidth) {
	var canvasRatio = liveArtResponsive.getCanvasRatio();
	//Canvas resized width
	var canvasWidthNew = liveArtResponsive.getCanvasWidth(wrapWidth);
	//liveart.height - canvas.height - logo.height(?)
	var notCanvasHeight = laLessConst.mainContainerHeight - laLessConst.canvasHeight - laLessConst.logoHeight;
	//Canvas resized height + other elements
	var wrapNewHeight = canvasWidthNew / canvasRatio + notCanvasHeight;

	return wrapNewHeight;
}

liveArtResponsive.getWidth = function(wrapHeight) {
	var canvasRatio = liveArtResponsive.getCanvasRatio();
	//Canvas resized height
	var canvasHeightNew = liveArtResponsive.getCanvasHeight(wrapHeight);
	//liveart.width - canvas.width
	var notCanvasWidth = laLessConst.mainContainerWidth - laLessConst.canvasWidth;
	//Canvas resized height + other elements
	var wrapNewWidth = canvasHeightNew * canvasRatio + notCanvasWidth;

	return wrapNewWidth;
}

liveArtResponsive.getProportionalDimensions = function(wrapWidth, wrapHeight) {
		var wrapNewWidth = wrapWidth;
		//Canvas resized height + other elements
		var wrapNewHeight = liveArtResponsive.getHeight(wrapWidth);

		if (wrapNewHeight > wrapHeight) {
			wrapNewWidth = liveArtResponsive.getWidth(wrapHeight);
			wrapNewHeight = wrapHeight;
		}

	return {width: wrapNewWidth, height: wrapNewHeight}
}

liveArtResponsive.getCanvasWidth = function(width) {
	return width - (laLessConst.mainContainerWidth - laLessConst.canvasWidth);
}

liveArtResponsive.getCanvasHeight = function(height) {
	return height - (laLessConst.mainContainerHeight - laLessConst.canvasHeight);
}

liveArtResponsive.getCanvasRatio = function() {
	return laLessConst.canvasWidth / laLessConst.canvasHeight;
}