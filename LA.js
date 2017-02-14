function isNullOrUndefined(val) {
    return (typeof (val) == 'undefined' || val == null);
}
/*
* Object with translation
*/
var laTranslation = {
    dictionary: {
        /*
        * CORE TRANSLATION STARTS HERE
        */
        // alert messages
        DESIGN_SAVED_MESSAGE: "Design '%title%' saved successfully!",
        FAIL_TO_LOAD_CONFIG_MESSAGE: "Failed to load config: '%url%'",
        FAIL_TO_LOAD_PRODUCT_LIST_MESSAGE: "Cannot load product list: empty or non-valid JSON",
        FAIL_TO_LOAD_FONT_LIST_MESSAGE: "Cannot load font list: empty or non-valid JSON",
        FAIL_TO_LOAD_COLOR_LIST_MESSAGE: "Cannot load color list: empty or non-valid JSON",
        FAIL_TO_LOAD_GRAPHIC_LIST_MESSAGE: "Cannot load graphic list: empty or non-valid JSON",
        FAIL_TO_LOAD_TEXT_EFFECT_LIST_MESSAGE: "Cannot load text effects list: empty or non-valid JSON",
        FAIL_TO_LOAD_CONFIG_PART_MESSAGE: "Cannot load %key%: empty or non-valid JSON",
        FAIL_TO_LOAD_BACKGROUND_MESSAGE: "Failed to load background '%url%'",
        FAIL_TO_LOAD_PRODUCT_MASK_MESSAGE: "Failed to load product mask '%url%'.",
        FAIL_TO_LOAD_PRODUCT_GRAPHIC_MESSAGE: "Failed to load graphic '%url%'.",
        FAIL_TO_LOAD_FONT_MESSAGE: "Error loading font: %fontFamily%.",
        NO_FONT_INFO_MESSAGE: "No font info: \n%fontFamily%",
        NO_FONT_VECTOR_INFO_MESSAGE: "No font vector info: \n%fontFamily%",
        REGISTERING_FONT_ERROR_MESSAGE: "Error registering font: \n%fontFamily%",
        LOADING_FONT_ERROR_MESSAGE: "Fail to load font: \n%fontFamily%",
        QUOTE_ERROR_MESSAGE: "Failed to load quote: %message%",
        QUOTE_INVALID_RESPONSE_ERROR_MESSAGE: "Failed to load quote! Response is invalid.",
        WRONG_PRODUCT_ID_ERROR_MESSAGE: "Wrong product ID: %id%.",
        ORDER_PLACED_SUCCESSFULLY_MESSAGE: "Order placed successfully!",
        DESIGN_LOADED_MESSAGE: "Design '%title%' loaded successfully!",
        DESIGN_WITHOUT_TITLE_LOADED_MESSAGE: "Design loaded successfully!",
        SAVING_DESIGN_MESSAGE: "Saving design...",
        SHARING_DESIGN_MESSAGE: "Sharing design...",
        LOADING_YOUR_DESIGN_MESSAGE: "Loading your design...",
        PLACING_ORDER_MESSAGE: "Placing order...",

        // Configuration loading messages
        LOADING_COLORS_MESSAGE: "Loading colors...",
        LOADING_FONTS_MESSAGE: "Loading fonts...",
        LOADING_EFFECTS_MESSAGE: "Loading effects...",
        LOADING_PRODUCTS_MESSAGE: "Loading products...",
        LOADING_GRAPHICS_MESSAGE: "Loading graphics...",
        LOADING_SOCIAL_MESSAGE: "Loading social configuration...",
        LOADING_DESIGN_MESSAGE: "Loading design...",
        LOADING_MESSAGE: "Loading...",
        LOADED_MESSAGE: "Loaded",
        LOADING_CONFIGURATION_MESSAGE: "Loading configuration...",

        /*
        * CORE TRANSLATION ENDS HERE
        */

        /*
        * UI TRANSLATION STARTS HERE
        */
        "MINIMUM_DIMENSTION_TOOLTIP": "minimum %dimension% is %value%",
        "MINIMUM_SIDE_WIDTH_TOOLTIP": "minimum %side% length is %value%",
        "MAXIMUM_DIMENSTION_TOOLTIP": "maximum %dimension% is %value%",
        "MAXIMUM_SIDE_WIDTH_TOOLTIP": "maximum %side% length is %value%",
        "WIDTH_DIMENSION": "width",
        "HEIGHT_DIMENSION": "height",
        "LONG_SIDE": "long side",
        "SHORT_SIDE": "short side",
        "MINIMUM_STEP": "minimum step is %value%",
        "INVALID_VALUE": "Invalid value",

        "MINIMUM_ORDER_QUANTITY": "Minimum order quantity <br/> for %name% is %minQuantity%",

        "ALL_CATEGORIES": "All Categories",
        "SEARCH": "Search",

        "NO_OBJECTS" : "no objects",
        "NO_LETTERINGS" : "no letterings",
        "ONE_LETTERING": "one lettering",
        "LETTERINGS_COUNT": "%count% letterings",
        "IMAGES_COUNT": "%count% images",
        "NO_IMAGES": "no images",
        "ONE_IMAGE": "one image",
        "NO_COLORS": "no colors",
        "PROCESS_COLORS": "process colors",
        "ONE_COLOR": "one color",
        "COLORS_COUNT": "%count% colors",

        "UPLOADING_ERROR_MESSAGE": "Uploading image error",
        "FAIL_TO_SIGN_IN": "Could not signin: %error%",
        "NO_PHOTOS_IN_SOCIAL_NETWORK": "No photos in %network%",
        "INSTAGRAM": "Instagram",
        "FACEBOOK": "Facebook",
        "FLICKR": "Flickr",
        "GOOGLE": "Google",

        "CLEAR_DESIGN_CONFIRMATION": "Are you sure to clear design?",
        "INVALID_EMAIL_FORMAT": "Invalid email format",
        "INVALID_DESIGN_NAME": "Invalid design name"
        /*
        * UI TRANSLATION ENDS HERE
        */
    },
    translateUI: function (text, replace) {
        var translatedText = text;
        if (text in this.dictionary) {
            translatedText = this.dictionary[text];
        }
        if (replace) {
            for (var key in replace) {
                if (replace.hasOwnProperty(key)) {
                    translatedText = translatedText.replace("%" + key + "%", replace[key]);
                }
            }
        }
        return translatedText;
    },
    firstLetterUppercase: function (text) {
        if (!text.length) return text;
        return text.charAt(0).toUpperCase() + text.slice(1);
    },
    /*
    * Updating UI translation
    */
    update: function (dictionary) {
        for (var key in dictionary) {
            if (key in laTranslation.dictionary) {
                laTranslation.dictionary[key] = dictionary[key];
            }
        }
    }
}

var LetteringVO = function (textString, formatVO) {
    if (isNullOrUndefined(textString)) textString = '';
    if (isNullOrUndefined(formatVO)) formatVO = new TextFormatVO();

    var self = this;
    self.text = ko.observable(textString);
    self.isNames = ko.observable(false);
    self.isNumbers = ko.observable(false);
    self.formatVO = ko.observable(formatVO);
    self.transformation = ko.observable({});

    self.toObject = function () {
        var obj = {};
        obj['text'] = self.text();
        obj['fill'] = self.formatVO().fillColor();
        obj['font-weight'] = self.formatVO().bold() ? "bold" : "normal";
        obj['font-style'] = self.formatVO().italic() ? "italic" : "normal";
        obj['font-family'] = self.formatVO().fontFamily();
        obj['stroke'] = self.formatVO().strokeColor();
        obj['stroke-width'] = self.formatVO().strokeWidth();
        obj['letterSpacing'] = self.formatVO().letterSpacing();
        obj['text-align'] = self.formatVO().textAlign();
        obj['textEffect'] = self.formatVO().textEffect();
        obj['textEffectValue'] = self.formatVO().textEffectValue();
        obj['line-leading'] = self.formatVO().lineLeading();
        return obj;
    };

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        if (!isNullOrUndefined(obj['text'])) {
            self.text(obj['text']);
        }
        if (!isNullOrUndefined(obj['fill'])) {
            self.formatVO().fillColor(obj['fill']);
        }
        if (!isNullOrUndefined(obj['stroke'])) {
            self.formatVO().strokeColor(obj['stroke']);
        }
        if (!isNullOrUndefined(obj['stroke-width'])) {
            self.formatVO().strokeWidth(obj['stroke-width']);
        }
        if (!isNullOrUndefined(obj['font-weight'])) {
            self.formatVO().bold(obj['font-weight'] === "bold");
        }
        if (!isNullOrUndefined(obj['font-style'])) {
            self.formatVO().italic(obj['font-style'] === "italic");
        }
        if (!isNullOrUndefined(obj['font-family'])) {
            self.formatVO().fontFamily(obj['font-family']);
        }
        if (!isNullOrUndefined(obj['letterSpacing'])) {
            self.formatVO().letterSpacing(obj['letterSpacing']);
        }
        if (!isNullOrUndefined(obj['text-align'])) {
            self.formatVO().textAlign(obj['text-align']);
        }
        if (!isNullOrUndefined(obj['textEffect'])) {
            self.formatVO().textEffect(obj['textEffect']);
        }
        if (!isNullOrUndefined(obj['textEffectValue'])) {
            self.formatVO().textEffectValue(obj['textEffectValue']);
        }
        var a1 = self.formatVO().textEffectValue();
        if (!isNullOrUndefined(obj['line-leading'])) {
            self.formatVO().lineLeading(obj['line-leading']);
        }
        self.isNames(!isNullOrUndefined(obj['nameObj']));
        self.isNumbers(!isNullOrUndefined(obj['numberObj']));
        if (!isNullOrUndefined(obj['transformation'])) {
            self.transformation(obj['transformation']);
        }
    };
}

var TextFormatVO = function (fontFamily, fillColor, bold, italic, stroke, strokeColor, letterSpacing, textAlign, textEffect, textEffectValue, lineLeading, strokeWidth) {
    if (isNullOrUndefined(fontFamily)) fontFamily = '';
    if (isNullOrUndefined(fillColor)) fillColor = '#000000';
    if (isNullOrUndefined(bold)) bold = false;
    if (isNullOrUndefined(italic)) italic = false;
    if (isNullOrUndefined(strokeColor)) strokeColor = 'none';
    if (isNullOrUndefined(strokeWidth)) strokeWidth = '1';
    if (isNullOrUndefined(letterSpacing)) letterSpacing = '0';
    if (isNullOrUndefined(textAlign)) textAlign = 'center';
    if (isNullOrUndefined(textEffect)) textEffect = 'none';
    if (isNullOrUndefined(textEffectValue)) textEffectValue = "0";
    if (isNullOrUndefined(lineLeading)) lineLeading = 1.2;

    var self = this;
    self.fontFamily = ko.observable(fontFamily);
    self.fillColor = ko.observable(fillColor);
    self.bold = ko.observable(bold);
    self.italic = ko.observable(italic);
    self.strokeColor = ko.observable(strokeColor);
    self.strokeWidth = ko.observable(strokeWidth);
    self.letterSpacing = ko.observable(letterSpacing);
    self.textAlign = ko.observable(textAlign);
    self.textEffect = ko.observable(textEffect);
    self.textEffectValue = ko.observable(textEffectValue);
    self.lineLeading = ko.observable(lineLeading);//.extend({ throttle: 25 });

    /*self.textEffectCombined = ko.computed(function () {
        return self.textEffect() + self.textEffectValue();
    });*///.extend({ throttle: 100 });
}

var TextEffectVO = function (name, label, value, paramName, min, max, step, inverted) {
    if (isNullOrUndefined(name)) name = 'none';
    if (isNullOrUndefined(label)) label = 'None';
    if (isNullOrUndefined(value)) value = 0;
    if (isNullOrUndefined(paramName)) paramName = 'none';
    if (isNullOrUndefined(min)) min = 0.05;
    if (isNullOrUndefined(max)) max = 1;
    if (isNullOrUndefined(step)) step = 0.05;
    if (isNullOrUndefined(inverted)) inverted = false;

    var self = this;
    self.name = ko.observable(name);
    self.label = ko.observable(label);
    self.value = ko.observable(value);
    self.paramName = ko.observable(paramName);
    self.min = ko.observable(min);
    self.max = ko.observable(max);
    self.step = ko.observable(step);
    self.inverted = ko.observable(inverted);
}

var GraphicsCategoryVO = function (obj) {
    if (isNullOrUndefined(obj)) obj = {};
    if (isNullOrUndefined(obj.id)) obj.id = 'graphics-item-' + (new Date().getTime());
    if (isNullOrUndefined(obj.parendId)) obj.parendId = '';
    if (isNullOrUndefined(obj.name)) obj.name = '';
    if (isNullOrUndefined(obj.description)) obj.description = '';
    if (isNullOrUndefined(obj.thumb)) obj.thumb = '';
    if (isNullOrUndefined(obj.graphics)) obj.graphics = [];
    if (isNullOrUndefined(obj.categories)) obj.categories = [];
    if (isNullOrUndefined(obj.isCategory)) obj.isCategory = false;

    var self = this;
    self.id = ko.observable(obj.id);
    self.parendId = ko.observable(obj.parendId);
    self.name = ko.observable(obj.name);
    self.description = ko.observable(obj.description);
    self.thumb = ko.observable(obj.thumb);
    self.isCategory = ko.observable(obj.isCategory);

    var mappedGraphics = ko.utils.arrayMap(obj.graphics, function (item) {
        return new GraphicsCategoryVO(item);
    });
    self.graphics = ko.observable(mappedGraphics);

    var mappedCategories = ko.utils.arrayMap(obj.categories, function (item) {
        return new GraphicsCategoryVO(item);
    });
    self.categories = ko.observable(mappedCategories);

    self.children = ko.computed(function () {
        if (self.categories().length > 0) {
            return self.categories();
        }
        return self.graphics();
    });

    self.isImage = ko.computed(function () {
        return !self.isCategory();
    });

    self.isCategory = ko.computed(function () {
        return self.isCategory();
    });
}

var GraphicsFormatVO = function (updateHandler, colorize, fillColor, strokeColor, multicolor, complexColor, strokeWidth) {
    if (isNullOrUndefined(colorize)) colorize = false;
    if (isNullOrUndefined(fillColor)) fillColor = '#000000';
    if (isNullOrUndefined(strokeColor)) strokeColor = 'none';
    if (isNullOrUndefined(multicolor)) multicolor = false;
    if (isNullOrUndefined(strokeWidth)) strokeWidth = '1';

    var self = this;
    self.colorize = ko.observable(colorize);
    self.fillColor = ko.observable(fillColor);
    self.strokeColor = ko.observable(strokeColor);
    self.multicolor = ko.observable(multicolor);
    self.complexColor = ko.observable(new ComplexColorVO(updateHandler));
    self.strokeWidth = ko.observable(strokeWidth);
    self.transformation = ko.observable({});

    self.toObject = function () {
        var obj = {};
        obj['fill'] = self.fillColor();
        obj['stroke'] = self.strokeColor();
        obj['stroke-width'] = self.strokeWidth();
        return obj;
    }

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        if (!isNullOrUndefined(obj['stroke'])) {
            self.strokeColor(obj['stroke']);
        } else {
            self.strokeColor("none")
        }
        if (!isNullOrUndefined(obj['fill'])) {
            self.fillColor(obj['fill']);
        }
        if (!isNullOrUndefined(obj['complex-color'])) {
            self.complexColor().fromObject(obj['complex-color']);
        }
        self.colorize(obj['colorize'] ? true : false);
        self.multicolor(obj['multicolor'] ? true : false);

        if (!isNullOrUndefined(obj['transformation'])) {
            self.transformation(obj['transformation']);
        }
        if (!isNullOrUndefined(obj['stroke-width'])) {
            self.strokeWidth(obj['stroke-width']);
    }
    }
}

var PhotosVO = function (thumb, image) {
    var self = this;
    self.thumb = thumb;
    self.image = ko.observable(image);
}

