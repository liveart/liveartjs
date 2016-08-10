/**
 * LIVEART INITALIZATION BEGINS HERE
 */



//Use this to receive liveArt debug info to console
//liveArt.debug();
//Initing liveArt
//You can provide placeOrderHandler here
var laOptions = {
    dimensions: [587, 543]
};
laOptions.defaultDesignId = decodeURI((RegExp("design_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
laOptions.defaultProductId = decodeURI((RegExp("product_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
laOptions.defaultGraphicId = decodeURI((RegExp("graphic_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

//optional custom handler for place order
laOptions.placeOrderHandler = null;
//optional translation
laOptions.translation = laTranslation.dictionary;

//controlsUpdateHandler() defined in LA.js
liveArt.init(document.getElementById('canvas-container'), "config/config.json", controlsUpdateHandler, laOptions);

/**
 * LIVEART INITALIZATION ENDS HERE
 */