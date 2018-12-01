/**
Browser check configuration.
Minimal supported browser version configuring by *notify* property(i - Internet Explorer, c - Chrome, f - FireFox, s - Safari, o - Opera).
**/
var $buoop = {
    notify: {i: 10, c: 28, f: 27, s: 8, o: 16},
    unsupported: false,
    mobile: false,
    api: 5,
    onshow: function (infos) {
        jQuery("#liveart-isolate-container").addClass("browser-check-failed");
    },
    reminder: 0,
    noclose: true,
    text: "<div class=\"buorg-text\">Your web browser ({brow_name}) is not supported. " +
    "Update your browser manually or follow the link below for more " +
    "security, comfort and the best experience on this site." +
    " <a{ignore_but}></a></div> <div class=\"buorg-update\"><a{up_but}>Update Browser</a></div>",
    container: jQuery('#unsupported-browser-info').get(0)
};

