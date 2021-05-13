<?php namespace Liveart;

class Configs {
    //default svg dimensions
    public static $DEFAULT_SVG_WIDTH = 590;
    public static $DEFAULT_SVG_HEIGHT = 530;

    /** Relative path from folder with design (design.json) to LAJS folder; Used in saveTemplate.php */
    public static $DESIGN_RELATIVE_LAJS_FOLDER_PATH = "../../";
    // order.php default vars start

    /**
     * return folder path where designs files are stored
     */
    public static function getFilesFolderPath() {
        return self::isProductionEnv() ? "/var/www/html/".self::$DESIGNS_RELATIVE_PATH : "../../".self::$DESIGNS_RELATIVE_PATH;
    }

    /**
     * check if the current environment is production
     */
    public static function isProductionEnv() {
        return getenv('ENVIRONMENT') !== false && strtolower(getenv('ENVIRONMENT')) === "production";
    }

    /**
     * return root LAJS100 folder path (needed for standalone LAJS100)
     */
    public static function getLAJSFolderPath() {
        return "../../";
    }

    /**
     * Generate Visuals only
     * Setup `GENVIZ_PUBLIC_ADDRESS` to return files with absolute url
     * Designed to use ONLY in ENVIRONMENT==="production" (isProductionEnv())
     * GenViz 1.1.2 and earlier had a bit similar value `LACP_PUBLIC_ADDRESS`
     */
    public static function getGenVizPublicAddress() {
        if (getenv('GENVIZ_PUBLIC_ADDRESS') !== false) {
            return getenv('GENVIZ_PUBLIC_ADDRESS');
        }
        return '';
    }

    /**
     * return path to default config
     * it's either file inside docker container or file in LAJS100 project
     */
    public static function getDefaultOutputConfigPath() {
        return self::isProductionEnv() ? "/var/www/html/config/output.json" : self::getLAJSFolderPath() . "services/config/output.json";
    }

    public static $SOURCES_ORDER_PHP = "sources/";
    public static $TEMPORARY_FILES = "temp/";
    // Log to `generateVisuals.log`; Require composer install (for Monolog)
    public static $GEN_VIZ_LOGS = false;
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
		/** One of ["folder"]
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