var ObjectPropertiesVO = function (width, height, lockScale, id) {
    if (isNullOrUndefined(width)) width = 0;
    if (isNullOrUndefined(height)) height = 0;
    if (isNullOrUndefined(lockScale)) lockScale = true;
    if (isNullOrUndefined(id)) id = null;

    var self = this;
    self.width = ko.observable(width);
    self.height = ko.observable(height);
    self.lockScale = ko.observable(lockScale);
    self.id = ko.observable(id);
    self.suppressUpdate = false;

    self.toWidthObject = function () {
        var obj = {};
        obj['uwidth'] = self.width();
        obj['lockScale'] = self.lockScale();
        return obj;
    };

    self.toHeightObject = function () {
        var obj = {};
        obj['lockScale'] = self.lockScale();
        obj['uheight'] = self.height();
        return obj;
    };

    self.updateWidth = function (data, event) {
        if (event.keyCode == 13) {
            self.width(jQuery("#text-width").val());
        }
        return true;
    };

    self.updateHeight = function (data, event) {
        if (event.keyCode == 13) {
            self.height(jQuery("#text-height").val());
        }
        return true;
    };

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) {
            self.width(0);
            self.height(0);
            self.id(null);
            return;
        }
        if (!isNullOrUndefined(obj['uwidth']) && !isNullOrUndefined(obj['uheight'])) {
            self.suppressUpdate = true;
            self.width(obj['uwidth'].toFixed(2));
            self.height(obj['uheight'].toFixed(2));
            self.suppressUpdate = false;
        }
        if (!isNullOrUndefined(obj['lockScale'])) {
            self.lockScale(obj['lockScale']);
        }
        if (!isNullOrUndefined(obj['id'])) {
            self.id(obj['id']);
        }
    };
}

var ProductVO = function (id, categoryId, name, description, data, colors, locations, sizes, multicolor, namesNumbersEnabled, resizable, editableAreaSizes, minQuantity, pantones) {
    if (isNullOrUndefined(id)) id = 'product-' + (new Date().getTime());
    if (isNullOrUndefined(categoryId)) categoryId = 'product-category-' + (new Date().getTime());
    if (isNullOrUndefined(name)) name = '';
    if (isNullOrUndefined(description)) description = '';
    if (isNullOrUndefined(data)) data = {};
    if (isNullOrUndefined(colors)) colors = [];
    if (isNullOrUndefined(locations)) locations = [];
    if (isNullOrUndefined(sizes)) sizes = [];
    if (isNullOrUndefined(multicolor)) multicolor = false;
    if (isNullOrUndefined(namesNumbersEnabled)) namesNumbersEnabled = false;
    if (isNullOrUndefined(resizable)) resizable = false;
    if (isNullOrUndefined(editableAreaSizes)) editableAreaSizes = [];
    if (isNullOrUndefined(minQuantity)) minQuantity = minQuantity;
    if (isNullOrUndefined(pantones)) pantones = {};
    if (isNullOrUndefined(pantones.useForDecoration)) pantones.useForDecoration = false;
    if (isNullOrUndefined(pantones.useForDecoration)) pantones.useForProduct = false;

    var self = this;
    self.id = ko.observable(id);
    self.name = ko.observable(name);
    self.description = ko.observable(description);
    self.data = ko.observable(data);
    self.categoryId = ko.observable(categoryId);
    self.colors = ko.observableArray(colors);
    self.locations = ko.observableArray(locations);
    self.sizes = ko.observableArray(sizes);
    self.multicolor = ko.observable(multicolor);
    self.namesNumbersEnabled = ko.observable(namesNumbersEnabled);
    self.resizable = ko.observable(resizable);
    self.editableAreaSizes = ko.observableArray(editableAreaSizes);
    self.minQuantity = ko.observable(minQuantity);
    self.pantones = ko.observable({});
    self.pantones().useForDecoration = ko.observable(pantones.useForDecoration);
    self.pantones().useForProduct = ko.observable(pantones.useForProduct);

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        if (!isNullOrUndefined(obj['name'])) {
            self.name(obj['name']);
        }
        if (!isNullOrUndefined(obj['description'])) {
            self.description(obj['description']);
        }
        if (!isNullOrUndefined(obj['data'])) {
            self.data(obj['data']);
        }
        if (!isNullOrUndefined(obj['categoryId'])) {
            self.categoryId(obj['categoryId']);
        }
        if (!isNullOrUndefined(obj['colors'])) {
            self.colors(obj['colors']);
        }
        if (!isNullOrUndefined(obj['minQuantity'])) {
            self.minQuantity(obj['minQuantity']);
        }
        if (!isNullOrUndefined(obj['locations'])) {
            self.locations(obj['locations']);
        }
        if (!isNullOrUndefined(obj['sizes'])) {
            self.sizes(obj['sizes']);
        }
        if (!isNullOrUndefined(obj['multicolor'])) {
            self.multicolor(obj['multicolor']);
        }
        if (!isNullOrUndefined(obj['namesNumbersEnabled'])) {
            self.namesNumbersEnabled(obj['namesNumbersEnabled']);
        }
        if (!isNullOrUndefined(obj['resizable'])) {
            self.resizable(obj['resizable']);
        }
        if (!isNullOrUndefined(obj['editableAreaSizes'])) {
            self.editableAreaSizes(obj['editableAreaSizes']);
        } else {
            self.editableAreaSizes([]);
        }
        var pantones = {
            useForDecoration: false,
            useForProduct: false
        }
        if (!isNullOrUndefined(obj['pantones'])) {
            if (!isNullOrUndefined(obj['pantones'].useForDecoration)) {
                pantones.useForDecoration = obj['pantones'].useForDecoration;
            }
            if (!isNullOrUndefined(obj['pantones'].useForProduct )) {
                pantones.useForProduct  = obj['pantones'].useForProduct;
            }
        }
        self.pantones().useForDecoration(pantones.useForDecoration);
        self.pantones().useForProduct(pantones.useForProduct);

        if (!isNullOrUndefined(obj['id'])) {    //Put it last to not interfere with lib settings
            self.id(obj['id']);
        }
    }
}

var ProductCategoryVO = function (obj) {
    if (isNullOrUndefined(obj)) obj = {};
    if (isNullOrUndefined(obj.id)) id = 'product-category-' + (new Date().getTime());
    if (isNullOrUndefined(obj.name)) name = '';
    if (isNullOrUndefined(obj.thumbUrl)) thumbUrl = '';
    if (isNullOrUndefined(obj.products)) products = [];
    if (isNullOrUndefined(obj.categories)) obj.categories = [];
    if (isNullOrUndefined(obj.obj)) obj.obj = null;

    var self = this;
    self.id = ko.observable(obj.id);
    self.name = ko.observable(obj.name);
    self.thumbUrl = ko.observable(obj.thumbUrl);
    self.obj = ko.observable(obj);

    var mappedProducts = ko.utils.arrayMap(obj.products, function (item) {
        return new ProductCategoryVO(item);
    });
    self.products = ko.observableArray(mappedProducts);

    var mappedCategories = ko.utils.arrayMap(obj.categories, function (item) {
        return new ProductCategoryVO(item);
    });
    self.categories = ko.observableArray(mappedCategories);

    self.children = ko.computed(function () {
        if (self.categories().length > 0) {
            return self.categories();
        }
        return self.products();
    });

    self.isProduct = ko.computed(function () {
        return self.categories().length == 0 && self.products().length == 0;
    });

    self.isCategory = ko.computed(function () {
        return !self.isProduct();
    });
}

var ComplexColorVO = function (updateHandler, hexValue, name, colorizeList) {
    if (isNullOrUndefined(hexValue)) hexValue = '#000000';
    if (isNullOrUndefined(name)) name = 'Black';
    if (isNullOrUndefined(colorizeList)) colorizeList = [];

    var self = this;
    self.hexValue = ko.observable(hexValue);
    self.name = ko.observable(name);
    self.colorizeList = ko.observableArray(colorizeList);
    self.updateHandler = updateHandler;
    self.suppressUpdate = false;

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        self.suppressUpdate = true;
        if (!isNullOrUndefined(obj['name'])) {
            self.name(obj['name']);
        }
        if (!isNullOrUndefined(obj['value'])) {
            self.hexValue(obj['value']);
        }
        if (!isNullOrUndefined(obj['colorizeList']) && obj['colorizeList'].length && obj['colorizeInited']) {
            var colAr = [];
            for (var i = 0; i < obj['colorizeList'].length; i++) {
                var colEl = new ColorizeElementVO(self.updateHandler);
                colEl.fromObject(obj['colorizeList'][i]);
                colAr.push(colEl);
            }
            self.colorizeList(colAr);
        } else {
            self.colorizeList([]);
        }
        self.suppressUpdate = false;
    }

    self.toColorizeList = function () {
        var res = [];
        for (var i = 0; i < self.colorizeList().length; i++) {
            var colEl = self.colorizeList()[i];
            res.push({ id: colEl.id(), value: colEl.value() });
        }
        return res;
    }
}

var ProductSizeVO = function (width, height, label) {
    if (isNullOrUndefined(width)) width = 0;
    if (isNullOrUndefined(height)) height = 0;
    if (isNullOrUndefined(label)) label = "";

    var self = this;
    self.width = ko.observable(width);
    self.height = ko.observable(height);
    self.label = ko.observable(label);

    self.widthInput = ko.observable(width);
    self.heightInput = ko.observable(height);

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        if (!isNullOrUndefined(obj['width'])) {
            self.width(obj['width']);
        }
        if (!isNullOrUndefined(obj['height'])) {
            self.height(obj['height']);
        }
        if (!isNullOrUndefined(obj['editableAreaUnits']) && obj['editableAreaUnits'].length >= 2) {
            self.width(obj['editableAreaUnits'][0]);
            self.height(obj['editableAreaUnits'][1]);
        }
        if (!isNullOrUndefined(obj['label'])) {
            self.label(obj['label']);
        }

        self.widthInput(self.width());
        self.heightInput(self.height());
    }

    self.notEmpty = ko.computed(function () {
        return (self.width() != 0 && self.height() != 0)
    });
}


var RestrictionsVO = function (root, minQuantity) { // for future refactoring, now stuped hardhoded
    var self = this;
    if (isNullOrUndefined(minQuantity)) minQuantity = 0;

    self.minQuantity = ko.observable(minQuantity);
}

var ColorizeElementVO = function (updateHandler, value, name, colors, id) {
    if (isNullOrUndefined(id)) id = '';
    if (isNullOrUndefined(value)) value = '#000000';
    if (isNullOrUndefined(name)) name = 'Black';
    if (isNullOrUndefined(colors)) colors = [];

    var self = this;
    self.id = ko.observable(id);
    self.value = ko.observable(value);
    self.name = ko.observable(name);
    self.hidePantones = ko.observable(false);
    self.colors = ko.observableArray(colors);
    self.updateHandler = updateHandler;
    self.suppressUpdate = false;

    self.value.subscribe(function (newValue) {
        if (self.updateHandler && !self.suppressUpdate)
            updateHandler();
    });

    self.fromObject = function (obj) {
        if (isNullOrUndefined(obj)) return;

        self.suppressUpdate = true;
        if (!isNullOrUndefined(obj['id'])) {
            self.id(obj['id']);
        }
        if (!isNullOrUndefined(obj['name'])) {
            self.name(obj['name']);
        }
        if (!isNullOrUndefined(obj['value'])) {
            self.value(obj['value']);
        }
        if (!isNullOrUndefined(obj['colors'])) {
            self.colors(obj['colors']);
        }
        if (!isNullOrUndefined(obj['hidePantones'])) {
            self.hidePantones(obj['hidePantones']);
        } else {
            self.hidePantones(false);
        }
        self.suppressUpdate = false;
    }
}

var SizeQuantityVO = function (size, quantity, changeHandler) {
    if (isNullOrUndefined(size)) size = '';
    if (isNullOrUndefined(quantity)) quantity = 1;
    if (isNullOrUndefined(changeHandler)) changeHandler = function () { };

    var self = this;
    self.size = ko.observable(size);
    self.quantity = ko.observable(quantity);
    self.changeHandler = changeHandler;

    self.size.subscribe(function (newValue) {
        self.changeHandler();
    });

    self.quantity.subscribe(function (newValue) {
        var valid = !isNaN(newValue);
        if (parseInt(newValue) < 0 || !valid) {
            self.quantity(0);
        }
        self.changeHandler();
    });

    self.toObject = function () {
        var obj = {};
        obj.size = self.size();
        obj.quantity = self.quantity();
        return obj;
    }
}

var NameNumberVO = function (name, number, size, changeHandler) {
    if (isNullOrUndefined(name)) name = '';
    if (isNullOrUndefined(number)) number = '';
    if (isNullOrUndefined(size)) size = '';
    if (isNullOrUndefined(changeHandler)) changeHandler = function () { };

    var self = this;
    self.name = ko.observable(name);
    self.number = ko.observable(number);
    self.size = ko.observable(size);
    self.sizePrevValue = size; // to send in changeNNHandler handler


    self.changeNNHandler = changeHandler;


    self.name.subscribe(function (newValue) {
        self.changeNNHandler();
    });

    self.number.subscribe(function (newValue) {
        self.changeNNHandler();
    });

    self.size.subscribe(function (newValue) {
        self.changeNNHandler({
            size: newValue,
            prevSize: self.sizePrevValue
        });
        self.sizePrevValue = newValue;
    });

    self.toObject = function () {
        var obj = {};
        obj.name = self.name();
        obj.number = self.number();
        obj.size = self.size();
        return obj;
    }
}

var ImageColorCountVO = function (processColors, colorCount) {
    if (isNullOrUndefined(processColors)) processColors = false;
    if (isNullOrUndefined(colorCount)) colorCount = 0;

    var self = this;
    self.processColors = ko.observable(processColors);
    self.colorCount = ko.observable(colorCount);
    self.colorsList = ko.observableArray([]);
    self.maxColorsLimit = ko.observable(false);
    self.showAlert = ko.computed(function () {
        if (self.processColors())
            return false;
        return self.maxColorsLimit();
    });
    self.MAX_COLORS = 8;

    /*  Numeric stepper   */
    self.decreaseQuantity = function () {
        self.colorCount(self.colorCount() - 1);
    }
    self.increaseQuantity = function () {
        self.colorCount(self.colorCount() + 1);
    }
    self.colorCount.subscribe(function (newValue) {
        if (newValue > self.MAX_COLORS) {
            self.colorCount(self.MAX_COLORS);
        }
        if (newValue < 1) {
            self.colorCount(1);
        }
    });

    /*  Color Picker  */
    self.selectPrintedColors = function (data) {
        if (self.processColors())
            return;

        self.maxColorsLimit(false);
        var colorIdx = self.colorsList.indexOf(data.value)
        if (colorIdx > -1) {
            self.colorsList.splice(colorIdx, 1);
        } else if (self.colorsList().length < self.MAX_COLORS) {
            self.colorsList.push(data.value);
        } else {
            self.maxColorsLimit(true);
        }
    }

    self.toObject = function () {
        var obj = {};
        obj.processColors = self.processColors();
        obj.colorCount = self.colorCount();
        obj.colorsList = self.colorsList();
        return obj;
    }
}

/**
 * LiveArt ViewModel
 */

