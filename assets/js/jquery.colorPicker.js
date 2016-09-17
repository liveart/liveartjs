/**
 * Really Simple Color Picker in jQuery
 *
 * Licensed under the MIT (MIT-LICENSE.txt) licenses.
 *
 * Copyright (c) 2008-2012
 * Lakshan Perera (www.laktek.com) & Daniel Lacy (daniellacy.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * Modified by Andrii Pavlosiuk
 */

(function (jQuery) {
    /**
     * Create a couple private variables.
    **/
    var selectorOwner,
        activePalette,
        cItterate = 0,
        templates = {
            control: jQuery('<div class="colorPicker-picker">&nbsp;</div>'),
            palette: jQuery('<div id="colorPicker_palette" class="colorPicker-palette" />'),
            swatch: jQuery('<div class="colorPicker-swatch">&nbsp;</div>')
        },
        transparent = "none",
		maxColorsNumber = 30,
        lastColor;
    /**
     * Create our colorPicker function
    **/
    jQuery.fn.colorPicker = function (options) {
        return this.each(function () {
            // Setup time. Clone new elements from our templates, set some IDs, make shortcuts, jazzercise.
            var element = jQuery(this),
                opts = jQuery.extend({}, jQuery.fn.colorPicker.defaults, options),
                defaultColor = jQuery.fn.colorPicker.toHex(
                        (element.val().length > 0) ? element.val() : opts.pickerDefault
                    ),
                newControl = templates.control.clone(),
                paletteId = element.attr("id") + '-palette';

            if (!jQuery.fn.colorPicker.customPaletteClasses) jQuery.fn.colorPicker.customPaletteClasses = {};
            if (opts && opts.paletteClass) jQuery.fn.colorPicker.customPaletteClasses[paletteId] = opts.paletteClass;

            var oldPalette = jQuery('#' + paletteId);
            if (oldPalette) oldPalette.remove();

            /**
             * Build a color palette.
            **/
            //TODO: add palette as options
            jQuery.fn.colorPicker.createPalette(paletteId, opts.colors, defaultColor, opts.skipDefault, opts.showPantones);


            /**
             * Build replacement interface for original color input.
            **/
            newControl.css("background-color", defaultColor);

            newControl.bind("click", function () {
                if (element.is(':not(:disabled)')) {
                    jQuery.fn.colorPicker.togglePalette(jQuery('#' + paletteId), jQuery(this));
                }
            });

            if (options && options.onColorChange) {
                newControl.data('onColorChange', options.onColorChange);
            } else {
                newControl.data('onColorChange', function () { });
            }
            if (options && options.container) {
                newControl.data('container', options.container);
            } else {
                newControl.data('container', null);
            }
            if (options && options.isDropup) {
                newControl.data('isDropup', true);
            } else {
                newControl.data('isDropup', false);
            }
            if (options && options.gap) {
                newControl.data('gap', options.gap);
            } else {
                newControl.data('gap', 1);
            }
            
            element.after(newControl);

            element.bind("change", function () {
                element.next(".colorPicker-picker").css(
                    "background-color", jQuery.fn.colorPicker.toHex(jQuery(this).val())
                );
            });

            // Hide the original input.
            element.val(defaultColor).hide();

            cItterate++;
        });
    };

    //TODO: optimize 
    function addSwatches(colors, newPalette, defaultColor, noBind) {
        if (!colors) return;
        jQuery.each(colors, function (i) {
            swatch = templates.swatch.clone();
            swatch.addClass('tooltipster');
            swatch.attr("data-color", colors[i].value);

            if (colors[i].value === transparent || this.value === transparent) {
                swatch.addClass('transparent');
                if (this.name)
                    swatch.attr("title", this.name);

                if (defaultColor === colors[i].value)
                    swatch.addClass("selected");

                if (!noBind)
                    jQuery.fn.colorPicker.bindPalette(swatch, transparent);
            } else {
                var currentColor = jQuery.fn.colorPicker.toHex(this.value != undefined ? this.value : this);
                swatch.css("background-color", currentColor);
                swatch.attr("name", this.name);
                if (this.name)
                    swatch.attr("title", this.name);

                if (defaultColor === currentColor)
                    swatch.addClass("selected");

                if (!noBind)
                    jQuery.fn.colorPicker.bindPalette(swatch);
            }
            swatch.appendTo(newPalette);
        });
    }
    var pantomsHTLM;
    function getPantomsHTML(pantones, defaultColor) {
        if (!pantomsHTLM) {
            pantomsHTLM = templates.palette.clone();
            addSwatches(pantones, pantomsHTLM, defaultColor, true);
            pantomsHTLM.addClass("pantones-container");
        }
        //return pantomsHTLM;
        var html = pantomsHTLM.clone();
        return html;
    }

    var pickerColors = {};
    var skipDefaultData = {};
    var colorsData = {};
    var pantonesInfo = {};

    /**
     * Extend colorPicker with... all our functionality.
     * skipDefault - boolean or undefined. If true or present in skipDefaultData object - skipping the default color value
    **/
    jQuery.extend(true, jQuery.fn.colorPicker, {
        createPalette: function (paletteId, colors, defaultColor, skipDefault, showPantones) {
            var pantones = jQuery.fn.colorPicker.defaults.pantones;
            
            // reading showPantones value from the storage
            if (showPantones === undefined) {
                if (pantonesInfo[paletteId]) {
                    showPantones = pantonesInfo[paletteId].showPantones;
                } else {
                    showPantones = false;
                }
            }

            pickerColors[paletteId] = colors;
            if (skipDefault === undefined) {
                skipDefault = skipDefaultData[paletteId];
            } else {
                skipDefaultData[paletteId] = skipDefault;
            }
            if (defaultColor == undefined && colors.length > 0)
                defaultColor = colors[0].value;
            if (skipDefault) defaultColor = undefined;
            var customClasses = "";
            if (jQuery.fn.colorPicker.customPaletteClasses[paletteId]) customClasses = jQuery.fn.colorPicker.customPaletteClasses[paletteId];
            var newPalette = templates.palette.clone(),
                swatch;

            if (colorsData[paletteId]) defaultColor = colorsData[paletteId];

            var onlyTrasparent = false; // if only trasparent color in list - is't background color picker
            if (colors && colors.length === 1) {
                onlyTrasparent = (colors[0].value === transparent);
            }

            if (colors && colors.length > 0 && !onlyTrasparent) {
                addSwatches(colors, newPalette, defaultColor);
            } else {
                var fb = newPalette.farbtastic(
                    function (color) {
                        if (selectorOwner)
                            jQuery.fn.colorPicker.changeColor(selectorOwner.prev('input').attr('id'), color);
                    }
                   )[0].farbtastic;
                newPalette.css('width', 'auto');

                if (onlyTrasparent) { // background color
                    fb.enableTransparent(transparent);
                }
            }

            var self = this;
            if (showPantones) {
                pantonesInfo[paletteId] = { showPantones: showPantones, drawn: true };
                var defaultId = paletteId + "-default";
                var pantonesId = paletteId + "-pantones";
                var tabsId = paletteId + "-tabs";
                var newContainer = jQuery(
                    '<div class="picker-with-pantons">' +
                        '<ul id="' + tabsId + '" class ="nav nav-tabs">' +
                            '<li data-toggle="tab" class ="active default-nav"><a href="#' + defaultId + '"><span>Default</span></a></li>' +
                            '<li data-toggle="tab" class="pantones-nav"><a href="#' + pantonesId + '"><span>Pantones</span></a></li>' +
                            '</ul>' +
                        '<div class="tab-content">' +
                            '<div id="' + defaultId + '" class="tab-pane default-tab active"> </div>' +
                            '<div id="' + pantonesId + '"class="tab-pane pantones-tab" >' +
                            '</div>' +
                        '</div>' +
                    '</div>');

                if (fb) {
                    newContainer.addClass("picker-with-farbtastic");
                }

                newContainer.find(".default-tab").append(newPalette);
                newPalette = newContainer;

                newContainer.find('ul.nav-tabs li a').click(function (e) {
                    var selector = jQuery(this).attr("href");
                    var elem = jQuery(selector);
                    elem.parent().find(".active").removeClass("active");
                    elem.addClass("active");

                    var globalPantones = jQuery.fn.colorPicker.globalPantones;
                    if (selector.indexOf("-pantones") > -1 && globalPantones) {
                        globalPantones.show();
                        var position = jQuery.fn.colorPicker.getLeftUpperCornerCoordinates(elem);
                        globalPantones.css({ top: position.top, left: position.left });
                        //mark palette as product palette
                        var productMarker = elem.parent().parent().hasClass("product-color-picker");
                        if (productMarker) {
                            globalPantones.addClass("product-color-picker");
                        } else {
                            globalPantones.removeClass("product-color-picker");
                        }
                    } else {
                        if(globalPantones) globalPantones.hide();
                    }
                });

            } else {
                pantonesInfo[paletteId] = { showPantones: showPantones, drawn: false };
            }
            newPalette.attr('id', paletteId);
            var container = jQuery.fn.colorPicker.defaults.container || jQuery('body');
            container.append(newPalette);
            if (colors.length > maxColorsNumber) {
                newPalette.addClass("scrolled-element");
            }
            if(customClasses) newPalette.addClass(customClasses)
            newPalette.hide();

            jQuery('#' + paletteId + ' .tooltipster').tooltipster({ theme: 'tooltipster-noir' });

            if (colorsData[paletteId]) {
                var inputId = paletteId.replace("-palette", "")
                jQuery.fn.colorPicker.changeColor(inputId, colorsData[paletteId]);
            }
        },
        setColors: function (inputId, newColors) {
            //TODO: compare colors, ignore the same set
            var paletteId = inputId + '-palette';

            var oldPalette = jQuery('#' + paletteId);
            if (oldPalette.length == 0) return;
            var prevColors = pickerColors[paletteId];
            // if colors are the same - do not redraw palette
            if (prevColors && newColors && prevColors.length > 0) {
                if (prevColors.length == newColors.length) {
                    var theSame = true;
                    for (var i = 0; i < newColors.length; i++) {
                        if (!(prevColors[i].name == newColors[i].name &&
                            prevColors[i].value == newColors[i].value)) {
                            theSame = false;
                            break;
                        }
                    }
                    if (theSame) {
                        return;
                    }
                }
            }
            oldPalette.remove();
            jQuery.fn.colorPicker.createPalette(paletteId, newColors);
        },
        /**
         * Return a Hex color, convert an RGB value and return Hex, or return false.
         *
         * Inspired by http://code.google.com/p/jquery-color-utils
        **/
        toHex: function (color) {
            // If we have a standard or shorthand Hex color, return that value.
            if (color.match(/[0-9A-F]{6}|[0-9A-F]{3}$/i)) {
                return (color.charAt(0) === "#") ? color : ("#" + color);

                // Alternatively, check for RGB color, then convert and return it as Hex.
            } else if (color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/)) {
                var c = ([parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)]),
                    pad = function (str) {
                        if (str.length < 2) {
                            for (var i = 0, len = 2 - str.length; i < len; i++) {
                                str = '0' + str;
                            }
                        }

                        return str;
                    };

                if (c.length === 3) {
                    var r = pad(c[0].toString(16)),
                        g = pad(c[1].toString(16)),
                        b = pad(c[2].toString(16));

                    return '#' + r + g + b;
                }

                // Otherwise we wont do anything.
            } else {
                return false;

            }
        },
        touchStart: function (e) {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            if (touch) {
                jQuery.fn.colorPicker.touchStartCoordinations = { x: touch.pageX, y: touch.pageY };
            }
        },
        /**
         * Check whether user clicked on the selector or owner.
        **/
        checkMouse: function (event, paletteId) {
            var selector = activePalette,
                selectorParent = jQuery(event.target).parents("#" + selector.attr('id')).length;

            var container = selectorOwner.data('container');

            if (event.target === jQuery(selector)[0] || event.target === selectorOwner[0] || selectorParent > 0 ||
                (container && (container.has(event.target).length > 0 || container.is(event.target)))) {
                return;
            }
            var globalPantones = jQuery.fn.colorPicker.globalPantones;
            if (globalPantones && event.target === jQuery(globalPantones)[0] ||
               (globalPantones && (globalPantones.has(event.target).length > 0 || globalPantones.is(event.target)))) {
                return;
            }
            if (event.type == 'touchend' && jQuery.fn.colorPicker.touchStartCoordinations) {
                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                if (touch && (Math.abs(touch.pageX - jQuery.fn.colorPicker.touchStartCoordinations.x) > 10 || Math.abs(touch.pageY - jQuery.fn.colorPicker.touchStartCoordinations.y) > 10))
                    return;
            } else {
                jQuery.fn.colorPicker.touchStartCoordinations = undefined;
            }

            jQuery.fn.colorPicker.hidePalette();
        },

        /**
         * Hide the color palette modal.
        **/
        hidePalette: function () {
            jQuery(document).unbind("mousedown", jQuery.fn.colorPicker.checkMouse);
            jQuery(document).unbind("touchstart", jQuery.fn.colorPicker.touchStart);
            jQuery(document).unbind("touchend", jQuery.fn.colorPicker.checkMouse);

            if (activePalette) activePalette.hide();
            var globalPantones = jQuery.fn.colorPicker.globalPantones;
            if (globalPantones) {
                globalPantones.find('.close').click();
                globalPantones.hide();
            }
        },
        getLeftUpperCornerCoordinates: function(palette){
            var _selectorOwner = selectorOwner.data('container') ? selectorOwner.data('container') : selectorOwner,
                _offset = _selectorOwner.offset(),
                _gap = selectorOwner.data('gap');
            var posTop = _offset.top + (selectorOwner.data('isDropup') ? -(palette.outerHeight() + _gap) : (_selectorOwner.outerHeight() + _gap));
            if (posTop < 0) posTop = 0;

            var posLeft = _offset.left;
            if (posLeft < 0) posLeft = 0;
            if (posLeft + palette.outerWidth() > window.innerWidth) {
                posLeft -= posLeft + palette.outerWidth() - window.innerWidth;
            }
            return { left: posLeft, top: posTop };
        },
        /**
         * Show the color palette modal.
        **/
        showPalette: function (palette) {
            var hexColor = selectorOwner.prev("input").val();

            jQuery.fn.colorPicker.globalPantonesTargetId = selectorOwner.prev('input').attr('id');

            var position = jQuery.fn.colorPicker.getLeftUpperCornerCoordinates(palette);
            palette.css({ top: position.top, left: position.left });

            jQuery("#color_value").val(hexColor);
            //farbtastic logic
            if (palette.find(".colorPicker-palette").get(0) && palette.find(".colorPicker-palette").get(0).farbtastic)
                palette.find(".colorPicker-palette").get(0).farbtastic.setColor(hexColor);
            //hiding previous selected palette
            palette.show();

            var globalPantones = jQuery.fn.colorPicker.globalPantones;
            if(globalPantones){
                // setting active swatch
                var paletteId = palette.attr("id");
                var inputId = paletteId.replace("-palette", "");
                var input = jQuery("#" + inputId);
                jQuery.fn.colorPicker.setPantonesColor(input.val());

                var $pantonesContainer = globalPantones.find(".pantones-container")
                if ($pantonesContainer) {
                    $pantonesContainer.scrollTop(0);
                }
            }

            jQuery(document).bind("mousedown", jQuery.fn.colorPicker.checkMouse);
            jQuery(document).bind("touchstart", jQuery.fn.colorPicker.touchStart);
            jQuery(document).bind("touchend", jQuery.fn.colorPicker.checkMouse);

            jQuery.fn.colorPicker.colorValueChanged(palette);
        },

        /**
         * Toggle visibility of the colorPicker palette.
        **/
        togglePalette: function (palette, origin) {
            // selectorOwner is the clicked .colorPicker-picker.
            if (origin) {
                selectorOwner = origin;
            }

            //close previous palette if it is necessary
            if (!palette || (activePalette && activePalette.attr("id") != palette.attr("id"))) {
                jQuery.fn.colorPicker.hidePalette();
            }
            activePalette = palette;

            if (activePalette.is(':visible')) {
                jQuery.fn.colorPicker.hidePalette();
            } else {
                jQuery.fn.colorPicker.showPalette(palette);

            }
           
        },
        /**
         * Update the input with a newly selected color.
        **/
        changeColor: function (inputId, value) {
            colorsData[inputId + '-palette'] = value;
            if (value && value !== transparent) value = value.toUpperCase();
            var input = jQuery('#' + inputId);
            var picker = input.next('div.colorPicker-picker');
            if (picker.length == 0) return;
            var isTransparent = (value === transparent);
            if (!isTransparent) {
                picker.css('background-color', value);
            } else {
                picker.css('background-color', '#ffffff');
            }
            picker.toggleClass('transparent', isTransparent);
            input.val(value).change();

            var palette = jQuery('#' + inputId + '-palette');

            //farbtastic logic
            if (palette.find(".colorPicker-palette").get(0) && palette.find(".colorPicker-palette").get(0).farbtastic)
                palette.find(".colorPicker-palette").get(0).farbtastic.setColor(value);

            palette.find(".colorPicker-swatch").each(function () {
                jQuery(this).removeClass("selected");
                if (jQuery(this).hasClass("transparent") && value == transparent) {
                    jQuery(this).addClass("selected");
                } else {
                    var color = jQuery.fn.colorPicker.toHex(jQuery(this).css('background-color'));
                    color = color.toUpperCase();
                    if (color == value && !jQuery(this).hasClass("transparent")) {
                        jQuery(this).addClass("selected");
                    }
                }
            });
            jQuery.fn.colorPicker.setPantonesColor(value);

            picker.data('onColorChange').call(picker, input.attr('id'), value);
        },
        colorValueChanged: function (palette) {
            var globalPantones = jQuery.fn.colorPicker.globalPantones;

            var $selectedColor = palette.find(".colorPicker-swatch.selected");
            var $selectedPantones;
            if (globalPantones) $selectedPantones = globalPantones.find(".colorPicker-swatch.selected");

            if ($selectedColor && $selectedColor.length > 0) {
                palette.find(".default-nav a").click();
            } else if ($selectedPantones && $selectedPantones.length > 0) {
                palette.find(".pantones-nav a").click();
                var $pantonesContainer = globalPantones.find(".pantones-container")
                if ($pantonesContainer) {
                    $pantonesContainer.scrollTop(0);
                    $pantonesContainer.scrollTop($selectedPantones.offset().top - $pantonesContainer.offset().top);
                }
            }
        },

        /**
         * Preview the input with a newly selected color.
        **/
        previewColor: function (value) {
            var isTransparent = (value === transparent);
            if (!isTransparent) {
                selectorOwner.css('background-color', value);
            } else {
                selectorOwner.css('background-color', '#ffffff');
            }
            selectorOwner.toggleClass('transparent', isTransparent);
        },

        /**
         * Bind events to the color palette swatches.
        */
        bindPalette: function (element, color) {
            color = color ? color : jQuery.fn.colorPicker.toHex(element.css('background-color'));

            element.bind({
                click: function (ev) {
                    lastColor = color;

                    jQuery.fn.colorPicker.changeColor(selectorOwner.prev('input').attr('id'), color);
                },
                mouseover: function (ev) {
                    lastColor = selectorOwner.hasClass('transparent') ? transparent : selectorOwner.css('background-color');

                    jQuery.fn.colorPicker.previewColor(color);
                },
                mouseout: function (ev) {
                    jQuery.fn.colorPicker.previewColor(lastColor);
                }
            });
        },
        setPantones: function (pantones) {
            jQuery.fn.colorPicker.defaults.pantones = pantones;
            jQuery.fn.colorPicker.onPantonsSet();
        },
        /*Pantones element. One for all color pickers*/
        globalPantones: undefined,
        /*Pantones target. Id of color picker input element*/
        globalPantonesTargetId: undefined,
        /*
        * Creates global pantones element
        */
        onPantonsSet: function () {
            if (globalPantones) return; //prevent double creating
            //generates global pantones
            var globalPantones = jQuery.fn.colorPicker.globalPantones = jQuery(
                '<div id="global-pantones" class="tab-pane pantones-tab picker-with-pantons" >' +
                    '<div class="search-box">' +
                        '<div class="input-group">' +
                            '<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>' +
                            '<input type="text" class="form-control" placeholder="Search Pantones">' +
                            '<button class="close" aria-hidden="true" data-bind="visible: graphicsSearchQuery().length > 0, click: clearGraphicsSearch">&times;</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="divider"></div>' +
                '</div>');
            var container = jQuery.fn.colorPicker.defaults.container || jQuery('body');
            globalPantones.appendTo(container);
            globalPantones.hide();

            var newPantones = getPantomsHTML(jQuery.fn.colorPicker.defaults.pantones, null);
            globalPantones.append(newPantones);

            newPantones.find('.tooltipster').tooltipster({ theme: 'tooltipster-noir' });
            function applySearch() {
                var container = jQuery(this).parent().parent().parent();
                var $this = jQuery(this);
                var pantonesContainer = globalPantones.find('.pantones-container');
                pantonesContainer.find('.no-result').remove()
                var swatches = pantonesContainer.find('div');
                var query = $this.val().toLowerCase();
                var elemExists = false;
                if (swatches) {
                    swatches.each(function (i, elem) {
                        var $elem = jQuery(elem);
                        $elem.show();
                        var hide = false;
                        if (query && query.length) {
                            var name = $elem.attr("name");
                            if (name && name.length) {
                                name = name.toLowerCase();
                                hide = name.indexOf(query) == -1;
                            } else {
                                hide = true;
                            }
                        }
                        if (hide) {
                            $elem.hide();
                        } else {
                            elemExists = true;
                        }
                    });
                }
                if (!elemExists) {
                    var tip = jQuery('<div class="no-result"><h6> There is no color with such name </h6></div>');
                    pantonesContainer.append(tip);
                }
            }

            // Event subscribing starts here
            globalPantones.find('.close').click(function (e) {
                jQuery(this).parent().find('input').val('');
                applySearch.apply(jQuery(this).parent().find('input'));
            });

            globalPantones.find('input').on("change paste keyup", function (e) {
                applySearch.apply(this);
            });
            globalPantones.on('mousedown', function (e) {
                e.stopPropagation();
                var globalPantonesTargetId = jQuery.fn.colorPicker.globalPantonesTargetId;
                var color = e.target.getAttribute("data-color");
                if (globalPantonesTargetId && color) jQuery.fn.colorPicker.changeColor(globalPantonesTargetId, color);
            })
        },
        /*
        * removes previous value and sets a new one to global pantones palette
        */
        setPantonesColor: function (value) {
            var globalPantones = jQuery.fn.colorPicker.globalPantones;
            if (!globalPantones || !value) return;
            globalPantones.find(".selected").removeClass("selected");
            globalPantones.find('[data-color="' + value + '"]').addClass("selected");
        },
        /*
        * Showing/hiding the pantones in color picker
        **/
        showPantones: function (inputId, showPantones) {
            var paletteId = inputId + '-palette';
            // reading showPantones value from the storage
            if (showPantones === undefined) return;

            if (pantonesInfo[paletteId] && pantonesInfo[paletteId].showPantones == showPantones) return;

            var oldPalette = jQuery('#' + paletteId);
            if (oldPalette) oldPalette.remove();
            jQuery.fn.colorPicker.createPalette(paletteId, pickerColors[paletteId], undefined, undefined, showPantones);
        }
    });

    /**
     * Default colorPicker options.
     *
     * These are publibly available for global modification using a setting such as:
     *
     * jQuery.fn.colorPicker.defaults.colors = ['151337', '111111']
     *
     * They can also be applied on a per-bound element basis like so:
     *
     * jQuery('#element1').colorPicker({pickerDefault: 'efefef', transparency: true});
     * jQuery('#element2').colorPicker({pickerDefault: '333333', colors: ['333333', '111111']});
     *
    **/
    jQuery.fn.colorPicker.defaults = {
        // colorPicker default selected color.
        pickerDefault: "000000",

        // Default color set.
        colors: ['000000'/*
            '000000', '993300', '333300', '000080', '333399', '333333', '800000', 'FF6600',
            '808000', '008000', '008080', '0000FF', '666699', '808080', 'FF0000', 'FF9900',
            '99CC00', '339966', '33CCCC', '3366FF', '800080', '999999', 'FF00FF', 'FFCC00',
            'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0', 'FF99CC', 'FFCC99',
            'FFFF99', 'CCFFFF', '99CCFF'*/, 'FFFFFF'
        ],

        // If we want to simply add more colors to the default set, use addColors.
        addColors: [],
        pantones: [],
        /** JQuery element where a new color pickers will be put */
        container: jQuery("body")
    };

})(jQuery);
