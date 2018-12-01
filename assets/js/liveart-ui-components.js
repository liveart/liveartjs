var liveartUI = {
    activeTab: null,
    productColorPicker: null,
    textFillColorPicker: null,
    textStrokeColorPicker: null,
    textForm: null,
    textFillColorPicker2: null,
    textStrokeColorPicker2: null,
    textFillColorPicker3: null,
    textStrokeColorPicker3: null,
    productsGallery: null,
    productCategories: null,
    graphicsGallery: null,
    graphicsCategories: null,
    graphicsFillColorPicker: null,
    graphicsStrokeColorPicker: null,
    productDimensionsWidth: null,
    productDimensionsHeight: null,
    zoomSlider: null,
    resetFocusToTextTab: true,
    alertFadeOutTime: 5000,
    //value `@mainContainerWidth` from `variable.config.less`
    minDesktopViewWidth: 906,

    closeActiveTab: function (leaveExpanded) {
        jQuery('#main-controls-container #liveart-main-menu .active').removeClass('active');
        jQuery('#main-controls-container #liveart-main-menu .open').removeClass('open');
        jQuery('#main-controls-container .liveart-tabs-content > .active').removeClass('active in');
        if (!leaveExpanded) jQuery('#liveart-main-container').removeClass('collapsed');
        if (!liveartUI.isCompact()) {
            if (jQuery('#add-graphics > a').is(liveartUI.activeTab)) {
                liveartUI.showGraphicsForm();
            } else {
                liveartUI.showForm("product-colors-form");
            }
        } else {
            liveartUI.activeTab = null;
        }

    },
    hideExpandedWindow: function () {
        jQuery('#main-controls-container .liveart-tabs-content > .expanded').removeClass('expanded');
    },
    showExpandedWindow: function (formId) {
        jQuery("#" + formId + '.tab-pane.expandable-tab').addClass('expanded');
    },

    /* jQuery File Upload init function */
    initFileUpload: function (scriptUrl, uploadHandler) {
        if (!jQuery("#fileupload").length) {
            var input = jQuery('<input id="fileupload" type="file" name="image" class="invisible" accept="image/*"/>');
            jQuery("#liveart-file-upload-container").append(input);
        }
        var modal = jQuery('#liveart-preloader'),
            bar = modal.find('.progress-bar');

        var maxFileSizeMb = 16;
        var maxFileSize = maxFileSizeMb * 1024 * 1024;
        var acceptFileTypes = /^image\/(jpg|jpeg|svg\+xml|gif|bmp|png)$/i;

        jQuery('#fileupload').fileupload({
            dataType: 'json',
            dropZone: null,
            url: scriptUrl,
            add: function (e, data) {
                try {
                    var error = false;
                    if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                        userInteract({showImageTypeNotSupportedWarning: true});
                        error = true;
                    }

                    if (data.originalFiles[0]['size'] > maxFileSize) {
                        userInteract({showImageTooLargeWarning: maxFileSizeMb});
                        error = true;
                    }
                } catch (e) {
                    console.error(e);
                }
                if (!error) {
                    data.submit();
                }
            },
            done: function (e, data) {
                // modal.modal('hide'); TODO temporary solution. hide call from preloaderStatus.subscribe function when image added
                try {
                    if (!data.result.error && uploadHandler) {
                        uploadHandler(data.result.url);
                    } else {
                        liveartUI.addAlert(data.result.error.message, "error");
                        modal.modal('hide');
                    }
                } catch (e) {
                    console.error(e);
                    modal.modal('hide');
                }
                jQuery("#liveart-upload-image-browse-btn").button("reset");
            },
            progressall: function (e, data) {
                jQuery("#liveart-upload-image-browse-btn").button("loading");
                var progress = parseInt(data.loaded / data.total * 100, 10);
                jQuery('.progress-bar.animate').css(
                    'width',
                    progress + '%'
                );
            },
            fail: function (e, data) {
                modal.modal('hide');
                var msg = laTranslation.translateUI("UPLOADING_ERROR_MESSAGE");
                liveartUI.addAlert(msg, "error");
                jQuery("#liveart-upload-image-browse-btn").button("reset");
            },
            start: function (e) {
                modal.modal('show');
                var $text = modal.find(".preloader-text");
                if ($text && $text.length) {
                    $text[0].innerHTML = laTranslation.translateUI("UPLOADING_IMAGE_MESSAGE");
                }
                bar.addClass('animate');
            }
        });

        if (!jQuery.support.fileInput) {
            jQuery("#liveart-file-upload-container").hide();
        }

    },
    /* end jQuery File Upload init function */

    /* File Upload by URL function */

    fileUploadByUrl: function (scriptUrl, fileurl) { // upload by url — deprecated
        var modal = jQuery('#liveart-upload-bar'),
            bar = modal.find('.progress-bar');
        // encodeURIComponent - should be present because file url may contains special characters.
        // Example: facebook URL https://pathToimage?oh=44a290be459d5ab0aa556615568270ca&oe=5877BA96 will be splited on 2 arguments

        jQuery.ajax({
            dataType: 'json',
            type: 'POST',
            url: scriptUrl,
            data: "fileurl=" + encodeURIComponent(fileurl),
            success: function (data) {
                modal.modal('hide');
                if (!data.error) {
                    userInteract({uploadGraphics: data.url});
                } else {
                    liveartUI.addAlert(data.error.message || data.error, "error");
                    alert(data.error.message || data.error);
                }
            },
            beforeSend: function (data) {
                modal.modal('show');
                bar.addClass('animate');
                jQuery('#liveart-upload-bar .animate').css('width', '100%');
            },
            fail: function (data) {
                modal.modal('hide');
                var msg = laTranslation.translateUI("UPLOADING_ERROR_MESSAGE");
                liveartUI.addAlert(msg, "error");
            },
            error: function (data) {
                modal.modal('hide');
                var msg = laTranslation.translateUI("UPLOADING_ERROR_MESSAGE");
                liveartUI.addAlert(msg, "error");
            }
        });
    },
    /* end File Upload by URL function */

    /**stores key: css class for an alert*/
    alertLevels: {error: "alert-danger", info: "alert-info", warning: "alert-warning", success: "alert-success"},
    /**stores key: jQuery selector for an alert*/
    alertTargets: {canvas: "#alert-container"/*, authDialog: "#auth-and-save-alert-container", loadingScreen: "#liveart-init-alert-container"*/},
    // target currently is not used
    addAlert: function (text, level, target) {
        if (!level || !(level in this.alertLevels)) {
            level = "warning";
        }
        if (!target || !(target in this.alertTargets)) {
            target = "canvas";
        }
        var container = jQuery(this.alertTargets[target]);
        var element = jQuery('<div class="alert ' + this.alertLevels[level] + ' alert-dismissible" role="alert"></div>');
        var close = jQuery('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>');
        element.append(close);
        element.on("closed.bs.alert", function (target) {
            onAlertContainerChange(target);
            return false;
        }.bind(null, this.alertTargets[target]));
        element.append(jQuery('<span> ' + text + '</span>'));
        container.append(element);
        onAlertContainerChange(this.alertTargets[target]);

        var processFadeOut = function (elem, target) {
            elem.fadeOut('slow');
            setTimeout(onAlertContainerChange.bind(null, target), 2000);
        }.bind(null, element, this.alertTargets[target]);

        setTimeout(processFadeOut, this.alertFadeOutTime);
    },

    //Called from both user click (`jQuery('ul.liveart-list-view > li > a').click`)
    //and call from the Core via API (liveartUI.showForm)
    setFocusToTextTab: function () {
        //TODO: add check for tablet - to avoid screen keyboard if not needed
        //Turned off as glitchy feature in TASK908, more info in TASK910
        /*
        if (jQuery('#add-text').hasClass("open")) {
            //set focus
            if (jQuery("#add-text-input").is(':visible')) {
                setTimeout(function () {
                    jQuery("#add-text-input").focus();
                }, 0);
            } else if (jQuery("#edit-text-input").is(':visible')) {
                setTimeout(function () {
                    jQuery("#edit-text-input").focus();
                }, 0);
            }
        }
        */
    },

    //TODO: remove useless wrapper
    showTextForm: function () {
        this.showForm("text");
    },
    //TODO: remove useless wrapper
    //TODO: move extra code to menuData."add-graphics".precondition
    showGraphicsForm: function () {
        //extra code - why it is here???
        var selector = "add-graphics";
        var menuItem = this.menuData[selector].selectors;
        if (jQuery(menuItem.form).hasClass("large-tab")) {
            jQuery(menuItem.form).removeClass("large-tab");
            jQuery(menuItem.form).addClass("small-tab");
        }
        //end of extra code
        this.showForm("add-graphics");
    },
    //TODO: remove useless wrapper
    showUploadedGraphicsForm: function () {
        this.showForm("upload-graphics")
    },

    /*
    * menuData contains information about tabs selecting
    * Used for manupulating forms from the LA Core API
    * User input is handling in `jQuery('ul.liveart-list-view > li > a').click` listener
    * 
    * element.selectors.menu and element.selectors.form - are mandatory fields
    * element.precondition - optional - function. if returns false - interrupt selecting process
    * element.callback - optional - function. This function is called after the tab was selected
    */
    menuData: {
        text: {
            selectors: {
                menu: "#add-text",
                form: "#add-text-form"
            },
            precondition: function () {
                if (jQuery('#add-names-form').hasClass('active') && !this.resetFocusToTextTab) return false;
                return true;
            },
            callback: function () {
                liveartUI.setFocusToTextTab();
            }
        },
        "add-graphics": {
            selectors: {
                menu: "#add-graphics",
                form: "#add-graphics-form"
            }
        },
        "upload-graphics": {
            selectors: {
                menu: "#upload-graphics",
                form: "#upload-graphics-form"
            }
        },
        "product-colors-form": {
            selectors: {
                menu: "#change-colours",
                form: "#product-colors-form"
            }
        }
    },
    /*
    * Selecting menu item using `menuData` structure above
    * Warning: skipped for mobile view (controlsModel.isCompact() - see in action.js)
    * @selector - string - key from liveartUI.menuData
    */
    showForm: function (selector) {
        var keys = Object.keys(this.menuData);
        if (keys.indexOf(selector) >= 0) {
            var menuItem = this.menuData[selector];
            // should pass precondition function if it is set. menuItem.precondition - should return true to continue selecting process
            if (menuItem.precondition && !menuItem.precondition()) return;
            var selectors = menuItem.selectors;
            if (selectors && selectors.menu && selectors.form) {
                jQuery('#liveart-main-container').addClass('collapsed');
                jQuery("#liveart-main-menu > li:not(" + selectors.menu + ")").removeClass("open active");
                jQuery("#liveart-main-menu " + selectors.menu).addClass("open active");

                jQuery(".liveart-tabs-content.tab-content > div:not(" + selectors.form + ")").removeClass("active");
                jQuery(selectors.form).addClass("active in");
                this.activeTab = jQuery('li' + selectors.menu + ' > a');

                if (menuItem.callback) {
                    menuItem.callback();
                }
            }
        }
    },

    //Why it's the same as `controlsMode.isCompact()` ?
    isCompact: function () {
        return jQuery(window).width() < liveartUI.minDesktopViewWidth;
    },


    // This funciton is overrided below
    // Element - DOM container with img.lazy-load
    // force - if true - updating images without delay
    updateLazyLoadContainer: function (element, force) {

    }
}

