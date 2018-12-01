<?php namespace Liveart;

class Configs {
    public static $aws_config = null;
    public static function get_aws_config() {
        if (self::$aws_config === null) {
            self::$aws_config = require('aws-creds.php');
        }
        return self::$aws_config;
    }

    //default svg dimensions
    public static $DEFAULT_SVG_WIDTH = 590;
    public static $DEFAULT_SVG_HEIGHT = 530;

    /** Relative path from folder with design (design.json) to LAJS folder */
    public static $DESIGN_RELATIVE_LAJS_FOLDER_PATH = "../../";
    // order.php default vars start
    public static $LAJS_FOLDER_PATH = "../../";
    public static $CONFIG_ORDER_PHP = "config/config.json";
    public static $SOURCES_ORDER_PHP = "sources/";
    public static $TEMPORARY_FILES = "temp/";
    public static $TEMP_RELATIVE_LAJS_FOLDER_PATH = "../../../";
    public static $CROPPED_SVG_MASK = "_cropped";
    public static $PRINT_SVG_MASK = "_print";
    public static $NO_PRODUCT_SVG_MASK = "no_prod_";
    // order.php default vars end

    /** Relative path from LAJS folder to folder with all designs */
    public static $DESIGNS_RELATIVE_PATH = "files/";

    // Relative path from LAJS folder to templates list file
    public static $TEMPLATES_LIST_RELATIVE_PATH = "config/templates.json";

	/** Image upload configuration*/
    public static $UPLOAD_CONFIGS = array(
		/** One of ["s3", "folder"]
			 - If set to "s3": uploads image to s3 amazon web service. "aws-creds.php" file should be correctly configured
			 - If set to "folder": uploads image to folder on server. "folder" object under this configs should be correctly configured
		*/
        'destination' => "folder",
        /** Optional. Required only for "destination" === "folder" */
        'folder' => array(
            /** Relative path from upload script location to upload folder */
            "relative_path" => "../../files/uploads/",
            /** Url prefix for uploaded file */
            "url_prefix" => "files/uploads/"
        )
    );
}
