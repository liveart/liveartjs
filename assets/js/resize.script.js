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
(function () {

    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

liveArtResponsive = {};
liveArtResponsive.resizeCompleteDelay = 40;

liveArtResponsive.resize = function () {
    var canvas = document.querySelector("#canvas-container");
    if (!canvas) return;
    liveArtResponsive.resize = function () {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        var checkAfterDelay = function () {
            if (liveArtResponsive.resizeTimeout) {
                clearTimeout(liveArtResponsive.resizeTimeout);
            }
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            liveArtResponsive.resizeTimeout = setTimeout(localProcessor, liveArtResponsive.resizeCompleteDelay);
        };
        var localProcessor = function () {
            if (canvas.clientWidth === width && canvas.clientHeight === height) {
                var event = new CustomEvent('la-responsive-resize');
                canvas.dispatchEvent(event);

                // Post event. Fixes switching between desktop and mobile (see LAJS100/TASK733 msg#5##2)
                setTimeout(function () {
                    var event = new CustomEvent('la-responsive-resize');
                    canvas.dispatchEvent(event);
                }, 300);
            } else {
                checkAfterDelay();
            }
        };
        checkAfterDelay();
    }
};