/*
* This code frament fixes an issue with the height of alert container in IE.
* For more information see LAJS/TASK708
* @param selector - jQuery selector for alert container
*/
function onAlertContainerChange(selector) {
    var elems = jQuery(selector + " .alert:hidden").remove();
    var elem = jQuery(selector);
    if (!elem.hasClass("dynamic-height")) elem.addClass("dynamic-height");
    // 1. Setting specific class for height computing
    elem.addClass("dynamic-height-helper");
    // 2. Computing height of the container
    var height = parseFloat(elem.innerHeight());
    var maxHeight = parseFloat(elem.css("max-height"));
    if (maxHeight && maxHeight < height) {
        height = maxHeight;
    }
    // 3. removing class-helper
    elem.removeClass("dynamic-height-helper");
    // 4. setting height of the container
    elem.css("height", height);
};

jQuery(function () {
    /* LiveArt Main Menu behavior begins */
    var activeTab;

    //Legacy Click handler for the Main Menu
    //Handler for calls from the Core via API - `liveartUI.showForm()`
    jQuery('ul.liveart-list-view > li > a').click(function (e) {
        if (jQuery('#clear-design > a').is(e.currentTarget)) {
            if (liveartUI.isCompact()) liveartUI.closeActiveTab();
            return;
        }

        if (liveartUI.activeTab && liveartUI.activeTab.length) {
            if (liveartUI.isCompact()) {
                liveartUI.activeTab.parent().removeClass('open');
                jQuery('#liveart-main-container').removeClass('collapsed');
                if (liveartUI.activeTab.parent().hasClass('active')) {
                    var href = jQuery(e.currentTarget).attr('href') || "";
                    if (href) {
                        var id = href.replace('#', '');
                        jQuery('.liveart-tabs-content > #' + id).removeClass('active');
                    }
                }
            } else if (!liveartUI.activeTab.is(e.currentTarget)) {
                liveartUI.activeTab.parent().removeClass('open');
            }
        } else {
            var href = jQuery(e.currentTarget).attr('href');
            if (href !== undefined) {
                var id = href.replace('#', '');
                jQuery('.liveart-tabs-content > #' + id).addClass('active');
            }
            jQuery('#liveart-main-container').addClass('collapsed');
        }

        if (!(liveartUI.activeTab && liveartUI.activeTab.is(e.currentTarget))) {
            jQuery('#liveart-main-container').addClass('collapsed');
            liveartUI.activeTab = jQuery(e.currentTarget);
            liveartUI.activeTab.parent().addClass('open');
            if (jQuery('#add-text').hasClass("open")) {
                liveartUI.setFocusToTextTab();
            }
        } else if (liveartUI.isCompact()) {
            liveartUI.activeTab = null;
        }
    });

    if (!liveartUI.activeTab && !liveartUI.isCompact()) {
        liveartUI.showForm("product-colors-form")
    }

    jQuery('.tab-pane .liveart-dropdown-form-header > .liveart-close-form-btn').click(function (e) {
        liveartUI.closeActiveTab();
        var target = jQuery(e.currentTarget).parents().eq(1);
        var targetId = target.attr('id');
        var menuParent = jQuery('[href=#' + targetId + ']').parents().eq(0);
        target.removeClass('active');
        menuParent.removeClass('active');
    });

    jQuery('.tab-pane .liveart-dropdown-form-header > .liveart-header-btn').click(function (e) {
        if (jQuery(e.currentTarget).parents().hasClass('expandable-tab')) {
            jQuery(e.currentTarget).parents('.tab-pane').toggleClass('expanded');
        } else {
            jQuery(e.currentTarget).parents('.tab-pane').toggleClass('large-tab small-tab');
        }
    });

    jQuery('.tab-pane .liveart-expand-form-btn').click(function (e) {
        jQuery(e.currentTarget).parents('.tab-pane').toggleClass('expanded');
    });

    /* LiveArt Main Menu behavior ends */

    jQuery.fn.colorPicker.defaults.colors = ['000', 'fff'];
    liveartUI.textForm = jQuery('#add-text-form');
    liveartUI.productCategories = jQuery('#liveart-product-categories');
    liveartUI.productsGallery = jQuery('#liveart-product-gallery');
    liveartUI.productsGallery.hide();
    liveartUI.graphicsCategories = jQuery('#liveart-graphics-categories');
    liveartUI.graphicsGallery = jQuery('#liveart-graphics-gallery');
    liveartUI.graphicsGallery.hide();
    liveartUI.zoomSlider = jQuery('#zoom-container');
    // SVG injection init
    SVGInjector(document.querySelectorAll('img.inject-me'));
    //Bootstrap tooltips
    jQuery('[data-toggle="tooltip"]').tooltip();

    //Tooltipster for main menu
    jQuery('[data-toggle="menu-tooltipster"]').tooltipster({
        theme: 'tooltipster-borderless',
        arrow: false,
        side: ['right'],
        trigger: 'hover',
        functionBefore: function (instance, helper) {
            if (liveartUI.isCompact()) return false;
            var title = jQuery(helper.event.currentTarget).attr("data-title") || helper.event.currentTarget.title;
            if (title) {
                instance.content(title);
            }
        }
    });

    jQuery("[data-tooltip-generic]").tooltipster({
        theme: ['tooltipster-borderless', 'tooltipster-custom-white'],
        side: "right",
        arrow: false,
        functionPosition: function (instance, helper, position) {
            position.coord.top += 30;
            return position;
        }
    });

    //for validation
    liveartUI.productDimensionsWidth = jQuery('#productDimensionsWidth').parent();
    liveartUI.productDimensionsHeight = jQuery('#productDimensionsHeight').parent();

    //jager: hack for names-numbers sizes dropdown menu
    var dropdownList;

    var modalHandler = function (e) {
        var target = jQuery(e.target);
        var dropdownToggle = dropdownList.prev('.dropdown-toggle');
        var btnGroup = dropdownList.parent();

        if (dropdownToggle.find(target).length > 0 || (!btnGroup.hasClass('open') && dropdownToggle.is(target))) return;
        dropdownList.hide();
        jQuery('body').unbind('click', modalHandler);
    }

    jQuery('#names-number-table').delegate('.liveart-names-numbers-size > .dropdown-toggle', 'click', function (e) {
        dropdownList = jQuery(this).next('.dropdown-menu');
        var position = jQuery(this).prev('.btn').offset();
        position.top += (jQuery(this).outerHeight() + 2);
        dropdownList.css('position', 'fixed');
        dropdownList.show();
        dropdownList.offset(position);
        jQuery('body').click(modalHandler);
    });

    jQuery('#more-text-options').click(function () {
        liveartUI.resetFocusToTextTab = true;
        liveartUI.showTextForm();
        liveartUI.resetFocusToTextTab = false;
    });


    /* Hack: Select share link on click under Safari
     * http://www.bearpanther.com/2013/05/27/easy-text-selection-in-mobile-safari/
     *
     */

    /*var area = document.querySelector("#liveart-share-link-input")
    // create a listener for click, could also use touchstart, touchend, etc.
    area.addEventListener("click", select);
    // remove contentEditable when an element loses focus
    area.addEventListener("blur", reset);
    // callback to event listener
    function select(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        // a textNode is required to set a selection on mobile safari
        // nodeType values:  https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
        if (evt.target.firstChild.nodeType !== 3) {
            console.log("Unable to select text, firstChild is not a textNode.");
            return;
        }
        var el = evt.target;
        // for this to work on mobile safari, contentEditable needs to be true
        if (!isEditable(el)) {
            el.setAttribute("contentEditable", true);
        }
        // current selection
        var sel = window.getSelection();
        // create a range:
        // https://developer.mozilla.org/en-US/docs/Web/API/document.createRange
        var range = document.createRange();
        // use firstChild as range expects a textNode, not an elementNode
        range.setStart(el.firstChild, 0);
        range.setEnd(el.firstChild, el.innerHTML.length);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function reset(evt) {
        if (isEditable(evt.target)) {
            evt.target.removeAttribute("contentEditable");
        }
    }

    function isEditable(el) {
        return editable = el.getAttribute("contentEditable");
    }

    /* Hack: Select share link on click under Safari
     * http://www.bearpanther.com/2013/05/27/easy-text-selection-in-mobile-safari/
     *
     */

    /*var area = document.querySelector("#liveart-share-link-input")
    // create a listener for click, could also use touchstart, touchend, etc.
    area.addEventListener("click", select);
    // remove contentEditable when an element loses focus
    area.addEventListener("blur", reset);
    // callback to event listener
    function select(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        // a textNode is required to set a selection on mobile safari
        // nodeType values:  https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
        if (evt.target.firstChild.nodeType !== 3) {
            console.log("Unable to select text, firstChild is not a textNode.");
            return;
        }
        var el = evt.target;
        // for this to work on mobile safari, contentEditable needs to be true
        if (!isEditable(el)) {
            el.setAttribute("contentEditable", true);
        }
        // current selection
        var sel = window.getSelection();
        // create a range:
        // https://developer.mozilla.org/en-US/docs/Web/API/document.createRange
        var range = document.createRange();
        // use firstChild as range expects a textNode, not an elementNode
        range.setStart(el.firstChild, 0);
        range.setEnd(el.firstChild, el.innerHTML.length);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function reset(evt) {
        if (isEditable(evt.target)) {
            evt.target.removeAttribute("contentEditable");
        }
    }

    function isEditable(el) {
        return editable = el.getAttribute("contentEditable");
    }*/
});