function LAControlsModel() {
    var self = this;
    self.isCompact = function () {
        return jQuery(window).width() < 900;
    };

    /**
     * PRODUCT BEGINS HERE
     */

    self.showProductSelector = ko.observable(false);

    // selected product value object
    self.selectedProductVO = ko.observable(new ProductVO());

    self.selectProduct = function (product) {
        if (product.id != self.selectedProductVO().id()) {
            self.selectedProductVO().fromObject(product);
        }
        liveartUI.closeActiveTab();
    };

    self.selectedProductVO().id.subscribe(function (id) {
        if (self.isCompact()) {
            liveartUI.closeActiveTab();
        }
        userInteract({ selectedProductId: id });
    });
   
    // product's selected color value object
    self.selectedProductColorVO = ko.observable(new ComplexColorVO(updateProductColorize));

    self.selectedProductColorVO().hexValue.subscribe(function (newValue) {
        if (!self.selectedProductColorVO().suppressUpdate) {
            userInteract({ selectedProductColor: newValue });
        }
    });

    self.showProductColorPicker = ko.computed(function () {
        return self.selectedProductVO().colors().length > 0 && !self.selectedProductVO().multicolor();
    });

    self.showChangeSizeAndColorTab = ko.computed(function () {
        // Show Because of Size logic:
        var becauseOfEditableAreaSizes = self.selectedProductVO().editableAreaSizes().length > 1;
        var becauseOfSizesInput = self.selectedProductVO().editableAreaSizes().length == 0 && self.selectedProductVO().resizable();
        var becauseOfSizes = becauseOfEditableAreaSizes || becauseOfSizesInput;

        // Show Because of Color logic:
        var becauseOfRaster = self.selectedProductVO().colors().length > 0 && !self.selectedProductVO().multicolor();
        var becauseOfMulticolor = self.selectedProductVO().multicolor() && self.selectedProductColorVO().colorizeList().length > 0;
        var becauseOfColors = becauseOfRaster || becauseOfMulticolor;
        // TODO: not so good solution
        setTimeout(updateMainMenuCount, 100);
        return becauseOfSizes || becauseOfColors;
    });

    //hack to force preload all fonts
    self.preloadFonts = function () {
        var container = jQuery('<div id="liveart-fonts-preloader-container"></div>').appendTo('#liveart-isolate-container');
        var fonts = self.fonts();
        var style;
        for (var i = 0; i < fonts.length; i++) {
            jQuery('<p style="font-family:' + fonts[i].fontFamily + '">' + fonts[i].fontFamily + '</div>').appendTo(container);
            if (fonts[i].boldAllowed) {
                style = "font-weight: bold;";
                jQuery('<p style="font-family:' + fonts[i].fontFamily + '; ' + style + '">' + fonts[i].fontFamily + '</div>').appendTo(container);
            }
            if (fonts[i].italicAllowed) {
                style = "font-style: italic;";
                jQuery('<p style="font-family:' + fonts[i].fontFamily + '; ' + style + '">' + fonts[i].fontFamily + '</div>').appendTo(container);
            }
            if (fonts[i].boldAllowed && fonts[i].italicAllowed) {
                style = "font-weight: bold; font-style: italic;";
                jQuery('<p style="font-family:' + fonts[i].fontFamily + '; ' + style + '">' + fonts[i].fontFamily + '</div>').appendTo(container);
            }
        }
    }

    // product's selected size value object
    self.selectedProductSizeVO = ko.observable(new ProductSizeVO());
    self.editableAreaRestrictRotation = ko.observable(false);
    self.switchedDimensions = ko.observable(false);

    self.selectedProductVO().id.subscribe(function () {
        if (self.selectedProductVO().resizable()
               && self.selectedProductVO().locations()[0]
               && self.selectedProductVO().locations()[0].editableAreaUnitsRestrictRotation) {
            self.editableAreaRestrictRotation(self.selectedProductVO().locations()[0].editableAreaUnitsRestrictRotation);
        } else {
            self.editableAreaRestrictRotation(false);
        }
    });

    self.selectedProductSizeVO().widthInput.subscribe(function (newValue) {
        self.changeProductSize(true, newValue);
    });

    self.selectedProductSizeVO().heightInput.subscribe(function (newValue) {
        self.changeProductSize(false, newValue);
    });

    self.changeProductSize = function (isWidthControl, newValue) {
        //vars
        //current dimension input
        var control = isWidthControl ? liveartUI.productDimensionsWidth : liveartUI.productDimensionsHeight;
        //current dimension bindable variable
        var dimensionVariable = isWidthControl ? self.selectedProductSizeVO().width : self.selectedProductSizeVO().height;
        //other dimension variable
        var otherVariable = isWidthControl ? self.selectedProductSizeVO().height : self.selectedProductSizeVO().width;


        //get valid min, max, step for current dimension before switchedDimensions
        var idx = Number(!(isWidthControl ^ self.switchedDimensions()));

        var min = 1;
        var max = 0;
        var step = 0;

        if (self.selectedProductVO().resizable()
                && self.selectedProductVO().locations()[0]
                && self.selectedProductVO().locations()[0].editableAreaUnitsRange) {
            min = self.selectedProductVO().locations()[0].editableAreaUnitsRange[idx][0];
            max = self.selectedProductVO().locations()[0].editableAreaUnitsRange[idx][1];
        }

        //editableAreaRestrictRotation logic: max values are different but don't depend on orientation
        if (!self.editableAreaRestrictRotation()) {
            var otherValue = otherVariable();
            //if valid - swap dimensions to be width longest side

            if (newValue > otherValue && otherValue <= max && otherValue >= min) {
                self.switchedDimensions(!isWidthControl);
            }
        }

        //get valid min, max, step for current dimension for validation after switchedDimensions
        idx = Number(!(isWidthControl ^ self.switchedDimensions()));

        if (self.selectedProductVO().resizable()
                && self.selectedProductVO().locations()[0]
                && self.selectedProductVO().locations()[0].editableAreaUnitsRange) {
            min = self.selectedProductVO().locations()[0].editableAreaUnitsRange[idx][0];
            max = self.selectedProductVO().locations()[0].editableAreaUnitsRange[idx][1];
            step = self.selectedProductVO().locations()[0].editableAreaUnitsRange[0][2];
        }
        
        /*  Validate Value - show tooltip if invalid or apply value otherwise */
        liveartUI.validationSuccess(control);

        //labels
        var l1Dimension = isWidthControl ?
            laTranslation.translateUI("WIDTH_DIMENSION") :
            laTranslation.translateUI("HEIGHT_DIMENSION");

        var l2Side = (isWidthControl ^ self.switchedDimensions()) ?
            laTranslation.translateUI("SHORT_SIDE") :
            laTranslation.translateUI("LONG_SIDE");

        if (isNaN(newValue)) {
            var translate = laTranslation.translateUI("INVALID_VALUE");
            liveartUI.validationError(control, translate);
        } else if (newValue < min) {
            var minWarningLabel = "";
            var minUnitVal = min + self.unitLabel();

            if (self.editableAreaRestrictRotation()) {
                minWarningLabel = laTranslation.translateUI("MINIMUM_DIMENSTION_TOOLTIP", { dimension: l1Dimension, value: minUnitVal });
            } else {
                minWarningLabel = laTranslation.translateUI("MINIMUM_SIDE_WIDTH_TOOLTIP", { side: l2Side, value: minUnitVal });
            }

            minWarningLabel = laTranslation.firstLetterUppercase(minWarningLabel);
            liveartUI.validationError(control, minWarningLabel);
        } else if (max > 0 && newValue > max) {
            var maxWarningLabel = "";
            var maxUnitVal = max + self.unitLabel();

            if (self.editableAreaRestrictRotation()) {
                maxWarningLabel = laTranslation.translateUI("MAXIMUM_DIMENSTION_TOOLTIP", { dimension: l1Dimension, value: maxUnitVal });
            } else {
                maxWarningLabel = laTranslation.translateUI("MAXIMUM_SIDE_WIDTH_TOOLTIP", { side: l2Side, value: maxUnitVal });
            }

            maxWarningLabel = laTranslation.firstLetterUppercase(maxWarningLabel);
            liveartUI.validationError(control, maxWarningLabel);
        } else if (step > 0 && newValue % step != 0) {
            var stepUnitVal = step + self.unitLabel();
            var minStep = laTranslation.translateUI("MINIMUM_STEP", { value: stepUnitVal });

            minStep = laTranslation.firstLetterUppercase(minStep);
            liveartUI.validationError(control, minStep);
        } else {
            dimensionVariable(newValue);
            userInteract({ selectedProductSize: { width: self.selectedProductSizeVO().width(), height: self.selectedProductSizeVO().height() } });
        }
    }

    self.selectedProductDimensionsSwap = function () {
        var w = self.selectedProductSizeVO().width();
        self.selectedProductSizeVO().width(self.selectedProductSizeVO().height());
        self.selectedProductSizeVO().height(w);

        self.switchedDimensions(!self.switchedDimensions());

        self.selectedProductSizeVO().widthInput(self.selectedProductSizeVO().width());
        self.selectedProductSizeVO().heightInput(self.selectedProductSizeVO().height());

        userInteract({ selectedProductSize: { width: self.selectedProductSizeVO().width(), height: self.selectedProductSizeVO().height() } });
    }

    self.selectedProductWidthInputBlur = function () {
        if (self.selectedProductSizeVO().widthInput() != self.selectedProductSizeVO().width()) {
            self.selectedProductSizeVO().widthInput(self.selectedProductSizeVO().width());
        }
    }

    self.selectedProductHeightInputBlur = function () {
        if (self.selectedProductSizeVO().heightInput() != self.selectedProductSizeVO().height()) {
            self.selectedProductSizeVO().heightInput(self.selectedProductSizeVO().height());
        }
    }

    self.selectProductSize = function (size) {
        self.selectedProductSizeVO().width(size.width);
        self.selectedProductSizeVO().height(size.height);
        self.selectedProductSizeVO().label(size.label);

        userInteract({
            selectedProductSize: {
                width: self.selectedProductSizeVO().width(),
                height: self.selectedProductSizeVO().height(),
                label: self.selectedProductSizeVO().label()
            }
        });
    }

    // product's selected location
    self.selectedProductLocation = ko.observable();

    self.selectProductLocation = function (location) {
        self.selectedProductLocation(location.name);
    }

    self.selectedProductLocation.subscribe(function (newValue) {
        userInteract({ selectedProductLocation: newValue });
    });

    function updateProductColorize() {
        userInteract({ selectedProductColorize: self.selectedProductColorVO().toColorizeList() });
    }

    /**
     * PRODUCT ENDS HERE
     */


    /**
     * PRODUCT CATEGORY BEGINS HERE
     */

    //variables
    self.productRootCategory = ko.observable(new ProductCategoryVO({ id: 'root' }));
    self.productSelectedCategories = ko.observableArray();
    self.productCurrentCategory = ko.computed(function () {
        if (!self.productSelectedCategories() || self.productSelectedCategories().length < 1)
            return new ProductCategoryVO();

        var lastCatIdx = self.productSelectedCategories().length - 1;
        return self.productSelectedCategories()[lastCatIdx];
    });

    self.productList = [];
    self.extractProducts = function (category) {
        var categories = category.categories();
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            self.extractProducts(cat);
        }
        var products = category.products();
        if (products) {
            for (var g = 0; g < products.length; g++) {
                self.productList.push(products[g]);
            }
        }
    }
    self.productRootCategory().categories.subscribe(function (categories) {
        self.productList = [];
        self.extractProducts(self.productRootCategory());
    });

    //functons
    self.parseProducts = function (rootCategories) {
        var mappedData = ko.utils.arrayMap(rootCategories, function (item) {
            return new ProductCategoryVO(item);
        });
        self.productRootCategory().categories(mappedData);
        self.productSelectedCategories([self.productRootCategory()]);
    };
    self.selectProductItem = function (item) {
        if (item.isProduct()) {
            if (item.id()) {
                self.selectProduct(item.obj());
            }
            return;
        }
        self.productSelectedCategories.push(item);
    };
    self.openProductCategory = function (category) {
        if (!category) return;
        if (!category.id) return;
        if (self.productRootCategory().id() == category.id) {
            self.productSelectedCategories([self.productRootCategory()]);
        } else if (!self.productRootCategory()) {
            return;
        } else {
            var foundPath = self.findCategory(category.id, self.productRootCategory().children());
            if (foundPath.length > 0) {
                self.productSelectedCategories([self.productRootCategory()].concat(foundPath));
            }
        }
    };

    self.findCategory = function (id, categories) {
        var category = null;
        var i = 0;
        var subPath = [];
        while (!category && subPath.length == 0 && i < categories.length) {
            if (categories[i].isCategory()) {
                if (categories[i].id() == id) {
                    category = categories[i];
                } else {
                    subPath = self.findCategory(id, categories[i].children());
                    if (subPath.length > 0) {
                        category = categories[i];
                    }
                }
            }
            i++;
        }
        if (category) {
            return [category].concat(subPath);
        } else {
            return [];
        }
    }
    self.backProductsItem = function () {
        if (!self.productSelectedCategories() || self.productSelectedCategories().length < 1)
            return;

        self.productSelectedCategories.pop();
    };

    //search
    self.productsSearchQuery = ko.observable("");
    self.productsSearchResult = ko.observableArray();

    self.productSearchPartFinished = function (query) {
        self.productsSearchResult.notifySubscribers();
        return query == self.productsSearchQuery().toLowerCase();
    }
    self.productItemProcessor = function (query, productItem) {
        if (productItem && query == self.productsSearchQuery().toLowerCase()) {
            //query match condition
            var words = query.split(" ");
            var match = true;
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                if (word.length) {
                    match = match && productItem.name.toLowerCase().indexOf(word) > -1;
                }
            }
            if (match) {
                self.productsSearchResult().push(new ProductCategoryVO(productItem));
            }

        }
    }
    self.productsSearchQuery.subscribe(function (query) {
        self.productsSearchResult([]);
        self.productSelectedCategories([self.productRootCategory()]);
        self.search(query, self.productList, 100, self.productItemProcessor, self.productSearchPartFinished);
    });
    self.clearProductsSearch = function () {
        self.productsSearchQuery("");
    };

    //breadcrumbs
    self.productBreadcrumbsRender = function () {
        var str = laTranslation.translateUI("ALL_CATEGORIES");
        ko.utils.arrayForEach(self.productSelectedCategories(), function (item) {
            if (item.id() != 'root')
                str += " / " + item.name();
        });

        if (self.productsSearchQuery().length > 0) {
            str = laTranslation.translateUI("SEARCH");
        }
            
        return str;
    };

    //main function
    self.currentProducts = ko.computed(function () {
        var query = self.productsSearchQuery().toLowerCase();
        var searchRes = self.productsSearchResult();
        var result = [];

        if (query.length > 0) {
            result = searchRes;
        } else {
            result = self.productCurrentCategory().children();
        }

        return result;
    });

    /**
     * PRODUCT CATEGORY ENDS HERE
     */



    /**
     * PRODUCT PRICES BEGIN HERE
     */

    self.prices = ko.observableArray();

    /**
     * PRODUCT PRICES END HERE
     */

    /**
     * PRODUCT DATA BEGIN HERE
     */

    self.data = ko.observableArray();

    /**
     * PRODUCT DATA END HERE
     */


    /**
     * PRODUCT SIZES & QUANTITIES BEGIN HERE
     */

    self.sizes = ko.observableArray();

    // Using for SizeQuantityVO objects
    self.quantities = ko.observableArray();

    self.quantities.subscribe(function (newValue) {
        updateQuantities();
    });

    self.canRemoveSize = ko.computed(function () {
        return self.selectedProductVO().sizes().length > 0 && self.quantities().length > 1;
    });

    self.addQuantityBaseOnSize = function (size) {
        var sqVO = new SizeQuantityVO(size, 1, updateQuantities);
        self.quantities.push(sqVO);
        return sqVO;
    }

    self.addQuantity = function () { // executed as button handler, so first param - context
        var size = self.selectedProductVO().sizes().length > 0 ? self.selectedProductVO().sizes()[0] : '';
        return self.addQuantityBaseOnSize(size);
    };



    self.removeQuantity = function (line, clickEvent) {
        var q = parseInt(line.quantity());
        var decreaseStep = -q; // decrease to -q for set quantity to zero before delete

        self.changeQuantity(line, decreaseStep, clickEvent, {
            ignoreTotal: false,
            removeZero: true // if set zero quantity success, line will deleted
        });

    };

    self.increaseQuantity = function (line) {
        self.changeQuantity(line, 1);
    };

    self.decreaseQuantity = function (line, clickEvent, changeQuantityOptions) {
        self.changeQuantity(line, -1, clickEvent, changeQuantityOptions);
    };

    self.changeQuantity = function (line, number1, clickEvent, changeQuantityOptions) {
        if (!changeQuantityOptions) changeQuantityOptions = { ignoreTotal: false, removeZero: false };

        var r = parseInt(line.quantity());
        var totalQ = self.totalQuantity();
        var totalAfterUpdate = parseInt(totalQ + number1);
        var rAfterUpdate = r + number1;

        var nameNumberMin = nnQuantitySynchronizer.getMinQuantity(line);

        if (rAfterUpdate >= nameNumberMin && (changeQuantityOptions.ignoreTotal || totalAfterUpdate >= self.restrictions().minQuantity())) {
            if (rAfterUpdate < 0) {
                rAfterUpdate = 0;
            }
            line.quantity(rAfterUpdate);
        }

    };    

    self.getQuantity = function () {
        var dataToSave = jQuery.map(self.quantities(), function (item) {
            return item.quantity() > 0 ? item.toObject() : undefined
        });
        self.addAlert(JSON.stringify(dataToSave), "info");
    };

    self.totalQuantity = ko.computed(function () {// summ of all size.qountityes
        var total = 0;
        ko.utils.arrayForEach(self.quantities(), function (q) {
            total += q.quantity();
        });
        return total;
    });


    function updateQuantities() {
        var minQuantity = self.selectedProductVO().minQuantity();
        var totalQuantity = 0;
        var quantities = jQuery.map(controlsModel.quantities(), function (item) {
            totalQuantity += item.quantity();
            return item.toObject();
        });
        if (totalQuantity < minQuantity) {
            jQuery("#place-order-btn").addClass("disabled");
            
            var translation = laTranslation.translateUI("MINIMUM_ORDER_QUANTITY", { name: self.selectedProductVO().name(), minQuantity: minQuantity });
            jQuery("#place-order-wrapper[data-toggle='tooltip']").tooltip('enable').attr('data-original-title', translation);
        } else {
            jQuery("#place-order-btn").removeClass("disabled");
            jQuery("#place-order-wrapper[data-toggle='tooltip']").tooltip('disable');
        }
        userInteract({ updateQuantities: quantities });
    }

    /**
     * PRODUCT SIZES & QUANTITIES BEGIN HERE
     */

    /**
     * NAMES & HUMBERS BEGIN HERE
     */

    self.addNameNumberObj = function (type) {
        liveartUI.resetFocusToTextTab = false;
        if (self.namesNumbers().length == 0) {
            jQuery('#add-names-form').addClass('expanded');
        }

        if(self.isCompact()) jQuery("#add-names-info").show();
        if (type == "name") {
            jQuery("#add-names-info").text("Name is added!");
            userInteract({ addNameObj: self.selectedLetteringVO().toObject() });
        } else {
            jQuery("#add-names-info").text("Number is added!");
            userInteract({ addNumberObj: self.selectedLetteringVO().toObject() });
        }
        setTimeout(function () {
            jQuery('#names-number-table input').first().focus();
        }, 200);
    }

    self.removeMobileNamesNumbersTooltip = function () {
        jQuery("#add-names-info").hide();
    }

    self.namesNumbers = ko.observableArray();
    
    self.namesNumbers.subscribe(function (newValue) {
        updateNamesNumbers();
    });

    self.canRemoveNameNumber = ko.computed(function () {
        return self.namesNumbers().length > 1;
    });

    self.addNameNumber = function () {
        var size = self.selectedProductVO().sizes().length > 0 ? self.selectedProductVO().sizes()[0] : '';
        var newNN = new NameNumberVO("", "", size, updateNamesNumbers);
        self.namesNumbers.push(newNN);
        nnQuantitySynchronizer.onAddNameNumberLine(newNN);
    };

    self.removeNameNumber = function (line) {
        self.namesNumbers.remove(line)
        nnQuantitySynchronizer.onRemovedNameNumberLine(line);
    };

    self.removeAllNameNumbers = function () {
        if (self.namesNumbers == null) return;// nothing to do
        if (!self.selectedProductVO().namesNumbersEnabled()) return;// nothing to do
        while (self.namesNumbers().length > 0) {
            var nnLine = self.namesNumbers()[0];// get first line
            self.removeNameNumber(nnLine);
        }
    }

    function updateNamesNumbers(newNameNumberValue) {
        if (typeof (newNameNumberValue) !== "undefined") {

            if (("size" in newNameNumberValue)) {
                nnQuantitySynchronizer.onNameNumberSizeChanged(newNameNumberValue);
            }

        }


        var namesNumbers = jQuery.map(controlsModel.namesNumbers(), function (item) {
            return item.toObject();
        });
        userInteract({ updateNamesNumbers: namesNumbers });
        nnQuantitySynchronizer.onNamesNumbersChanged();
    }
    self.isValidNameNumber = function (nameNumber) {
        var name = nameNumber.name();
        var validName = false;
        if (name) {
            validName = name.match(/\S/) ? name.match(/\S/).length > 0 : false;
        }

        var number = nameNumber.number();
        var validNumber = false;
        if (number) {
            validNumber = number.match(/\S/) ? number.match(/\S/).length > 0 : false;
        }
        return validName || validNumber;
    }

    /**
     * NAMES & HUMBERS END HERE
     */

    /**
     * COLORS AND FONTS BEGIN HERE
     */

    // list of available fonts for letterings
    self.fonts = ko.observableArray();

    // name of selected font
    self.selectedFont = ko.computed(function () {
        var fonts = self.fonts();
        for (var i = 0; i < fonts.length; i++) {
            if (self.selectedLetteringVO().formatVO().fontFamily() == fonts[i].fontFamily) {
                return fonts[i];
            }
        }
        return { name: "", fontFamily: "", boldAllowed: true, italicAllowed: true };
    });


    // set font family
    self.selectFont = function (fontVO) {
        var formatVo = self.selectedLetteringVO().formatVO(); // short alias
        formatVo.fontFamily(fontVO.fontFamily);

        // uncheck bold/italic if new font not allowed it
        if (!fontVO.boldAllowed) formatVo.bold(false);
        if (!fontVO.italicAllowed) formatVo.italic(false);

    }

    // list of available fill colors for graphics and letterings
    self.colors = ko.observableArray();
    
    // list of available stroke colors for graphics and letterings
    self.strokeColors = ko.observableArray();

    /**
     * COLORS AND FONTS END HERE
     */

    /**
  * GRAPHICS CATEGORY BEGINS HERE
  */
   
    // tree if graphics categories
    self.graphicRootCategory = ko.observable(new GraphicsCategoryVO({ id: 'root' }));

    // list of graphics categories
    self.graphicCatalogBreadcrumbs = ko.observableArray();

    //selected graphics category
    self.graphicCurrentCategory = ko.computed(function () {
        if (!self.graphicCatalogBreadcrumbs() || self.graphicCatalogBreadcrumbs().length < 1)
            return new GraphicsCategoryVO();

        var lastCatIdx = self.graphicCatalogBreadcrumbs().length - 1;
        return self.graphicCatalogBreadcrumbs()[lastCatIdx];
    });

    //initialisation of graphic categories
    self.graphicCatalogLoaded = function (rootCategories) {
        var mappedData = ko.utils.arrayMap(rootCategories, function (item) {
            return new GraphicsCategoryVO(item);
        });
        self.graphicRootCategory().categories(mappedData);
        self.graphicCatalogBreadcrumbs([self.graphicRootCategory()]);
    };

    // list of all Graphics items. Uses for searching
    self.graphicsList = [];

    self.extractGraphics = function (category) {
        var categories = category.categories();
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            self.extractGraphics(cat);
        }
        var graphics = category.graphics();
        if (graphics) {
            for (var g = 0; g < graphics.length; g++) {
                self.graphicsList.push(graphics[g]);
            }
        }
    }
    self.graphicRootCategory().categories.subscribe(function (categories) {
        self.graphicsList = [];
        self.extractGraphics(self.graphicRootCategory());
    });

   
    //handlers - click on categories/graphics
    self.selectGraphicItem = function (categoryItem) {
        if (categoryItem.isImage()) {
            if (categoryItem.id()) {
                jQuery("#image-added-info").show();
                userInteract({ addGraphics: categoryItem.id() });
            }
            return;
        }
        self.graphicCatalogBreadcrumbs.push(categoryItem);
    };

    self.removeMobileAddedGraphicsTooltip = function () {
        jQuery("#image-added-info").hide();
    }

    //handlers - back button
    self.backGraphicItem = function () {
        if (!self.graphicCatalogBreadcrumbs() || self.graphicCatalogBreadcrumbs().length < 1)
            return;

        self.graphicCatalogBreadcrumbs.pop();
    };

    //back button visibility
    self.graphicSelectedSubcategory = ko.computed(function () {
        if (!self.graphicCatalogBreadcrumbs() || self.graphicCatalogBreadcrumbs().length < 1)
            return true;

        return self.graphicCatalogBreadcrumbs().length > 1;
    });

    //Search
    self.graphicsSearchQuery = ko.observable("");
    self.searchGraphicsResult = ko.observableArray();
        

    self.graphicsItemProcessor = function (query, graphicItem) {
        if (graphicItem && query == self.graphicsSearchQuery().toLowerCase()) {
            //query match condition
            var words = query.split(" ");
            var match = true;
            for (var i = 0; i < words.length; i++) {
                var word = words[i];
                if (word.length) {
                    var localMatch = graphicItem.name.toLowerCase().indexOf(word) > -1 || graphicItem.description.toLowerCase().indexOf(word) > -1;
                    match = localMatch && match;
                }
            }
            if (match) {
                self.searchGraphicsResult().push(new GraphicsCategoryVO(graphicItem));
            }
        }
    }
    self.graphicSearchPartFinished = function(query){
        self.searchGraphicsResult.notifySubscribers();
        return query == self.graphicsSearchQuery().toLowerCase();
    }

    self.graphicsSearchQuery.subscribe(function (query) {
        self.searchGraphicsResult([]);
        self.graphicCatalogBreadcrumbs([self.graphicRootCategory()]);
        self.search(query, self.graphicsList, 100, self.graphicsItemProcessor, self.graphicSearchPartFinished);
    });

    self.clearGraphicsSearch = function () {
        self.graphicsSearchQuery("");
    }

    //breadcrumbs to string
    self.graphicBreadcrumbsString = ko.computed(function () {
        var str = laTranslation.translateUI("ALL_CATEGORIES");
        ko.utils.arrayForEach(self.graphicCatalogBreadcrumbs(), function (item) {
            if (item.id() != 'root')
                str += " / " + item.name();
        });

        if (self.graphicsSearchQuery().length > 0)
            str = laTranslation.translateUI("SEARCH");
        return str;
    });

    //Current graphcis - selected category or search result
    self.currentGraphics = ko.computed(function () {
        var query = self.graphicsSearchQuery().toLowerCase();
        var searchRes = self.searchGraphicsResult();
        var result = [];

        if (query.length > 0) {
            result = searchRes;
        } else {
            result = self.graphicCurrentCategory().children();
        }

        return result;
    });

    /**
     * GRAPHICS CATEGORY ENDS HERE
     */


    /**
     * SEARCH ENDINE BEGINS HERE
     */
    /*
    * query - string - value to search
    * items - array - list of items where to search
    * step - number - count of items to process for one iteration
    * itemProcessor - function - this function is called for every item with args:(query, item)
    * onPartFinish - function - this function is called after each iteration. If returns false - stop searching process
    * curPosition - number - default = 0. Position of the first element for a new iteartion
    */
    self.search = function (query, items, step, itemProcessor, onPartFinish, curPosition) {
        query = query.toLowerCase();
        if (!curPosition) curPosition = 0;
        var lastPosition = Math.min(items.length, curPosition + step);

        setTimeout(function () {
            for (var i = curPosition; i < lastPosition; i++) {
                var itemToProcess = items[i];
                itemToProcess = ko.toJS(itemToProcess);
                itemProcessor(query, itemToProcess);
            }
            // return true if continue
            var shouldContinue = onPartFinish(query);
            if (shouldContinue && lastPosition != items.length) {
                self.search(query, items, step, itemProcessor, onPartFinish, lastPosition);
            }
        }, 1);
    }
    /**
     * SEARCH ENDINE ENDS HERE
     */

    /**
     * SELECTED OBJECT BEGINS HERE
     */

    // selected object's type
    // can be 'none' (no object is selected), 'text' or 'graphic'
    self.selectedObjectType = ko.observable('none');

    // return true if some object is selected
    self.hasSelected = ko.computed(function () { return self.selectedObjectType() != 'none'; });

    // return true if selected object is text
    self.selectedIsText = ko.computed(function () { return self.selectedObjectType() == 'text'; });


    // return true if selected object is graphics
    self.selectedIsGraphics = ko.computed(function () { return self.selectedObjectType() == 'graphics'; });

    self.selectedObjectPropertiesVO = ko.observable(new ObjectPropertiesVO());

    self.selectedObjectPropertiesVO().width.subscribe(function (value) {
        if (!self.selectedObjectPropertiesVO().suppressUpdate) {
            userInteract({ updateObject: self.selectedObjectPropertiesVO().toWidthObject() });
        }
    });

    self.selectedObjectPropertiesVO().height.subscribe(function (value) {
        if (!self.selectedObjectPropertiesVO().suppressUpdate) {
            userInteract({ updateObject: self.selectedObjectPropertiesVO().toHeightObject() });
        }
    });

    self.selectedObjectPropertiesVO().lockScale.subscribe(function (value) {
        if (!self.selectedObjectPropertiesVO().suppressUpdate) {
            userInteract({
                lockProportions: value
            });
        }
    });

    self.selectedObjectDPUExceeded = ko.observable(false);

    /**
     * LETTERING OBJECT BEGINS HERE
     */

    // selected lettering value object
    self.selectedLetteringVO = ko.observable(new LetteringVO());

    // public function that forces LiveArt to add new text
    self.addText = function () {
        if (self.isCompact()) {
            liveartUI.closeActiveTab();
        }
        userInteract({ addText: self.selectedLetteringVO().toObject() });
    };

    self.selectedLetteringVO().text.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().fontFamily.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().fillColor.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().bold.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().italic.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().strokeColor.subscribe(function (value) {
        updateText();
    });

    /*self.selectedLetteringVO().formatVO().textEffectCombined.subscribe(function (value) {
        if (self.skipUpdateToUi)
            return;
        updateText();
    });*/

    self.selectedLetteringVO().formatVO().letterSpacing.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().lineLeading.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().strokeWidth.subscribe(function (value) {
        updateText();
    });

    self.selectedLetteringVO().formatVO().textAlign.subscribe(function (newValue) {
        updateText();
    });

    self.editTextEnabled = ko.computed(function () {
        return !(self.selectedLetteringVO().isNames() || self.selectedLetteringVO().isNumbers());
    });

    self.letterSpacingEnabled = ko.observable(false);
    self.lineLeadingEnabled = ko.observable(false);

    // private function that informs LiveArt about change in letterings (fill, stroke, bold, italic, etc.)
    self.suppressTextUpdate = false;
    function updateText() {
        if (self.selectedObjectType() == 'text' && !self.suppressTextUpdate) {
            userInteract({ updateText: self.selectedLetteringVO().toObject() });
        }
    }

    /**
     * LETTERING OBJECT ENDS HERE
     */

    /**
 * TEXT EFFECT START 
 */
    self.textEffects = ko.observableArray([]);
    self.selectedTextEffectVO = ko.observable(new TextEffectVO());

    self.selectedTextEffectCombined = ko.computed(function () {
        return self.selectedTextEffectVO().name() + self.selectedTextEffectVO().value();
    });//.extend({ throttle: 200 });

    self.selectedTextEffectCombined.subscribe(function (value) {
        if (self.skipUpdateToUi) return;

        self.updateTextEffect();
    });

    //UI to selected text effect
    //Currently - reset effects after deselecting
    self.resetTextEffect = function (effect) {
        self.suppressUpdateTextEffect = true;
        if (effect) {
            self.selectedTextEffectVO().inverted(effect.max() < 0);
            self.selectedTextEffectVO().name(effect.name());
            self.selectedTextEffectVO().label(effect.label());
            self.selectedTextEffectVO().paramName(effect.paramName());
            self.selectedTextEffectVO().min(Math.abs(effect.min()));
            self.selectedTextEffectVO().max(Math.abs(effect.max()));
            self.selectedTextEffectVO().step(effect.step());
            self.selectedTextEffectVO().value(Math.abs(effect.min()).toFixed(2));
        } else {
            self.selectedTextEffectVO().name("none");
            self.selectedTextEffectVO().label("None");
            self.selectedTextEffectVO().value("0");
            self.skipUpdateToUi = true;
            self.selectedLetteringVO().formatVO().textEffect("none");
            self.selectedLetteringVO().formatVO().textEffectValue("0");
            self.skipUpdateToUi = false;
        }
        self.suppressUpdateTextEffect = false;

        //if (self.selectedObjectType() === "text")
        //    self.updateTextEffect();
    }

    //From UI to LetteringVO
    self.suppressUpdateTextEffect = false;
    self.updateTextEffect = function () {
        if (self.suppressUpdateTextEffect) return;
        if (self.selectedTextEffectVO().name() != 'none' && self.selectedTextEffectVO().name() != 'arcUp' && self.selectedTextEffectVO().name() != 'arcDown') {
            self.suppressTextUpdate = true;
            self.selectedLetteringVO().formatVO().letterSpacing(0);
            self.suppressTextUpdate = false;
        }

        self.skipUpdateToUi = true;
        self.selectedLetteringVO().formatVO().textEffect(self.selectedTextEffectVO().name());
        self.selectedLetteringVO().formatVO().textEffectValue(self.selectedTextEffectVO().inverted() ? 0 - self.selectedTextEffectVO().value() : self.selectedTextEffectVO().value());
        self.skipUpdateToUi = false;

        //called on change effect or change slider value - will update 2 arguments per call
        updateText();
    }

    self.skipUpdateToUi = false;
    //From LetteringVO to UI after parseObject
    self.setTextEffect = function () {
        var effectName = self.selectedLetteringVO().formatVO().textEffect();
        if (effectName == 'none') {
            self.selectedTextEffectVO().name('none');
        } else {
            self.skipUpdateToUi = true;
            for (var i = 0; i < self.textEffects().length; i++) {
                if (self.textEffects()[i].name() == effectName) {
                    var effect = self.textEffects()[i];
                    self.selectedTextEffectVO().inverted(effect.max() < 0);
                    self.selectedTextEffectVO().name(effect.name());
                    self.selectedTextEffectVO().label(effect.label());
                    self.selectedTextEffectVO().paramName(effect.paramName());
                    self.selectedTextEffectVO().min(Math.abs(effect.min()));
                    self.selectedTextEffectVO().max(Math.abs(effect.max()));
                    self.selectedTextEffectVO().step(effect.step());
                    //self.selectedTextEffectVO().value(Math.abs(effect.value()));
                }
            }

            self.selectedTextEffectVO().value(Math.abs(self.selectedLetteringVO().formatVO().textEffectValue()).toFixed(2));
            var v = self.selectedTextEffectVO().value();
            var n = self.selectedTextEffectVO().name();
            self.skipUpdateToUi = false;
        }
        self.suppressUpdateTextEffect = false;
    }

    self.selectTextEffect = function (data) {
        var effectName = ko.utils.unwrapObservable(data.name);

        self.skipUpdateToUi = true;
        for (var i = 0; i < self.textEffects().length; i++) {
            if (self.textEffects()[i].name() == effectName) {
                var effect = self.textEffects()[i];
                self.selectedTextEffectVO().inverted(effect.max() < 0);
                self.selectedTextEffectVO().name(effect.name());
                self.selectedTextEffectVO().label(effect.label());
                self.selectedTextEffectVO().paramName(effect.paramName());
                self.selectedTextEffectVO().min(Math.abs(effect.min()));
                self.selectedTextEffectVO().max(Math.abs(effect.max()));
                self.selectedTextEffectVO().step(effect.step());
                self.selectedTextEffectVO().value(Math.abs(effect.min()));
                break;
            }
        }

        //self.selectedTextEffectVO().value(Math.abs(self.selectedLetteringVO().formatVO().textEffectValue()).toFixed(2));
        var v = self.selectedTextEffectVO().value();
        var n = self.selectedTextEffectVO().name();
        self.skipUpdateToUi = false;
        self.suppressUpdateTextEffect = false;

        self.updateTextEffect();
    }

    self.showTextEffects = ko.computed(function () {
        return self.textEffects().length > 1;
    });

    self.showEffectsSlider = ko.computed(function () {
        return self.showTextEffects() && (self.selectedTextEffectVO().name() != "none");
    });

    self.showLetterSpacingSlider = ko.computed(function () {
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        var spacingAvailable = self.selectedTextEffectVO().name() == "none" || self.selectedTextEffectVO().name() == "arcUp" || self.selectedTextEffectVO().name() == "arcDown";
        return (!isFirefox && spacingAvailable);
    });

    self.showLineLeadingSlider = ko.computed(function () {
        var spacingAvailable = self.selectedTextEffectVO().name() == "none" || self.selectedTextEffectVO().name() == "arcUp" || self.selectedTextEffectVO().name() == "arcDown";
        return (self.selectedLetteringVO().text().split("\n").length > 1) && spacingAvailable;
    });

    self.showStrokeAmountSlider = ko.computed(function () {
        return self.selectedLetteringVO().formatVO().strokeColor() !== 'none';
    });

    self.textAlignEnabled = ko.computed(function () {
        return self.selectedTextEffectVO().name() == "none" || self.selectedTextEffectVO().name() == "arcUp" || self.selectedTextEffectVO().name() == "arcDown";
    });

    /**
     * TEXT EFFECT END 
     */

    /**
     * GRAPHICS OBJECT BEGINS HERE
     */

    // selected graphics format value object
    self.selectedGraphicsFormatVO = ko.observable(new GraphicsFormatVO(updateGraphicsColorize));

    // boolean value that shows whether selected object is a colorizable graphics object
    self.isColorizableGraphics = ko.computed(function () {
        return (self.selectedIsGraphics() && self.selectedGraphicsFormatVO().colorize());
    });

    self.isMulticolorGraphics = ko.computed(function () {
        return (self.selectedIsGraphics() && self.selectedGraphicsFormatVO().multicolor());
    });

    self.selectedGraphicsFormatVO().strokeColor.subscribe(function (value) {
        updateGraphics();
    });

    self.selectedGraphicsFormatVO().strokeWidth.subscribe(function (value) {
        updateGraphics();
    });

    self.selectedGraphicsFormatVO().fillColor.subscribe(function (value) {
        updateGraphics();
    });

    self.addAnotherArtwork = function () {
        userInteract({ deselectObject: true });
        liveartUI.showGraphicsForm();
    }

    // private function that informs LiveArt about change in graphics (fill, stroke, etc.)
    function updateGraphics() {
        if (self.isCompact()) {
            liveartUI.closeActiveTab();
        }
        userInteract({ updateGraphics: self.selectedGraphicsFormatVO().toObject() });
    }

    function updateGraphicsColorize() {
        userInteract({ selectedGraphicsColorize: self.selectedGraphicsFormatVO().complexColor().toColorizeList() });
    }
    self.socialShowUploadConditions = function (image) {
        self.customImageUrl(image);
        self.showUploadConditions("social");
    }

    self.showUploadConditions = function (type) {
        if (type == 'url' && self.customImageUrl().length == 0) return;

        self.customImageType(type);
        jQuery("#liveart-upload-conditions-popup").modal("show");
    }

    self.strictTemplate = ko.observable(false);

    self.customImageType = ko.observable('');

    self.userAcceptsConditions = ko.observable(false);
    self.addCustomImage = function () {
        if (self.userAcceptsConditions()) {
            jQuery("#liveart-upload-conditions-popup").modal("hide");
            var type = self.customImageType();
            if (type == 'url') {
                self.addImageByUrl();
            } else if (type == 'upload') {
                self.uploadImage();
            } else if (type == 'social') {
                self.addImageByUrl();
                self.customImageUrl("");
            } else {
                self.addPhoto(type);
            }
            self.customImageType('');
            self.userAcceptsConditions(false);
        }
    }

    self.uploadImage = function () {
        jQuery("#fileupload").trigger("click");
    }

    self.addUploadedImage = function (url) {
        if (self.isCompact()) {
            liveartUI.closeActiveTab();
        }
        userInteract({
            uploadGraphics: url
        });
    }

    self.customImageUrl = ko.observable("");

    self.addImageByUrl = function () {
        if (self.customImageUrl().length > 0) {
            liveartUI.fileUploadByUrl(self.uploadImageUrl());
            liveartUI.hideExpandedWindow();
        }
    }

    self.uploadFileURLIsValid = ko.computed(function () {
        var patt = new RegExp("https?://.+");
        var a = self.customImageUrl();
        return patt.test(self.customImageUrl());
    });

    self.photos = ko.observableArray([]);
    self.photosInstagram = ko.observableArray([]);
    self.photosFacebook = ko.observableArray([]);
    self.photosFlickr = ko.observableArray([]);
    self.photosGoogle = ko.observableArray([]);

    self.addPhoto = function (photo) {
        liveartUI.hideExpandedWindow();
        if (self.selectedObjectType() != "none") {
            userInteract({ deselectObject: true });
            liveartUI.showUploadedGraphicsForm();
        }
        userInteract({
            uploadGraphics: photo
        });
        jQuery("#social-image-added-info").addClass("show");
    }
    self.removeMobileUploadedGraphicsTooltip = function () {
        jQuery("#social-image-added-info").removeClass("show");
    }

    self.isAuthorizedInstagram = ko.observable(false);
    self.isAuthorizedFacebook = ko.observable(false);
    self.isAuthorizedFlickr = ko.observable(false);
    self.isAuthorizedGoogle = ko.observable(false);

    self.currentNetwork = ko.observable("");
    self.paginationPath = ko.observable("me/photos");
    self.isPagination = ko.observable(false);
    self.paginationLimit = ko.observable(30);
    self.photosPreloader = jQuery("#social-photos-preloader");
    self.loadPhotosStatus = jQuery("#liveart-social-photos-status");
    self.fadeDelay = 1200;

    self.paginationInstagramPhotos = function () {
        hello("instagram").api(self.paginationPath(), { limit: self.paginationLimit() }, function (response) {
            if (response.error) {
                self.responseSocialError(response);
                return false;
            }
            if (response.data.length < 1) {
                var instagram = laTranslation.translateUI("INSTAGRAM");
                var text = laTranslation.translateUI("NO_PHOTOS_IN_SOCIAL_NETWORK", { network: instagram });

                self.loadPhotosStatus.html(text);
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
                return false;
            } else {
                self.loadPhotosStatus.html("");
            }
            if (response.paging) {
                self.photosPreloader.fadeIn(self.fadeDelay);
                for (var i = 0; i < response.data.length; i++) {
                    self.photosInstagram.push(new PhotosVO(response.data[i].thumbnail, response.data[i].picture));
                }
                self.photos(self.photosInstagram());
                self.photosPreloader.fadeOut(self.fadeDelay);
                if (response.paging.next) {
                    self.isPagination(true);
                    self.paginationPath(response.paging.next);
                } else {
                    self.isPagination(false);
                }
            } else {
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
            }
        });
    }

    self.paginationFacebookPhotos = function () {
        hello("facebook").api(self.paginationPath(), { limit: self.paginationLimit(), "fields": "images" }, function (response) {
            if (response.error) {
                self.responseSocialError(response);
                return false;
            }
            if (response.data.length < 1) {
                var fb = laTranslation.translateUI("FACEBOOK");
                var text = laTranslation.translateUI("NO_PHOTOS_IN_SOCIAL_NETWORK", { network: fb });

                self.loadPhotosStatus.html(text);
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
                return false;
            } else {
                self.loadPhotosStatus.html("");
            }
            if (response.paging) {
                self.photosPreloader.fadeIn(self.fadeDelay);
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].images && response.data[i].images.length > 0) {
                        var source = response.data[i].images[0].source;
                        var thumbnail = response.data[i].images[response.data[i].images.length - 1].source;
                        self.photosFacebook.push(new PhotosVO(thumbnail, source));
                    }
                }
                self.photos(self.photosFacebook());
                self.photosPreloader.fadeOut(self.fadeDelay);
                if (response.paging.next) {
                    self.isPagination(true);
                    self.paginationPath(response.paging.next);
                } else {
                    self.isPagination(false);
                }
            } else {
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
            }
        });
    }

    self.paginationFlickrPhotos = function () {
        hello("flickr").api(self.paginationPath(), { limit: self.paginationLimit() }, function (response) {
            if (response.error) {
                self.responseSocialError(response);
                return false;
            }
            if (response.data.length < 1) {
                var flickr = laTranslation.translateUI("FLICKR");
                var text = laTranslation.translateUI("NO_PHOTOS_IN_SOCIAL_NETWORK", { network: flickr });

                self.loadPhotosStatus.html(text);
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
                return false;
            } else {
                self.loadPhotosStatus.html("");
            }
            if (response.paging) {
                self.photosPreloader.fadeIn(self.fadeDelay);
                for (var i = 0; i < response.data.length; i++) {
                    self.photosFlickr.push(new PhotosVO(response.data[i].thumbnail, response.data[i].source));
                }
                self.photos(self.photosFlickr());
                self.photosPreloader.fadeOut(self.fadeDelay);
                if (response.paging.next) {
                    self.isPagination(true);
                    self.paginationPath(response.paging.next);
                } else {
                    self.isPagination(false);
                }
            } else {
                self.photosPreloader.fadeIn(self.fadeDelay);
                self.isPagination(false);
                for (var i = 0; i < response.data.length; i++) {
                    self.photosFlickr.push(new PhotosVO(response.data[i].thumbnail, response.data[i].source));
                }
                self.photos(self.photosFlickr());
                self.photosPreloader.fadeOut(self.fadeDelay);
            }
        });
    }

    self.paginationGooglePhotos = function () {
        hello("google").api(self.paginationPath(), function (response) {
            if (response.error) {
                self.responseSocialError(response);
                return false;
            }
            if (!response.data || response.data.length < 1) {
                var google = laTranslation.translateUI("GOOGLE");
                var text = laTranslation.translateUI("NO_PHOTOS_IN_SOCIAL_NETWORK", { network: google });

                self.loadPhotosStatus.html(text);
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
                return false;
            } else {
                self.loadPhotosStatus.html("");
            }

            if (response.data) {
                self.photosPreloader.fadeIn(self.fadeDelay);
                for (var i = 0; i < response.data.length; i++) {
                    self.photosGoogle.push(new PhotosVO(response.data[i].images[1].source, response.data[i].picture));
                }
                self.photos(self.photosGoogle());
                self.photosPreloader.fadeOut(self.fadeDelay);                
                if (response.paging) {
                    self.isPagination(true);
                    self.paginationPath(response.paging.next);
                } else {
                    self.isPagination(false);
                }
            } else {
                self.isPagination(false);
                self.photosPreloader.fadeOut(self.fadeDelay);
            }
        });
    }
    jQuery('#upload-graphics-form > .expanded-part .liveart-close-expanded-part-btn').click(function (e) {
        jQuery(e.currentTarget).parents('.tab-pane').toggleClass('expanded');
        self.currentNetwork(null);
    });

    // binding scroll to load next photos
    jQuery(function () {
        var win = jQuery("#upload-graphics-form #liveart-social-graphics-list");
        win.on("scroll", function () {
            if (win.scrollTop() + win.innerHeight() >= this.scrollHeight && self.isPagination()) {                
                switch (self.currentNetwork()) {
                    case "instagram": self.paginationInstagramPhotos(); break;
                    case "facebook": self.paginationFacebookPhotos(); break;
                    case "flickr": self.paginationFlickrPhotos(); break;
                    case "google": self.paginationGooglePhotos(); break;
                }
            }
        });
    });

    self.logInSocial = function (network) {
        self.currentNetwork(network);
        switch (network) {
            case 'instagram':
                self.authorizationInstagram();
                break;
            case 'facebook':
                self.authorizationFacebook();
                break;
            case 'flickr':
                self.authorizationFlickr();
                break;
            case 'google':
                self.authorizationGoogle();
                break;

            default: self.currentNetwork(null);
        }
    }

    self.logInSocialError = function (e) {
        self.currentNetwork(null);
        self.photos([]);
        liveartUI.hideExpandedWindow();
        var msg = laTranslation.translateUI("FAIL_TO_SIGN_IN", { error: e.error.message });
        self.addAlert(msg, "error");
    }
    self.responseSocialError = function (e) {
        self.photosPreloader.fadeOut(self.fadeDelay);
        self.currentNetwork(null);
        self.photos([]);
        liveartUI.hideExpandedWindow();
        var msg = laTranslation.translateUI("FAIL_TO_SIGN_IN", {error: e.error.message});
        self.addAlert(msg, "error");
    }

    //authorize Instagram
    self.authorizationInstagram = function () {
        var network = "instagram";
        if (self.isAuthorizedInstagram()) {
            self.photos(self.photosInstagram());
            liveartUI.showExpandedWindow("upload-graphics-form");
            return;
        }
        helloInit();
        hello(network).login().on('success',
			function (r) {
			    self.isAuthorizedInstagram(true);
			    liveartUI.showExpandedWindow("upload-graphics-form");
			    jQuery("#liveart-social-graphics-list").scrollTop(0);
			    self.photosPreloader.fadeIn(self.fadeDelay);
			    self.paginationInstagramPhotos();
			}).on('error', self.logInSocialError);

        //initialize hello
        function helloInit() {
            self.paginationPath("me/photos");
            hello.init(
				{
				    instagram: self.instagramClientID()
				},
				{
				    scope: 'photos',
				    redirect_uri: self.authorizedRedirectUrl()
				}
			);
        }
    }

    //authorize Facebook
    self.authorizationFacebook = function () {
        var network = "facebook";
        if (self.isAuthorizedFacebook()) {
            self.photos(self.photosFacebook());
            liveartUI.showExpandedWindow("upload-graphics-form");
            return;
        }
        helloInit();
        hello(network).login().on('success',
			function (r) {
			    self.isAuthorizedFacebook(true);
			    liveartUI.showExpandedWindow("upload-graphics-form");
			    jQuery("#liveart-social-graphics-list").scrollTop(0);
			    self.photosPreloader.fadeIn(self.fadeDelay);
			    self.paginationFacebookPhotos();
			}).on('error', self.logInSocialError);

        //initialize hello
        function helloInit() {
            self.paginationPath("me/photos/uploaded");
            hello.init(
				{
				    facebook: self.facebookClientID()
				},
				{
				    scope: 'user_photos',
				    redirect_uri: self.authorizedRedirectUrl()
				}
			);
        }
    }

    //authorize Flickr
    self.authorizationFlickr = function () {
        var network = "flickr";
        if (self.isAuthorizedFlickr()) {
            self.photos(self.photosFlickr());
            liveartUI.showExpandedWindow("upload-graphics-form");
            return;
        }
        helloInit();
        hello(network).login().on('success',
			function (r) {
			    self.isAuthorizedFlickr(true);
			    liveartUI.showExpandedWindow("upload-graphics-form");
			    jQuery("#liveart-social-graphics-list").scrollTop(0);
			    self.photosPreloader.fadeIn(self.fadeDelay);
			    self.paginationFlickrPhotos();
			}).on('error', self.logInSocialError);

        //initialize hello
        function helloInit() {
            self.paginationPath("me/photos");
            hello.init(
				{
				    flickr: self.flickrClientID()
				},
				{
				    scope: 'photos',
				    redirect_uri: self.authorizedRedirectUrl()
				}
			);

        }
    }

    //authorize Google
    self.authorizationGoogle = function () {
        var network = "google";
        if (self.isAuthorizedGoogle()) {
            self.photos(self.photosGoogle());
            liveartUI.showExpandedWindow("upload-graphics-form");
            return;
        }
        helloInit();
        hello(network).login().on('success',
			function (r) {
			    self.isAuthorizedGoogle(true);
			    liveartUI.showExpandedWindow("upload-graphics-form");
			    jQuery("#liveart-social-graphics-list").scrollTop(0);
			    self.photosPreloader.fadeIn(self.fadeDelay);
			    self.paginationGooglePhotos();
			}).on('error', self.logInSocialError);

        //initialize hello
        function helloInit() {
            self.paginationPath("me/photos");
            hello.init(
				{
				    google: self.googleClientID()
				},
				{
				    scope: 'photos',
				    redirect_uri: self.authorizedRedirectUrl()
				}
			);
        }
    }

    /**
     * GRAPHICS OBJECT ENDS HERE
     */

    // private function for correct selected object detection
    function parseObjectAttributes(selectedObject) {
        self.suppressTextUpdate = true;
        if (selectedObject == null) {
            if (self.selectedObjectType() == "graphics") {
                liveartUI.closeActiveTab();
            }

            self.selectedObjectType('none');
            self.selectedLetteringVO().text('');
            self.selectedLetteringVO().isNames(false);
            self.selectedLetteringVO().isNumbers(false);
            self.selectedObjectDPUExceeded(false);
            if (self.showTextEffects) {
                self.resetTextEffect(null);
            }
        } else {
            // hiding color picker on another object selecting. LAJS/TASK740 fix
            if (self.selectedObjectPropertiesVO().id() != selectedObject.id) {
                jQuery.fn.colorPicker.hidePalette();
            }

            if (selectedObject.type == 'txt') {
                self.selectedObjectType('text');
                self.selectedLetteringVO().fromObject(selectedObject);
                self.setTextEffect();
                self.selectedObjectDPUExceeded(false);
                openTextForm();
            } else {
                self.selectedObjectType('graphics');
                self.selectedGraphicsFormatVO().fromObject(selectedObject);
                self.selectedObjectDPUExceeded(selectedObject.dpuExceeded);
                
                if (self.selectedObjectPropertiesVO().id() != selectedObject.id) {
                    if (selectedObject.sourceId && selectedObject.sourceId != "") {
                        openGraphicsForm();
                    } else {
                        openUploadGraphicsForm();
                    }
                } 
            }
        }
        self.selectedObjectPropertiesVO().fromObject(selectedObject);

        self.suppressTextUpdate = false;
    }

    /**
     * SELECTED OBJECT ENDS HERE
     */

    /**
     * BUILD INFO SETTING BEGINS HERE
     */

    self.version = ko.observable("");
    self.buildTime = ko.observable("");

    /**
     * BUILD INFO SETTING ENS HERE
     */

    /**
     * URL TO DOWNLOAD SCRIPT BEGINS HERE
     */
    self.uploadImageUrl = ko.observable("");
    /**
     * URL TO DOWNLOAD SCRIPT ENDS HERE
     */

    /**
     * LIVEART PROGRESS STATUS BEGINS HERE
     */

    self.status = ko.observable({
    });


    self.percentCompleted = ko.computed(function () {
        return self.status().percentCompleted + "%";
    });

    self.status.subscribe(function (value) {
        if (value.imageUploading) {
            jQuery("#liveart-upload-image-browse-btn").button("loading");
        } else {
            jQuery("#liveart-upload-image-browse-btn").button("reset");
        }
    });

    /**
     * LIVEART PROGRESS STATUS ENDS HERE
     */

    /**
     * DESIGNER ACTIONS BEGIN HERE
     */

    self.arrange = function (value) {
        userInteract({
            arrange: value
        });
    }

    self.align = function (value) {
        userInteract({
            align: value
        });
    }

    self.flip = function (value) {
        userInteract({
            flip: value
        });
    }

    self.clearDesign = function () {
        var retVal = confirm(laTranslation.translateUI("CLEAR_DESIGN_CONFIRMATION"));
        if (retVal == true) {

            // clean name/numbers
            self.removeAllNameNumbers();

            userInteract({
                clearDesign: true
            });
        }
    }

    self.proceedQuote = function () {
        liveartUI.closeActiveTab(true);
        jQuery('#liveart-main-container').addClass('collapsed');
    }

    self.lockProportions = ko.observable(true);
    self.lockProportions.subscribe(function (value) {
        userInteract({
            "lockProportions": value
        });
    });

    self.unitLabel = ko.observable("");

    self.zoomEnabled = ko.observable(false);
    self.minZoom = ko.observable(50);
    self.maxZoom = ko.observable(150);
    self.zoom = ko.observable(100);
    self.zoom.subscribe(function (value) {
        userInteract({
            zoom: Number(value)
        });
    });

    self.zoomIn = function () {
        userInteract({
            zoomIn: true
        });
    }

    self.zoomOut = function () {
        userInteract({
            zoomOut: true
        });
    }

    self.drag = ko.observable(false);
    self.drag.subscribe(function (value) {
        userInteract({
            drag: value
        });
    });

    /**
     * DESIGNER ACTIONS END HERE
     */


    /**
     * SAVED DESIGNS BEGIN HERE
     */

    self.designsList = ko.observableArray();
    self.selectedDesign = ko.observable();
    self.designNotes = ko.observable();
    self.designNotes.subscribe(function (val) {
        userInteract({ designNotes: val });
    });

    self.onDesignSelected = function (design) {
        self.selectedDesign(design);
    }

    self.shareLink = ko.observable("");

    /**
     * SAVED DESIGNS END HERE
     */

    /**
     * USER'S EMAIL BEGINS HERE
    */
    self.userEmail = ko.observable();
    /**
     * USER'S EMAIL ENDS HERE
    */

    self.designName = ko.observable("");


    /**
     * DESIGN INFO BEGINS HERE
     */

    self.designInfo = ko.observable({
    });

    self.objectsCount = ko.computed(function () {
        var objCount = "";
        if (isNullOrUndefined(self.designInfo().objectsCount)) {
            objCount = laTranslation.translateUI('NO_OBJECTS');
        } else if (self.designInfo().objectsCount) {
            
            if (self.designInfo().objectsCount.letteringsCount === 0 && self.designInfo().objectsCount.imagesCount === 0) {
                objCount = laTranslation.translateUI('NO_OBJECTS');

            } else {
                var imagesCount = '';
                var letteringsCount = '';

                if (self.designInfo().objectsCount.letteringsCount === 0) {
                    letteringsCount = laTranslation.translateUI('NO_LETTERINGS');
                } else if (self.designInfo().objectsCount.letteringsCount === 1) {
                    letteringsCount = laTranslation.translateUI('ONE_LETTERING');
                } else if (self.designInfo().objectsCount.letteringsCount > 1) {
                    var lcnt = self.designInfo().objectsCount.letteringsCount;
                    letteringsCount = laTranslation.translateUI('LETTERINGS_COUNT', { count: lcnt });
                }

                if (self.designInfo().objectsCount.imagesCount === 0) {
                    imagesCount = laTranslation.translateUI('NO_IMAGES');
                } else if (self.designInfo().objectsCount.imagesCount === 1) {
                    imagesCount = laTranslation.translateUI('ONE_IMAGE');
                } else if (self.designInfo().objectsCount.imagesCount > 1) {
                    var icnt = self.designInfo().objectsCount.imagesCount;
                    imagesCount = laTranslation.translateUI('IMAGES_COUNT', { count: icnt });
                }

                objCount = letteringsCount + ', ' + imagesCount;
            }
        }

        return laTranslation.firstLetterUppercase(objCount);
    });

    self.colorsCount = function (count) {
        var colorsCount = '';
        if (count === 0) {
            colorsCount = laTranslation.translateUI('NO_COLORS');
        } else if (count === -1) {
            colorsCount = laTranslation.translateUI('PROCESS_COLORS');
        } else if (count === 1) {
            colorsCount = laTranslation.translateUI('ONE_COLOR');
        } else if (count > 1) {
            var translate = laTranslation.translateUI('COLORS_COUNT', { count: count });
            colorsCount = translate;
        }

        return laTranslation.firstLetterUppercase(colorsCount);
    }

    /**
     * DESIGN INFO ENDS HERE
     */

    /**
     * MODAL OPTIONS BEGIN HERE
     */

    self.dpuExceedConfirmed = ko.observable(false);

    self.imageColorCount = ko.observable(new ImageColorCountVO());

    /**
     * MODAL OPTIONS END HERE
     */

    /**
     * PRINT
     */
    self.print = function () {
        jQuery("#quote-popup").modal("hide");
        userInteract({
            print: true
        });
    }
    /**
     * PRINT ENDS HERE
     */

    /**
     * COPY/PASTE
     */
    self.copy = function () {
        userInteract({
            copy: true
        });
    }

    self.paste = function () {
        userInteract({
            paste: true
        });
    }
    /**
     * COPY/PASTE ENDS HERE
     */


    /**
     * RESTRICTIONS BEGIN HERE
     */

    self.restrictions = ko.observable(new RestrictionsVO(self));
    self.minDPU = ko.observable();

    /**
     * RESTRICTIONS END HERE
     */

    /**
    * UNDO/REDO BEGINS HERE
    */
    self.undo = function () {
		if (self.isUndoActive()) {
			userInteract({ undo: true });
		}
    }

    self.redo = function () {
		if (self.isRedoActive()) {
			userInteract({ redo: true });
		}
    }

    self.isUndoActive = ko.observable(false);
    self.isRedoActive = ko.observable(false);
    /**
    * UNDO/REDO ENDS HERE
    */

    self.showUploadedColorsDialog = ko.observable(true);

    /**
    * Client ID's from social networks BEGIN HERE
    */

    self.instagramClientID = ko.observable("");
    self.facebookClientID = ko.observable("");
    self.googleClientID = ko.observable("");
    self.flickrClientID = ko.observable("");
    self.authorizedRedirectUrl = ko.observable("");

    self.showInstagramPhotos = ko.computed(function () {
        return self.instagramClientID() !== "" && self.authorizedRedirectUrl() !== "";
    });
    self.showFacebookPhotos = ko.computed(function () {
        return self.facebookClientID() !== "" && self.authorizedRedirectUrl() !== "";
    });
    self.showFlickrPhotos = ko.computed(function () {
        return self.flickrClientID() !== "" && self.authorizedRedirectUrl() !== "";
    });
    self.showGooglePhotos = ko.computed(function () {
        return self.googleClientID() !== "" && self.authorizedRedirectUrl() !== "";
    });
	self.showSocialNetworksPhotos = ko.computed(function(){
		return self.showInstagramPhotos()||self.showFacebookPhotos()||self.showFlickrPhotos()||self.showGooglePhotos();
	});

    /**
    * Client ID's from social networks ENDS HERE
    */

    self.addAlert = function (text, level) {
        liveartUI.addAlert(text, level);
    }

    self.showLoadDesignPreloader = ko.observable(false);
    self.showLoadDesignPreloader.subscribe(function (value) {
        var status = { showPreloader: false, text: laTranslation.translateUI("LOADING_YOUR_DESIGN_MESSAGE") };
        if (value && self.status().completed) {
            status.showPreloader = true;
        }
        self.preloaderStatus(status);
    });

    self.showPlaceOrderPreloader = ko.observable(false);
    self.showPlaceOrderPreloader.subscribe(function (value) {
        var status = { showPreloader: false, text: laTranslation.translateUI("PLACING_ORDER_MESSAGE") };
        if (value && self.status().completed) {
            status.showPreloader = true;
        }
        self.preloaderStatus(status);
    });

    self.preloaderStatus = ko.observable({});
    self.preloaderStatus.subscribe(function (value) {
        if (value) {
            if (value.showPreloader) {
                jQuery("#liveart-preloader").modal('show');

                var textValue = laTranslation.translateUI("LOADING_MESSAGE");
                if (value.text) {
                    textValue = value.text;
                } 
                var $text = jQuery("#liveart-preloader").find(".preloader-text");
                if ($text && $text.length) {
                    $text[0].innerHTML  = textValue;
                }
            } else {
                jQuery("#liveart-preloader").modal('hide');
            }
        }
    });

    /**
     * UPDATE VIEW MODEL BEGINS HERE
     */

    self.suppressUpdate = false;

    function isInvalid(invalidateList, type) {
        return (invalidateList.indexOf(type) > -1);
    }

    function validate(invalidateList, type) {
        if (isInvalid(invalidateList, type)) {
            delete invalidateList[invalidateList.indexOf(type)];
        }
    }

    self.update = function (model) {
        var invalidateList = model.invalidateList ? model.invalidateList : [];

        self.suppressUpdate = true;

        // set version
        if (isInvalid(invalidateList, 'version')) {
            self.version(model.version);
            validate(invalidateList, 'version');
        }

        // set build time
        if (isInvalid(invalidateList, 'buildTime')) {
            self.buildTime(model.buildTime);
            validate(invalidateList, 'buildTime');
        }

        // set status
        if (isInvalid(invalidateList, 'status')) {
            self.status(model.status);
            validate(invalidateList, 'status');
        }

        // set selected product
        if (isInvalid(invalidateList, 'selectedProduct')) {
            self.selectedProductVO().fromObject(model.selectedProduct);
            updateMainMenuCount();
            validate(invalidateList, 'selectedProduct');
        }
        //on config loaded
        if (isInvalid(invalidateList, 'configLoaded')) {
            updateMainMenuCount();
            validate(invalidateList, 'configLoaded');
        }
        // set selected product category
        if (isInvalid(invalidateList, 'selectedProductCategory')) {
            self.openProductCategory(model.selectedProductCategory);
            validate(invalidateList, 'selectedProductCategory');
        }

        // set selected product color
        if (isInvalid(invalidateList, 'selectedProductColor')) {
            self.selectedProductColorVO().fromObject(model.selectedProductColor);
            validate(invalidateList, 'selectedProductColor');
        }

        // set selected product size
        if (isInvalid(invalidateList, 'selectedProductSize')) {
            self.selectedProductSizeVO().fromObject(model.selectedProductSize);
            validate(invalidateList, 'selectedProductSize');
        }

        // set selected product location
        if (isInvalid(invalidateList, 'selectedProductLocation')) {
            self.selectedProductLocation(model.selectedProductLocation);
            validate(invalidateList, 'selectedProductLocation');
        }

        // fill product categories list
        if (isInvalid(invalidateList, 'productCategories')) {
            self.parseProducts(model.productCategories);
            validate(invalidateList, 'productCategories');
        }

        // fill graphics categories list
        if (isInvalid(invalidateList, 'graphicsCategories')) {
            self.graphicCatalogLoaded(model.graphicsCategories);
            validate(invalidateList, 'graphicsCategories');
        }

        // fill fonts list
        if (isInvalid(invalidateList, 'fonts')) {
            self.fonts(model.fonts);
            self.preloadFonts();
            if (model.fonts.length > 0)
                self.selectFont(model.fonts[0]);

            validate(invalidateList, 'fonts');
        }

        // fill colors and stroke colors list
        if (isInvalid(invalidateList, 'colors')) {
            self.colors(model.colors);
            var strokeColors = [];
            strokeColors.push({
                value: 'none',
                name: 'Transparent'
            });
            self.strokeColors(strokeColors.concat(model.colors));
            validate(invalidateList, 'colors');
        }

        if (isInvalid(invalidateList, 'pantones')) {
            jQuery.fn.colorPicker.setPantones(model.pantones);
            validate(invalidateList, 'pantones');
        };
        
        // parse a selected object
        if (isInvalid(invalidateList, 'selectedObj')) {
            parseObjectAttributes(model.selectedObj);
            validate(invalidateList, 'selectedObj');
        }

        // Order
        if (isInvalid(invalidateList, 'quantities')) {
            validate(invalidateList, 'quantities');
            var quantities = jQuery.map(model.quantities, function (item) {
                return new SizeQuantityVO(item.size, item.quantity, updateQuantities);
            });
            self.quantities(quantities);
        }

        // Names & numbers
        if (isInvalid(invalidateList, 'namesNumbers')) {
            validate(invalidateList, 'namesNumbers');
            var namesNumbers = jQuery.map(model.namesNumbers, function (item) {
                return new NameNumberVO(item.name, item.numberText, item.size, updateNamesNumbers);
            });
            self.namesNumbers(namesNumbers);
        }

        // Design info
        if (isInvalid(invalidateList, 'designInfo') && !isNullOrUndefined(model.designInfo)) {
            self.designInfo(model.designInfo);
            validate(invalidateList, 'designInfo');
        }

        // Designs
        if (isInvalid(invalidateList, 'designs')) {
            self.designsList(model.designs);
            validate(invalidateList, 'designs');
        }

        if (isInvalid(invalidateList, 'designNotes')) {
            self.designNotes(model.designNotes);
            validate(invalidateList, 'designNotes');
        }

        // Dialogs
        if (isInvalid(invalidateList, 'showAuthDialog') && model.showAuthDialog) {
            showAuthDialog();
            validate(invalidateList, 'showAuthDialog');
        }
        if (isInvalid(invalidateList, 'showAuthAndSaveDialog') && model.showAuthAndSaveDialog) {
            showAuthAndSaveDialog();
            validate(invalidateList, 'showAuthAndSaveDialog');
        }
        if (isInvalid(invalidateList, 'showSaveDesignDialog') && model.showSaveDesignDialog) {
            showSaveDesignDialog();
            validate(invalidateList, 'showSaveDesignDialog');
        }
        if (isInvalid(invalidateList, 'showLoadDesignDialog') && model.showLoadDesignDialog) {
            showLoadDesignDialog();
            validate(invalidateList, 'showLoadDesignDialog');
        }
        if (isInvalid(invalidateList, 'showLoadDesignPreloader')) {
            self.showLoadDesignPreloader(model.showLoadDesignPreloader);
            validate(invalidateList, 'showLoadDesignPreloader');
        }
        if (isInvalid(invalidateList, 'showPlaceOrderPreloader')) {
            self.showPlaceOrderPreloader(model.showPlaceOrderPreloader);
            validate(invalidateList, 'showPlaceOrderPreloader');
        }
        
        if (isInvalid(invalidateList, 'showDPUExceededDialog') && model.showDPUExceededDialog) {
            showDPUExceededDialog();
            validate(invalidateList, 'showDPUExceededDialog');
        }
       
        if (isInvalid(invalidateList, 'showShareLink') && model.showShareLink) {
            self.shareLink(model.shareLink);
            showShareLink();
            validate(invalidateList, 'shareLink');
            validate(invalidateList, 'showShareLink');
        }

        if (isInvalid(invalidateList, 'strictTemplate')) {
            self.strictTemplate(model.strictTemplate);
            validate(invalidateList, 'strictTemplate');
        }

        if (isInvalid(invalidateList, 'zoom')) {
            var val = parseInt(model.zoom.toFixed(1));
            if (self.zoom() != val) {
                self.zoom(val);
            }
            validate(invalidateList, 'zoom');
        }
        if (isInvalid(invalidateList, 'minZoom')) {
            self.minZoom(parseInt(model.minZoom.toFixed(1)));
            validate(invalidateList, 'minZoom');
        }
        if (isInvalid(invalidateList, 'maxZoom')) {
            self.maxZoom(parseInt(model.maxZoom.toFixed(1)));
            validate(invalidateList, 'maxZoom');
        }
        if (isInvalid(invalidateList, 'zoomEnabled')) {
            self.zoomEnabled(model.zoomEnabled);
            validate(invalidateList, 'zoomEnabled');
        }
        if (isInvalid(invalidateList, 'minDPU') && model.minDPU) {
            self.minDPU(model.minDPU);
            validate(invalidateList, 'minDPU');
        }
        if (isInvalid(invalidateList, 'unitLabel') && model.unitLabel) {
            //get obly first 2 symbols
            self.unitLabel(model.unitLabel.substring(0, 2));
            validate(invalidateList, 'unitLabel');
        }
        // fill textEffects
        if (isInvalid(invalidateList, 'textEffects')) {
            var textEffects = jQuery.map(model.textEffects, function (item) {
                return new TextEffectVO(item.name, item.label, item.value, item.paramName, item.min, item.max, item.step);
            });
            self.textEffects(textEffects);
            self.textEffects.unshift(new TextEffectVO("none", "None", 0));
            validate(invalidateList, 'textEffects');
        }

        if (isInvalid(invalidateList, 'showProductSelector')) {
            self.showProductSelector(model.showProductSelector);
            validate(invalidateList, 'showProductSelector');
        }

        if (isInvalid(invalidateList, 'objDClicked') && model.objDClicked) {
            var a = self.selectedObjectType();
            if (self.selectedObjectType() === 'text') {
                openTextForm();
            }
            validate(invalidateList, 'objDClicked');
        }

        if (isInvalid(invalidateList, 'minZoom')) {
            self.minZoom(parseInt(model.minZoom.toFixed(1)));
            validate(invalidateList, 'minZoom');
        }

        // set url for download .php script
        if (isInvalid(invalidateList, 'uploadImageUrl')) {
            self.uploadImageUrl(model.uploadImageUrl);
            liveartUI.initFileUpload(self.uploadImageUrl(), self.addUploadedImage);
            validate(invalidateList, 'uploadImageUrl');
        }

        // turn on/off selecting colors pop-up after image uploading
        if (isInvalid(invalidateList, 'showUploadedColorsDialog')) {
            self.showUploadedColorsDialog(model.showUploadedColorsDialog);
            validate(invalidateList, 'showUploadedColorsDialog');
        }

        //Undo/redo
        if (isInvalid(invalidateList, 'isUndoActive')) {
            self.isUndoActive(model.isUndoActive);
            validate(invalidateList, 'isUndoActive');
        }
        if (isInvalid(invalidateList, 'isRedoActive')) {
            self.isRedoActive(model.isRedoActive);
            validate(invalidateList, 'isRedoActive');
        }

        if (isInvalid(invalidateList, 'showColorCountDialog') && model.showColorCountDialog) {
            showColorCountDialog();
            validate(invalidateList, 'showColorCountDialog');
        }

        //Instagram client ID
        if (isInvalid(invalidateList, 'instagramClienID')) {
            self.instagramClientID(model.instagramClienID);
            validate(invalidateList, 'instagramClienID');
        }
        //Facebook client ID
        if (isInvalid(invalidateList, 'facebookClienID')) {
            self.facebookClientID(model.facebookClienID);
            validate(invalidateList, 'facebookClienID');
        }
        //Flickr client ID
        if (isInvalid(invalidateList, 'flickrClienID')) {
            self.flickrClientID(model.flickrClienID);
            validate(invalidateList, 'flickrClienID');
        }
        //Google client ID
        if (isInvalid(invalidateList, 'googleClienID')) {
            self.googleClientID(model.googleClienID);
            validate(invalidateList, 'googleClienID');
        }
        //redirect url after authorization
        if (isInvalid(invalidateList, 'authorizedRedirectUrl')) {
            self.authorizedRedirectUrl(model.authorizedRedirectUrl);
            validate(invalidateList, 'authorizedRedirectUrl');
        }

        if (isInvalid(invalidateList, 'alert')) {
            self.addAlert(model.alert.text, model.alert.level);
            validate(invalidateList, 'alert');
        }

        if (isInvalid(invalidateList, 'dictionary')) {
            laTranslation.update(model.dictionary);
            validate(invalidateList, 'dictionary');
        }

        if (isInvalid(invalidateList, 'currentDesign')) {
            setCurrentDesign(model.currentDesign);
            validate(invalidateList, 'currentDesign');
        }

        if (isInvalid(invalidateList, 'preloaderStatus')) {
            self.preloaderStatus(model.preloaderStatus);
            validate(invalidateList, 'preloaderStatus');
        }
        

        self.suppressUpdate = false;
    }

    /**
     * UPDATE VIEW MODEL ENDS HERE
     */
};


