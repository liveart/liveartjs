/**
 * LIVEART INITALIZATION BEGINS HERE
 */

var laOptions = {
    dimensions: [587, 543]
};


//Enabling Admin mode
var isAdmin = getQueryParam("admin", "boolean") || false;
laOptions.adminMode = isAdmin;
controlsModel.adminMode(isAdmin);

laOptions.defaultDesignId = getQueryParam("design_id");
laOptions.defaultProductId = getQueryParam("product_id");
laOptions.defaultGraphicId = getQueryParam("graphic_id");
laOptions.defaultProductAttributes = {};

laOptions.defaultProductAttributes.sizeUnits = getQueryParam("pa_size_units", "json");
laOptions.defaultProductAttributes.quantities = getQueryParam("pa_quantities", "json");
laOptions.defaultProductAttributes.selectedUnit = getQueryParam("pa_selected_unit");

var configFile = getQueryParam("config") || "config/config.json";

//You can provide placeOrderHandler here
//optional custom handler for place order
//format: `function (ordered_design_id: string)`
laOptions.placeOrderHandler = null;
//optional translation
laOptions.translation = laTranslation.dictionary;

//Initing liveArt
//controlsUpdateHandler(), uiHelpers() defined in LA.js
liveArt.init(document.getElementById('canvas-container'), configFile, controlsUpdateHandler, laOptions, uiHelpers);

/**
 * LIVEART INITALIZATION ENDS HERE
 */

// liveart-template-saved event will be triggered on save template
document.addEventListener("liveart-template-saved", function (event) {
    // event.value - saveTemplate response data
});


function getQueryParam(param, type) {
    var val = decodeURI((RegExp(param + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
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
