/**
 * LIVEART INITALIZATION BEGINS HERE
 */

//Use this to receive liveArt debug info to console
//liveArt.debug();

var laOptions = {
    dimensions: [590, 530]
};


laOptions.defaultDesignId = getQueryParam("design_id");
laOptions.defaultProductId = getQueryParam("product_id");
laOptions.defaultGraphicId = getQueryParam("graphic_id");

var configObj = null;

laOptions.defaultProductAttributes = {};
var sizeUnits = decodeURI((new RegExp("pa_size_units" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
var quantities = decodeURI((new RegExp("pa_quantities" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
laOptions.defaultProductAttributes.sizeUnits = JSON.parse(decodeURIComponent(sizeUnits));
laOptions.defaultProductAttributes.quantities = JSON.parse(decodeURIComponent(quantities));

var configFile = decodeURI((new RegExp("config" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
if (configFile && configFile !== "null") {
    configFile = decodeURIComponent(configFile);
} else {
    configFile = null;
}

//Designer mode param. Enabling pre-made template or design idea mode.
laOptions.mode = getQueryParam("mode");

//You can provide placeOrderHandler here
//optional custom handler for place order
//format: `function (ordered_design_id: string)`
laOptions.placeOrderHandler = null;
//optional translation
laOptions.translation = self.laTranslation.dictionary;

//Initing liveArt
//controlsUpdateHandler() defined in LA.js
liveArt.init(document.getElementById('canvas-container'), configObj || configFile || "config/config.json", self.controlsUpdateHandler, laOptions, uiHelpers);

/**
 * LIVEART INITALIZATION ENDS HERE
 */

// liveart-template-saved event will be triggered on save template
document.addEventListener("liveart-template-saved", function (event) {
    // event.detail - saveTemplate response data
    if (window.parent) {
        window.parent.postMessage(JSON.stringify(event.detail), "*");
    }
});


/**
 * Returns query parameter
 * @param param
 * @param type - (number|boolean|json), default - string
 * @returns {*}
 */
function getQueryParam(param, type) {
    var val = decodeURI((RegExp(param + '=' + '(.*?)(&|$)').exec(location.search) || [, null])[1]);
    if (val === "null")
        return null;
    if (type) {
        if (type === "number") {
            var valN = Number(val);
            if (!isNaN(valN))
                return valN;
            else
                return null;
        }
        if (type === "boolean") {
            return val.toLowerCase() === "true";
        }

        if (type === "json") {
            try {
                return JSON.parse(decodeURIComponent(val));
            } catch (e) {
                console.warn("Unexpected string in " + param);
            }
        }
    }

    return val;
}