/*  $.noUiSlider - WTFPL - refreshless.com/nouislider/ v6.0.0
    Mouseleave event checks if a cursor is on "liveart-main-container".
    When it leaves the container, we remove "noUi-active" class from current slider
*/
jQuery(function () {
    jQuery("#liveart-main-container").mouseleave(function () {
        var active = jQuery(".noUiSlider .noUi-origin div").hasClass("noUi-active");
        if (active) {
            jQuery(".noUiSlider .noUi-origin div").removeClass("noUi-active");
        }
        return true;
    });
});


/* lazyload.js logic (c) Lorenzo Giuliani
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:
 * `<img data-src="blank.gif" width="600" height="400" class="lazy-load">`
 */
/*
 * Modified by Andrii Dobrianskii
 * 1. adding lazy-preloading to 'state' element
 */

!function (window) {
    var $q = function (q, res) {
            if (document.querySelectorAll) {
                res = document.querySelectorAll(q);
            } else {
                var d = document
                    , a = d.styleSheets[0] || d.createStyleSheet();
                a.addRule(q, 'f:b');
                for (var l = d.all, b = 0, c = [], f = l.length; b < f; b++)
                    l[b].currentStyle.f && c.push(l[b]);

                a.removeRule(0);
                res = c;
            }
            return res;
        },
        _addEventListener = function (evt, fn, container) {
            window.addEventListener
                ? container.addEventListener(evt, fn, false)
                : (window.attachEvent)
                ? container.attachEvent('on' + evt, fn)
                : container['on' + evt] = fn;
        }
        , addEventListener = function (evt, fn) {
            _addEventListener(evt, fn, window);
            // Modified by Andrii Dobrianskiy. The images can be in different containers
            var lazyContainers = $q('.lazy-load-container');
            for (var i = 0; i < lazyContainers.length; i++) {
                var container = lazyContainers[i];
                _addEventListener(evt, fn, container);
            }

        }
        , _has = function (obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }
    ;

    function loadImage(el, fn) {
        var img = new Image()
            , src = el.getAttribute('data-src');
        img.onload = function () {
            if (!!el.parent)
                el.parent.replaceChild(img, el)
            else {
                el.src = src;
            }

            jQuery(el).parent().find(".state").removeClass("lazy-load-uploading");
            jQuery(el).show();

            fn ? fn() : null;
        }
        img.onerror = function () {
            var state = jQuery(el).parent().find(".state");
            state.removeClass("lazy-load-uploading");
            state.addClass("failed-to-load");
        }
        if (src) {
            img.src = src;
        } else if (img.onerror) {
            img.onerror();
        }
        // Modified by Andri Dobrianskyi
        // Do not show preloader for cached images
        var checkPreloadedImage = function (img, el) {
            if (!img.complete) {
                jQuery(el).hide();
                jQuery(el).parent().find(".state").addClass("lazy-load-uploading");
            }
        }
        setTimeout(checkPreloadedImage.bind(null, img, el), 50);
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect()

        return (
            rect.top >= 0
            && rect.left >= 0
            && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        )
    }

    var images = new Array()
        , query = $q('img.lazy-load')
        , processScroll = function () {
            for (var i = 0; i < images.length; i++) {
                if (elementInViewport(images[i])) {
                    loadImage(images[i], function () {
                        images.splice(i, i);
                    });
                }
            }
            ;
        }
    ;
    var timeout;
    var elements = [];
    var delay = 300;

    liveartUI.updateLazyLoadContainer = function (element, force) {
        if (element && elements.indexOf(element) === -1) {
            elements.push(element);
            _addEventListener('scroll', onScroll, element);
        }
        onScroll(force);
    }

    function onScroll(force) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        var update = function () {
            images = new Array();
            for (var i = 0; i < elements.length; i++) {
                query = jQuery(elements[i]).find("img.lazy-load");
                // Array.prototype.slice.call is not callable under our lovely IE8
                for (var j = 0; j < query.length; j++) {
                    images.push(query[j]);
                }
            }
            processScroll();
        };
        if (force) {
            update();
        } else {
            timeout = setTimeout(function () {
                update();
            }, delay);
        }
    }

    _addEventListener('scroll', onScroll, window);
    //addEventListener('scroll', liveartUI.preloadLazyLoadImages);
    jQuery(window).resize(function () {
        if (!liveartUI.isCompact() && !liveartUI.activeTab) {
            liveartUI.showForm("product-colors-form");
        }
    });
}(this);
