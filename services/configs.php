<?php

namespace Liveart;

class Configs {
    public static $OUTPUT_TYPE = "PNG"; // available: PDF, PNG //JPEG can not be exported with inkscape
    public static $EXPORT_DPI = "90";
    public static $SKIP_BOUNDS = false;
    public static $USE_UNITS = false;


    //default svg dimensions
    public static $DEFAULT_SVG_WIDTH = 587;
    public static $DEFAULT_SVG_HEIGHT = 543;



    // Relative path from folder with design (design.json) to LAJS folder
    public static $DESIGN_RELATIVE_LAJS_FOLDER_PATH = "../";
    // order.php default vars start
    public static $LAJS_FOLDER_PATH = "../";
    public static $CONFIG_ORDER_PHP = "config/config.json";
    public static $SOURCES_ORDER_PHP = "sources/";
    public static $CONFIG_TEMPLATES = "config/templates.json";
    // order.php default vars end


    // Relative path from LAJS folder to uploads folder
    public static $UPLOAD_RELATIVE_PATH = "files/uploads/";

    // Relative path from LAJS folder to folder with all designs
    public static $DESIGNS_RELATIVE_PATH = "files/";
}

?>