/**
 * CUSTOM KNOCKOUT BINDINGS BEGIN HERE
 */

// bootstrap checkboxes
var uelementId = 0;
function checkUniqueId(element) {
    if (element.attr("id") == null || element.attr("id") == "") {
        uelementId++;
        element.attr("id", "la-element-id-" + uelementId);
    }
}

ko.bindingHandlers.checkbox = {
    init: function (element, valueAccessor) {
        var $element, observable;
        observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = jQuery(element);
        $element.on('click', function () {
            observable(!observable());
        });
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                $element.toggleClass('active', observable());
            }
        });
    }
};

// jquery colorpicker (color)
ko.bindingHandlers.colorPickerInit = {
    init: function (element, valueAccessor) {
        var $element, observable;
        observable = valueAccessor();
        /*if (!ko.isWriteableObservable(observable)) {
            throw 'You must pass an observable or writeable computed';
        }*/
        $element = jQuery(element);
        checkUniqueId($element);
        var params = {
        };
        if (observable.container) params.container = $element.parent();
        if (observable.isDropup) params.isDropup = true;
        if (observable.paletteClass) params.paletteClass = observable.paletteClass;
        if (observable.showPantones) {
            if (ko.isObservable(observable.showPantones)) {
                params.showPantones = observable.showPantones();
            } else {
                params.showPantones = observable.showPantones;
            }
        }
        if (observable.colors) {
            var _observableArray;
            if (ko.isObservable(observable.colors)) {
                _observableArray = observable.colors();
            } else {
                _observableArray = observable.colors;
            }
            var colorValues = [];
            for (var i = 0; i < _observableArray.length; i++) {
                colorValues.push({ value: _observableArray[i].value, name: _observableArray[i].name });
            }
            params.colors = colorValues;
        }
        // using for multicolor objects/products. Ignoring the dafault color.
        params.skipDefault = true;
        params.gap = 2;
        $element.colorPicker(params);
        if (params.container) {
            //to force toggling color palette when clicking on button in bar
            $element.parent().click(function (e) {
                $element.next('div.colorPicker-picker').click();
            });
            //stop event propagation to avoid cycling
            $element.next('div.colorPicker-picker').click(function (e) {
                e.stopPropagation();
            });

        }
    }
}

