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

    closeActiveTab: function (leaveExpanded) {
        jQuery('#main-controls-container #liveart-main-menu .active').removeClass('active');
        jQuery('#main-controls-container #liveart-main-menu .open').removeClass('open');
        jQuery('#main-controls-container .liveart-tabs-content > .active').removeClass('active in');
		if (!leaveExpanded) jQuery('#liveart-main-container').removeClass('collapsed');
        liveartUI.activeTab = null;
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
        var modal = jQuery('#liveart-upload-bar'),
            bar = modal.find('.progress-bar');
        jQuery('#fileupload').fileupload({
            dataType: 'json',
            dropZone: null,
            url: scriptUrl,
            done: function (e, data) {
                modal.modal('hide');
                if (!data.result.error && uploadHandler) {
                    uploadHandler(data.result.url);                    
                } else {
                    liveartUI.addAlert(data.result.error.message, "error");
                };
                jQuery("#liveart-upload-image-browse-btn").button("reset");
            },
            progressall: function (e, data) {
                jQuery("#liveart-upload-image-browse-btn").button("loading")
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
                bar.addClass('animate');
            }
        });

        if (!jQuery.support.fileInput) {
            jQuery("#liveart-file-upload-container").hide();
        }

    },
    /* end jQuery File Upload init function */

    /* File Upload by URL function */

    fileUploadByUrl: function (scriptUrl) {
        var modal = jQuery('#liveart-upload-bar'),
            bar = modal.find('.progress-bar');
        // encodeURIComponent - should be present because file url may contains special characters. 
        // Example: facebook URL https://pathToimage?oh=44a290be459d5ab0aa556615568270ca&oe=5877BA96 will be splited on 2 arguments
        var fileurl = encodeURIComponent(jQuery('#liveart-upload-graphics-url-input').val());
        jQuery.ajax({
            dataType: 'json',
            type: 'POST',
            url: scriptUrl,
            data: "fileurl=" + fileurl,
            success: function (data) {
                modal.modal('hide');
                if (!data.error) {
                    userInteract({ uploadGraphics: data.url });
                } else {
                    liveartUI.addAlert(data.error.message || data.error, "error");
                    alert(data.error.message || data.error);
                };
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

    closeQuotePopup: function() {
        jQuery('#get-quote-btn').removeClass('active');
        jQuery("#quote-popup").removeClass('active in');
    },

    /**stores key: css class for an alert*/
    alertLevels: { error: "alert-danger", info: "alert-info", warning: "alert-warning", success: "alert-success" },
    /**stores key: jQuery selector for an alert*/
    alertTargets: { canvas: "#alert-container"/*, authDialog: "#auth-and-save-alert-container", loadingScreen: "#liveart-init-alert-container"*/},
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
        var close = jQuery('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        element.append(close);
        element.on("closed.bs.alert", function (target) {
            onAlertContainerChange(target);
            return false;
        }.bind(null, this.alertTargets[target]));
        element.append(jQuery('<span> ' + text + '</span>'));
        container.append(element);
        onAlertContainerChange(this.alertTargets[target]);
    },

    setFocusToTextTab: function () {
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
    },

    
    showTextForm: function () {
        this.showForm("text");
    },
    showGraphicsForm: function () {
        this.showForm("add-graphics")
    },
    showUploadedGraphicsForm: function () {
        this.showForm("upload-graphics")
    },
    /*
    * menuData contains information about tabs selecting
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
        }
    },
    /*
    * Selecting menu item
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
    }
}
/*
* This code frament fixes an issue with the height of alert container in IE.
* For more information see LAJS/TASK708
* @param selector - jQuery selector for alert container
*/
function onAlertContainerChange(selector) {
    var elems = jQuery(selector + " .alert");
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
    jQuery("#get-quote-btn").click(function (e) {
        if (jQuery('#get-quote-btn').hasClass('active')) {
            jQuery('#quote-popup .liveart-close-window-btn').click();
            return false;
        }
    });

    jQuery('ul.liveart-list-view > li > a').click(function (e) {       
        if (jQuery('#get-quote-btn').hasClass('active')) {
            liveartUI.closeQuotePopup();    
        }
        if (jQuery(e.currentTarget).parent().is("#clear-design")) {
            liveartUI.closeActiveTab();
            return;
        }

        if (liveartUI.activeTab && liveartUI.activeTab.length) {
            liveartUI.activeTab.parent().removeClass('open');
			jQuery('#liveart-main-container').removeClass('collapsed');
            if (liveartUI.activeTab.parent().hasClass('active')) {
                var id = jQuery(e.currentTarget).attr('href').replace('#', '');
                jQuery('.liveart-tabs-content > #' + id).removeClass('active');
            }
        } else {
            var href = jQuery(e.currentTarget).attr('href');
            if (href !== undefined) {
                var id = href.replace('#', '');
                jQuery('.liveart-tabs-content > #' + id).addClass('active');
            }
			jQuery('#liveart-main-container').addClass('collapsed');
        }        

        if (liveartUI.activeTab && liveartUI.activeTab.is(e.currentTarget)) {            
            liveartUI.activeTab = null;
        } else {
            //liveartUI.zoomSlider.hide();
			jQuery('#liveart-main-container').addClass('collapsed');
            liveartUI.activeTab = jQuery(e.currentTarget);
            liveartUI.activeTab.parent().addClass('open');
            if (jQuery('#add-text').hasClass("open")) {
                liveartUI.setFocusToTextTab();
            }
        }
    });

    jQuery('.tab-pane .liveart-dropdown-form-header > .liveart-close-form-btn').click(function (e) {
        liveartUI.closeActiveTab();
        var target = jQuery(e.currentTarget).parents().eq(1);
        var targetId = target.attr('id');
        var menuParent = jQuery('[href=#' + targetId + ']').parents().eq(0);
        target.removeClass('active');
        menuParent.removeClass('active');
    });

    jQuery('.tab-pane .liveart-dropdown-form-header > .liveart-close-expanded-part-btn').click(function (e) {
        if (!jQuery(e.currentTarget).parents('.tab-pane').is('#upload-graphics-form')) {
            jQuery(e.currentTarget).parents('.tab-pane').toggleClass('expanded');
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
});

/* Alert */

liveart_alert = function () { };

liveart_alert.show = function (message) {
    jQuery('#liveart-alert-message').text(message);
    jQuery('#liveart-alert-popup').modal('show');
}

/* Alert end */

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
