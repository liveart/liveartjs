/**
 * LIVEART INITALIZATION BEGINS HERE
 */

//Use this to receive liveArt debug info to console
//liveArt.debug();

var laOptions = {
    dimensions: [587, 543]
};
laOptions.defaultDesignId = decodeURI((RegExp("design_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
laOptions.defaultProductId = decodeURI((RegExp("product_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
laOptions.defaultGraphicId = decodeURI((RegExp("graphic_id" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);

//You can provide placeOrderHandler here
//optional custom handler for place order
//format: `function (ordered_design_id: string)`
laOptions.placeOrderHandler = null;
//optional translation
laOptions.translation = laTranslation.dictionary;

//Initing liveArt
//controlsUpdateHandler() defined in LA.js
liveArt.init(document.getElementById('canvas-container'), "config/config.json", controlsUpdateHandler, laOptions);

/**
 * LIVEART INITALIZATION ENDS HERE
 */