ko.bindingHandlers.colorPicker = {
    init: function (element, valueAccessor) {
        var $element, observable;
        observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = jQuery(element);
        checkUniqueId($element);
        $element.on('change', function (event) {
            observable(jQuery(event.currentTarget).val());
        });
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                jQuery.fn.colorPicker.changeColor($element.attr('id'), observable());
            }
        });
    }
}

ko.bindingHandlers.showPantones = {
    init: function (element, valueAccessor) {
        var $element, observable;
        observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = jQuery(element);
        checkUniqueId($element);
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                jQuery.fn.colorPicker.showPantones($element.attr('id'), observable());
            }
        });
    }
}


// jquery colorpicker (palette)
ko.bindingHandlers.colorPalette = {
    init: function (element, valueAccessor) {
        var $element, observableArray;
        observableArray = valueAccessor();
        if (!ko.isObservable(observableArray)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = jQuery(element);
        checkUniqueId($element);
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                var colorValues = [];
                var _observableArray = observableArray();
                for (var i = 0; i < _observableArray.length; i++) {
                    colorValues.push({ value: _observableArray[i].value, name: _observableArray[i].name });
                }
                if (colorValues.length > 0) {
                    jQuery.fn.colorPicker.changeColor($element.attr('id'), colorValues[0].value);
                }
                jQuery.fn.colorPicker.setColors($element.attr('id'), colorValues);
            }
        })
    }
}
ko.bindingHandlers.pantones = {
    init: function (element, valueAccessor) {
        var $element = jQuery(element);
        if (ko.isObservable(valueAccessor)) {
            throw 'You must pass non observable value';
        }
        checkUniqueId($element);
    }
}


