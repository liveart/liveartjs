<?php

namespace Liveart;

require_once('configs.php');
use Liveart\Configs as Configs;

/**
 * Class Utils
 * @package Liveart
 */
class Utils {
    /**
     * @param $zipFilename
     * @param $designFolderPath
     * @param $filesToZip
     * @return \ZipArchive
     */
    public static function zipFiles($zipFilename, $designFolderPath, $filesToZip){
        $zip = new \ZipArchive();

        if ($zip->open($zipFilename, \ZipArchive::CREATE)!==TRUE) {
            exit("cannot open <$zipFilename>\n");
        }

        for($i = 0; $i < count($filesToZip); ++$i) {
            $zip->addFile($designFolderPath.$filesToZip[$i], $filesToZip[$i]);
        }

        return $zip;
    }

    public static function processDesign($guid){
        $LAJSFolderPath = Configs::$LAJS_FOLDER_PATH;
        $designFolderPath = $LAJSFolderPath . Configs::$DESIGNS_RELATIVE_PATH . $guid."/";
        $DesignRelativeLAJSFolderPath = Configs::$DESIGN_RELATIVE_LAJS_FOLDER_PATH;
        $config = Configs::$CONFIG_ORDER_PHP;
        $sources = Configs::$SOURCES_ORDER_PHP;

        // empty values
        $log = "";
        $svg = "";
        $filesToZip = array();
        //read config unit
        $UNIT = SvgUtils::readConfigUnit($LAJSFolderPath, $config);

        //read saved design
        $json = SvgUtils::readSavedDesign($designFolderPath);

        $fontsCSSUrl = SvgUtils::readFontsCSSUrl($LAJSFolderPath, $config);
        if($fontsCSSUrl) {
	        $fontsCSSUrl = $DesignRelativeLAJSFolderPath . $fontsCSSUrl;
        }

        $sizes = NULL;
        if (isset($json->data->product) &&
	        isset($json->data->product->size)){
	        $sizes = $json->data->product->size;
        }
        $scripFilename = "inkscape_batch.txt";

        // processing design locations
        foreach($json->data->locations as $loc) {
	        $res = Utils::processDesignLocation($loc, $sources, $designFolderPath, $LAJSFolderPath, $UNIT, $fontsCSSUrl, $sizes, $scripFilename);
	        $filesToZip = array_merge($filesToZip, $res["filesToZip"]);
	        $log .= $res["log"];
        }
        Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "quit");
        Utils::executeInkscapeBatch($designFolderPath, $scripFilename);
        Utils::removeFile($scripFilename, $designFolderPath);
        return array(
            'filesToZip' => $filesToZip,
            'svg' => $svg,
            'log' => $log,
            'json' => $json
        ) ;
    }

    /**
     * @param $loc
     * @param $sources
     * @param $designFolderPath
     * @param $LAJSFolderPath
     * @param $UNIT
     * @param $fontsCSSUrl
     * @param $sizes
     * @return array
     */
    public static function processDesignLocation($loc, $sources, $designFolderPath, $LAJSFolderPath, $UNIT, $fontsCSSUrl, $sizes, $scripFilename){
        $log = "";
        $filesToZip = array();
        // Remove anything which isn't a word, whitespace, number
        // or any of the following caracters -_~,;:[]().
        $locname = preg_replace("([^\w\d\-_~,;:\[\]\(\).])", '', $loc->name);

        /**
         *		SVG PARSING PART
         * 		1. read svg content
         *		2. update links to external images
         *		3. update viewBox (if needed)
         *		4. write svg file (and generated png)
         */

        //1. read svg content
        $svg = $loc->svg;
        // adding <link> with fonts
        if(isset($fontsCSSUrl) && strlen($fontsCSSUrl) > 0) $svg = SvgUtils::addFontLink($svg, $fontsCSSUrl);

        // get external images
        $externalImagesList =  SvgUtils::getExternalImages($svg);
        //create folder for external images (if not exist)
        $result =  SvgUtils::createFolderForExternalImages($designFolderPath, $sources);
        $log .= $result['log'];

        //2. update links to external images
        $result = SvgUtils::processExternalImages($externalImagesList, $svg, $LAJSFolderPath, $sources, $designFolderPath, $filesToZip);
        $filesToZip = $result['filesToZip'];
        $svg = $result['svg'];
        $log .= $result['log'];

        //default svg dimensions
        $svgWidth = Configs::$DEFAULT_SVG_WIDTH;
        $svgHeight = Configs::$DEFAULT_SVG_HEIGHT;
        $svgBox = [0, 0, $svgWidth, $svgHeight];

        //3. update viewBox based on editable area (if present. if not present - use default one)
        $result = SvgUtils::updateViewBox($loc, $svg, $sizes, $UNIT, $svgWidth, $svgHeight);
        $svg = $result['svg'];
        $svgWidth = $result['svgWidth'];
        $svgHeight = $result['svgHeight'];
        $svgUnits =  $result['svgUnits'];

        //4. write files
        $result = SvgUtils::writeSVGFiles($locname, $designFolderPath, $svg, $filesToZip, $svgWidth, $svgHeight, $svgUnits);
        $filenameFull = $result['filenameFull'];
        $filesToZip = $result['filesToZip'];

        $outputType = Configs::$OUTPUT_TYPE;
		$dpi = Configs::$EXPORT_DPI;
        Utils::addToInkscapeBatch($locname, $designFolderPath, $svgWidth, $svgHeight, $outputType, $dpi, $scripFilename);

        return array(
            'filesToZip' => $filesToZip,
            'svg' => $svg,
            'log' => $log
        ) ;
    }

    /**
     * @param $folder
     */
    public static function mkdir($folder){
        if (!file_exists($folder)) {
            // create dir for file stuff
            mkdir($folder);
        }
    }

    /**
     * @param $path
     * @return mixed
     */
    public static function readDesign($path){
        $res = NULL;

        if (file_exists($path)) {
            $res = unserialize(file_get_contents($path));
        }

        return res;
    }

    /**
     * @param $json_data
     * @param $title
     * @param $email
     * @return array|null
     */
    public static function saveDesignData($json_data, $isTemplate, $id){
        $guid = isset($id) ? $id : date("Ymd-His").'-'.rand(10000, 99999);
        if($isTemplate && !isset($id)) $guid = "template-".$guid;
        $designs_path = Configs::$LAJS_FOLDER_PATH . Configs::$DESIGNS_RELATIVE_PATH;
        $upload_path = $designs_path . $guid;

        Utils::mkdir($designs_path);
        Utils::mkdir($upload_path);

        $json_file = $upload_path."/design.json";
        $design = array(
            'id' => $guid,
            'type' => $_POST['type'],
            'date' => date("Y.m.d H:i"));
                    
        file_put_contents($json_file, $json_data);
        return $design;
    }

    public static function checkImageMagick(){
        exec("convert -version", $out, $rcode);
        return $rcode == 0;
    }
    public static function checkInkscape(){
        exec("inkscape --version", $out, $rcode);
        return array("installed" => $rcode == 0, "version" => $out);
    }

    public static function addToInkscapeBatch($locname, $designFolderPath, $svgWidth, $svgHeight, $outputType, $dpi, $scripFilename) {
        $filename = "design_".$locname.".svg";
        $filenameUnits = "design_".$locname."_units.svg";
		$fnamePng = "design_".$locname.".png";
		$fnamePdf = "design_".$locname.".pdf";
		$filenameFull = $designFolderPath.$filename;
        $filenameFullUnits = $designFolderPath.$filenameUnits;

	    if($outputType == "PNG") {
		    Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "-e \"$designFolderPath$fnamePng\" \"$filenameFull\" -a 0:0:$svgWidth:$svgHeight -d $dpi");
	    } else  if($outputType == "PDF") {
            Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "-T -A \"$designFolderPath$fnamePdf\" \"$filenameFullUnits\" -a 0:0:$svgWidth:$svgHeight -w $svgWidth -h $svgHeight");
        }
    }

    public static function executeInkscapeBatch($designFolderPath, $scripFilename) {
        $scripFilenameFull = $designFolderPath.$scripFilename;
        exec("inkscape --shell < $scripFilenameFull");
    }

    public static function removeFile($filename, $path) {
        $fullPath = $path.$filename;
        unlink ($fullPath);
    }

    public static function addCommandToInkscapeBatch($designFolderPath, $scripFilename, $command){
        $scripFilenameFull = $designFolderPath.$scripFilename;
        // Open the file to get existing content
        if(file_exists($scripFilenameFull)){
            $commands = file_get_contents($scripFilenameFull);
        } else {
            $commands = "";
        }
        if($commands === false) $commands = "";

        $commands .= "$command\n";
        file_put_contents($scripFilenameFull, $commands);
    }

    public static function exportDesignPreview($guid, $thumbSize){
        $LAJSFolderPath = Configs::$DESIGN_RELATIVE_LAJS_FOLDER_PATH;
        $designFolderPath = $LAJSFolderPath . Configs::$DESIGNS_RELATIVE_PATH .$guid."/";

        //read saved design
        $json = SvgUtils::readSavedDesign($designFolderPath);
        $loc = $json->data->locations[0];
        $locname = preg_replace("([^\w\d\-_~,;:\[\]\(\).])", '', $loc->name);

        $filename = "design_".$locname.".svg";
        $filenameFull = $designFolderPath.$filename;

        $fnamePng = "design_preview.png";
        $fnameFullPng = $designFolderPath.$fnamePng;

        exec("inkscape -z -f \"$filenameFull\" -w $thumbSize -j -e \"$fnameFullPng\"");
        list($width, $height) = getimagesize($fnameFullPng);


        $maxDim = max($width, $height);
        $dx = ($maxDim - $width) * 0.5;
        $dy = ($maxDim - $height) * 0.5;

        exec("convert \"$fnameFullPng\" -background none -extent $maxDim"."x$maxDim -page +${dx}+${dy} -flatten -resize $thumbSize"."x$thumbSize \"$fnameFullPng\"");

        return Configs::$DESIGNS_RELATIVE_PATH . "$guid/$fnamePng";
    }

    public static function cleanUpDesignFolder($guid){
        $LAJSFolderPath = Configs::$DESIGN_RELATIVE_LAJS_FOLDER_PATH;
        $designFolderPath = $LAJSFolderPath . Configs::$DESIGNS_RELATIVE_PATH .$guid."/";
        $sources = Configs::$SOURCES_ORDER_PHP;

        Utils::deleteDir($designFolderPath.$sources);

        foreach( glob("$designFolderPath*") as $file ) {
            if( strrpos($file, 'design.json') === false && strrpos($file, 'design_preview.png') === false )
                unlink($file);
        }
    }

    public static function deleteDir($dirPath) {
        if (! is_dir($dirPath)) {
            throw new InvalidArgumentException("$dirPath must be a directory");
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }
        rmdir($dirPath);
    }

}
?>