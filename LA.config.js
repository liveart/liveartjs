/**
 * LIVEART INITIALIZATION BEGINS HERE
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

// `configPath` - alternate config path to override default one
var configPath = decodeURI((new RegExp("config" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
if (configPath && configPath !== "null") {
    configPath = decodeURIComponent(configPath);
} else {
    configPath = null;
}

//to be replaced by nginx (docker) to use in LACP stack
var public_path = '_PUBLIC_ADDRESS_';
if (!configPath && !public_path.includes('PUBLIC_ADDRESS')) {
    configPath = `${public_path}/lacp/api/liveart/configuration`;
}

//Designer mode param. Enabling pre-made template or design idea mode.
laOptions.mode = getQueryParam("mode");

//optional translation
laOptions.translation = self.laTranslation.dictionary;

//Init liveArt
//controlsUpdateHandler() defined in LA.js

var defaultConfig = configObj || configPath || 'config/config.json';
liveArtLoader.init(document.getElementById('canvas-container'), defaultConfig, self.controlsUpdateHandler, laOptions, uiHelpers);

/**
 * LIVEART INITIALIZATION ENDS HERE
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