ko.bindingHandlers.productColorPalette = {
    init: function (element, valueAccessor) {
        var $element, observableArray;
        observableArray = valueAccessor();
        if (!ko.isObservable(observableArray)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = jQuery(element);
        checkUniqueId($element);
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                var colorValues = [];
                var _observableArray = observableArray();
                for (var i = 0; i < _observableArray.length; i++) {
                    colorValues.push({ value: _observableArray[i].value, name: _observableArray[i].name });
                }
                jQuery.fn.colorPicker.setColors($element.attr('id'), colorValues);
            }
        })
    }
}

ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var observable = valueAccessor();
        var allBindings = allBindingsAccessor();

        var sliderValue = ko.utils.unwrapObservable(observable);
        var rangeStart = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.rangeStart) ? 50 : allBindings.rangeStart));
        var rangeEnd = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.rangeEnd) ? 150 : allBindings.rangeEnd));
        var step = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.step) ? 5 : allBindings.step));
        var decimals = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.decimals) ? 0 : allBindings.decimals));

        sliderValue = isNullOrUndefined(sliderValue) ? rangeStart : sliderValue;
        sliderValue = Number(sliderValue);

        var slideFunction = function () {
            var value = jQuery(this).val();
            if (typeof (observable) == "function") {
                observable(value);
            }
        };

        var options = {
            start: sliderValue,
            range: {
                'min': [rangeStart],
                'max': [rangeEnd]
            },
            step: step,
            serialization: {
                format: {
                    decimals: decimals
                }
            }
        };

        var $element = jQuery(element).noUiSlider(options).on({
            slide: slideFunction
        });
        ko.computed({
            read: function () {
                var sliderValue = ko.utils.unwrapObservable(observable);
                sliderValue = isNullOrUndefined(sliderValue) ? 0 : sliderValue;
                $element.val(sliderValue);
            }
        });
    }
}


ko.bindingHandlers.rangeStart = {
    update: (function () {
        var valuesHolder = {};
        var updater = function (element, valueAccessor, allBindingsAccessor) {
            var slider = jQuery(element);
            var rangeEnd = ko.utils.unwrapObservable(valueAccessor());
            if (rangeEnd != valuesHolder[slider.attr("id")]) {
                liveartUI.laUpdateSliderRange(element, valueAccessor, allBindingsAccessor);
            }
            valuesHolder[slider.attr("id")] = rangeEnd;
        }
        return updater;
    })()
}

ko.bindingHandlers.rangeEnd = {
    update: (function () {
        var valuesHolder = {};
        var updater = function (element, valueAccessor, allBindingsAccessor) {
            var slider = jQuery(element);
            var rangeEnd = ko.utils.unwrapObservable(valueAccessor());
            if (rangeEnd != valuesHolder[slider.attr("id")]) {
                liveartUI.laUpdateSliderRange(element, valueAccessor, allBindingsAccessor);
            }
            valuesHolder[slider.attr("id")] = rangeEnd;
        }
        return updater;
    })()
}

liveartUI.laUpdateSliderRange = function (element, valueAccessor, allBindingsAccessor) {
    var slider = jQuery(element);
    var allBindings = allBindingsAccessor();
    var rangeStart = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.rangeStart) ? 50 : allBindings.rangeStart));
    var rangeEnd = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.rangeEnd) ? 150 : allBindings.rangeEnd));
    var mergedOptions = {
        range: {
            'min': [rangeStart],
            'max': [rangeEnd]
        }
    }
    slider.noUiSlider(mergedOptions, true);
}

ko.bindingHandlers.step = {
    update: (function () {
        var valuesHolder = {};
        var updater = function (element, valueAccessor, allBindingsAccessor) {
            var slider = jQuery(element);
            var rangeEnd = ko.utils.unwrapObservable(valueAccessor());
            if (rangeEnd != valuesHolder[slider.attr("id")]) {
                var allBindings = allBindingsAccessor();
                var step = Number(ko.utils.unwrapObservable(isNullOrUndefined(allBindings.step) ? 50 : allBindings.step));
                var mergedOptions = {
                    step: step
                }
                slider.noUiSlider(mergedOptions, true);
            }
            valuesHolder[slider.attr("id")] = rangeEnd;
        }
        return updater;
    })()
}

// Knockout checked binding doesn't work with Bootstrap radio-buttons
//origin: https://github.com/faulknercs/Knockstrap/blob/master/src/bindings/radioBinding.js
ko.bindingHandlers.radio = {
    init: function (element, valueAccessor) {

        if (!ko.isObservable(valueAccessor())) {
            throw new Error("radio binding should be used only with observable values");
        }

        jQuery(element).on('change', 'input:radio', function (e) {
            // we need to handle change event after bootsrap will handle its event
            // to prevent incorrect changing of radio button styles
            setTimeout(function () {
                var radio = jQuery(e.target),
                    value = valueAccessor(),
                    newValue = radio.val();

                value(newValue);
            }, 0);
        });
    },

    update: function (element, valueAccessor) {
        var $radioButton = jQuery(element).find('input[value="' + ko.utils.unwrapObservable(valueAccessor()) + '"]'),
            $radioButtonWrapper;

        if ($radioButton.length) {
            $radioButtonWrapper = $radioButton.parent();

            $radioButtonWrapper.siblings().removeClass('active');
            $radioButtonWrapper.addClass('active');

            $radioButton.prop('checked', true);
        } else {
            $radioButtonWrapper = jQuery(element).find('.active');
            $radioButtonWrapper.removeClass('active');
            $radioButtonWrapper.find('input').prop('checked', false);
        }
    }
};


liveartUI.validationError = function (element, message) {
    element.tooltip({
        title: message,
        trigger: "manual"
    });
    element.addClass('has-error');
    element.tooltip('show');
}

liveartUI.validationSuccess = function (element) {
    element.tooltip('destroy');
    element.removeClass('has-error');
}

/**
 * CUSTOM KNOCKOUT BINDINGS END HERE
 */


/**
 * MODAL POPUP WINDOWS AND BUTTONS EVENTS BEGIN HERE
 */


jQuery('.modal').on('hidden.bs.modal', function () { // handle all modal dialog canceled by user
    // do something…
    userInteract({
        userCanceled: true
    });
});

/** Validatin block starts here */
function isEmailValid(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(email);
}

function isDesignNameValid(name) {
    return name && name != "";
}

function showValidationError($container, text) {
    $container.addClass("has-error");
    $container.find(".error-text").text(text);
    $container.find(".validation-error").show();
}

function clearValidationErrors($container) {
    if (!$container) return;
    $container.find(".has-error").removeClass("has-error");
    $container.find(".validation-error").hide();
}
/** Validatin block ends here */

function showAuthDialog() {
    var $container = jQuery("#liveart-authorization-popup");
    clearValidationErrors($container);
    $container.modal("show");
}

function onAuthDialogSubmit(event) {
    if (event == null || event.keyCode == 13) {
        var email = jQuery("#liveart-authorization-email-input").val();
        if (isEmailValid(email)) {
            controlsModel.userEmail(email);
            userInteract({
                authorize: controlsModel.userEmail()
            });
            jQuery("#liveart-authorization-popup").modal("hide");
        } else {
            var $emailContainer = jQuery("#liveart-authorization-popup .email-controls");
            var text = laTranslation.translateUI("INVALID_EMAIL_FORMAT");
            showValidationError($emailContainer, text);
            jQuery("#liveart-authorization-email-input").focus();
        }
    }
}

function onChangeUserDialogSubmit() {
    var email = jQuery("#liveart-change-user-email-input").val();
    if (isEmailValid(email)) {
        userInteract({
            authorize: email
        });
        jQuery("#liveart-change-user-popup").modal("hide");
        onLoadDesign();
    } else {
        var $emailContainer = jQuery("#liveart-change-user-popup .email-controls");
        var text = laTranslation.translateUI("INVALID_EMAIL_FORMAT");
        showValidationError($emailContainer, text);
        jQuery("#liveart-change-user-email-input").focus();
    }
}

function showDPUExceededDialog() {
    blockConfirmDPUExceeded();
    jQuery("#liveart-confirm-dpu-exceeded-popup").modal("show");
}

function blockConfirmDPUExceeded() {
    jQuery("#dpu-exceed-confirmed").prop("checked", false);
    controlsModel.dpuExceedConfirmed(false);
    updateConfirmDPUExceeded();
}

function updateConfirmDPUExceeded() {
    var val = jQuery("#dpu-exceed-confirmed").prop("checked");
    controlsModel.dpuExceedConfirmed(val);
    if (val)
        jQuery('#dpu-exceeded-confirm').removeAttr('disabled');
    else
        jQuery('#dpu-exceeded-confirm').attr('disabled', 'disabled');
}

function onConfirmDPUExceeded() {
    if (!controlsModel.dpuExceedConfirmed()) return;
    jQuery("#liveart-confirm-dpu-exceeded-popup").modal("hide");
    userInteract({ dpuExceedConfirmed: true });
}

function onCancelDPUExceeded() {
    jQuery("#place-order-btn").button("reset");
}

function showAuthAndSaveDialog() {
    var $container = jQuery("#liveart-auth-and-save-dialog");
    clearValidationErrors($container);
    $container.modal("show");
}
/*
 if (isEmailValid(email)) {
        userInteract({
            authorize: email
        });
        jQuery("#liveart-change-user-popup").modal("hide");
        onLoadDesign();
    } else {
        var $emailContainer = jQuery("#liveart-change-user-popup .email-controls");
        var text = laTranslation.translateUI("INVALID_EMAIL_FORMAT");
        showValidationError($emailContainer, text);
        jQuery("#liveart-change-user-email-input").focus();
    }
*/

function onAuthAndSaveDialogSubmit(event) {
    clearValidationErrors(jQuery("#liveart-auth-and-save-dialog"));
    if (event == null || event.keyCode == 13) {
        var email = jQuery("#liveart-auth-and-save-email-input").val();
        var name = jQuery("#liveart-auth-and-save-name-input").val();

        if (!isDesignNameValid(name)) {
            var $designNameContainer = jQuery("#liveart-auth-and-save-dialog .design-name-controls");
            var text = laTranslation.translateUI("INVALID_DESIGN_NAME");
            showValidationError($designNameContainer, text);
            jQuery("#liveart-auth-and-save-name-input").focus();
            return;
        }

        if (!isEmailValid(email)) {
            var $emailContainer = jQuery("#liveart-auth-and-save-dialog .email-controls");
            var text = laTranslation.translateUI("INVALID_EMAIL_FORMAT");
            showValidationError($emailContainer, text);
            jQuery("#liveart-auth-and-save-email-input").focus();
            return;
        }

        userInteract({
            authorize: email,
            saveDesign: name
        }); // if auth will be async - we need callback here

        jQuery("#liveart-auth-and-save-dialog").modal("hide");
        if (controlsModel.isCompact()) {
            liveartUI.closeActiveTab()
        }
    }
}

function showSaveDesignDialog() {
    var $container = jQuery("#liveart-save-design-popup");
    clearValidationErrors($container);
    $container.modal("show");
}

function onSaveDesignDialogSubmit(event) {
    if (event == null || event.keyCode == 13) {
        var name = jQuery("#liveart-save-design-name-input").val();

        if (!isDesignNameValid(name)) {
            var $designNameContainer = jQuery("#liveart-save-design-popup .design-name-controls");
            var text = laTranslation.translateUI("INVALID_DESIGN_NAME");
            showValidationError($designNameContainer, text);
            jQuery("#liveart-save-design-name-input").focus();
            return;
        }

        userInteract({
            saveDesign: name
        });
        jQuery("#liveart-save-design-popup").modal("hide");
        if (controlsModel.isCompact()) {
            liveartUI.closeActiveTab()
        }
    }
}

function showLoadDesignDialog() {
    jQuery("#liveart-designs-list-popup").modal("show");
}

function openTextForm() {
    if (controlsModel.isCompact())
        return;

    liveartUI.showTextForm();
}

function openGraphicsForm() {
    if (controlsModel.isCompact())
        return;

    liveartUI.showGraphicsForm();
}
function openUploadGraphicsForm() {
    if (controlsModel.isCompact())
        return;

    liveartUI.showUploadedGraphicsForm();
}
function onLoadDesignDialogSubmit(event) {
    if (event == null || event.keyCode == 13) {
        if (controlsModel.selectedDesign() != null) {
            jQuery("#liveart-designs-list-popup").modal("hide");
            liveartUI.closeActiveTab();
            userInteract({
                loadDesign: controlsModel.selectedDesign().id
            });
        }
    }
}

function showColorCountDialog() {  
    if (!controlsModel.showUploadedColorsDialog()) {
        controlsModel.imageColorCount(new ImageColorCountVO(true, 0));
        controlsModel.suppressUpdate = false;
        onColorCountDialogSubmit();
        return;
    };
    controlsModel.imageColorCount(new ImageColorCountVO());
    jQuery("#liveart-color-count-popup").modal({
        backdrop: false
    });
    jQuery('#liveart-color-count-popup').on('shown', function () {
        var backdrop = jQuery('<div class="modal-backdrop" />').appendTo(document.body).css({
            opacity: 0
        });
    });
    jQuery('#liveart-color-count-popup').on('hidden', function () {
        jQuery(".modal-backdrop").detach();
    });
}


function onColorCountDialogSubmit() {
    userInteract({
        imageColorCount: controlsModel.imageColorCount().toObject()
    });
    jQuery("#liveart-color-count-popup").modal("hide");
}

jQuery("#liveart-authorization-popup").on("hidden", function () {
    jQuery("#place-order-btn").button("reset");
});

jQuery("#liveart-auth-and-save-dialog").on("hidden", function () {
    jQuery("#place-order-btn").button("reset");
});

function updateMainMenuCount() {
    var elem = jQuery("#liveart-main-menu");
    var count = jQuery("#liveart-main-menu li:visible").length;

    var classes = elem.attr("class");
    var prevClasses = classes.match(/menu-\d?-items/g);
    if (prevClasses) {
        for (var i = 0; i < prevClasses.length; i++) {
            var prevClass = prevClasses[i];
            elem.removeClass(prevClass);
        }
    }

    var newClass = "menu-" + count + "-items";
    elem.addClass(newClass);
}

function onShareDesign() {
    jQuery("#quote-popup").modal("hide");
    userInteract({
        shareDesign: ""
    });
}
function copyShareLink() {
    jQuery("#liveart-share-link-popup .alert").hide();
    try {
        jQuery("#liveart-share-link-input").select();
        var success = document.execCommand('copy');
        if (success) {
            jQuery("#liveart-share-link-popup .alert-success").show();
        } else {
            jQuery("#liveart-share-link-popup .alert-danger").show();
        }
    } catch (err) {
        jQuery("#liveart-share-link-popup .alert-danger").show();
    }
}
function showShareLink() {
    jQuery("#liveart-share-link-popup .alert").hide();
    // jQuery("#liveart-share-link-popup .copy-label").hide();
    jQuery("#liveart-share-link-popup").modal("show");
}

function onSaveDesign() {
    jQuery("#quote-popup").modal("hide");
    userInteract({
        saveDesign: ""
    });
}

function onLoadDesign() {
    jQuery("#quote-popup").modal("hide");
    userInteract({
        loadDesign: ""
    });
}

function setCurrentDesign(design) {
    var title = "";
    if (design && design.title) {
        title = design.title;
    }
    jQuery("#liveart-auth-and-save-name-input").val(title);
    jQuery("#liveart-save-design-name-input").val(title);
}

function changeUser() {
    jQuery("#liveart-designs-list-popup").modal("hide");
    var $container = jQuery("#liveart-change-user-popup");
    clearValidationErrors($container);
    $container.modal("show");
}


function onPlaceOrder() {
    if (jQuery("#place-order-btn").hasClass("disabled")) {
        return false;
    }
    jQuery("#place-order-btn").button("loading");
    userInteract({
        placeOrder: true
    });
}

function placeOrderHandler(id) {
    if (id && controlsModel.redirectUrl) {
        var serverUrl = "services/order.php?design_id=${design_id}";
        window.location.assign(controlsModel.redirectUrl().replace("${design_id}", id));
    }
    jQuery("#place-order-btn").button("reset");
}

window.onbeforeunload = function () {
    if (!controlsModel.status().designSaved) {
        return "By exiting this page all design changes will be lost. This window might also popup as a hickup - then just skip it and continue to have fun!";
    } else {
    }
}

jQuery("#canvas-container").contextmenu(function (event) {
    var window = jQuery(".version-buildtime");
    window.css({ 'left': event.clientX, 'top': event.clientY });
    window.html("<b>LiveArtJS version: </b>" + controlsModel.version() + "<br/><b>Build time: </b>" + controlsModel.buildTime());
    window.show();
    return false;
});

jQuery(document).click(function (event) {
    if (jQuery("#liveart-content").is(":visible")) {
        jQuery(".version-buildtime").hide();
    };
});

// Setting up default container for color pickers
jQuery.fn.colorPicker.defaults.container = jQuery("#liveart-isolate-container");

/**
 * MODAL POPUP WINDOWS AND BUTTONS EVENTS END HERE
 */

// create controls view model
var controlsModel = new LAControlsModel();
ko.applyBindings(controlsModel);
var nnQuantitySynchronizer = new NNQuantitySynchronizer(controlsModel);// add additional properties request for NNQuantitySynchronizer

// before use uncoment it in .ts file
//var nnDebugHelper = new NNDebugHelper(controlsModel, true); //trackNamesNumberSizeQuantities=true 


// this handler will be invoked when UI needs to be updated
function controlsUpdateHandler(updatedModel) {
    controlsModel.update(updatedModel);
}

// this handler will be invoked when LiveArt core need to be updated
function userInteract(o) {
    if (!controlsModel.suppressUpdate)
        liveArt.userInteract(o);
}


