<?php

namespace Liveart;

require_once('lib/init.php');
require_once('configs.php');
require_once('CustomOutput.php');

use Liveart\Configs as Configs;

use Monolog\Logger as Logger;
use Monolog\Handler\ErrorLogHandler;
use Monolog\Handler\StreamHandler as StreamHandler;
use Monolog\Formatter\LineFormatter as LineFormatter;

use LiveArt\LoggerStub as LoggerStub;

/**
 * Class Utils
 * @package Liveart
 */
class Utils
{

    private static $logger = NULL;

    public static function createLogger($name)
    {
        // Skip for release as static files (monolog is not installed)
        if (!Configs::$GEN_VIZ_LOGS) {
            return new LoggerStub();
        }

        $logger = new Logger($name);

        // Detect dev server and output logs (kinda hack)
        if (php_sapi_name() == 'cli-server') {
            // https://stackoverflow.com/a/21294065
            $logger->pushHandler(new ErrorLogHandler(ErrorLogHandler::SAPI, Logger::WARNING));
            // set DEBUG loglevel via env var
            putenv("LOGLEVEL=DEBUG");
        }

        $output = " %channel%.%level_name%: %message%\n";
        $formatter = new LineFormatter($output);

        $handler = new StreamHandler(
            'php://stdout',
            (Configs::isDebugLogs() ? Logger::DEBUG : Logger::INFO)
        );
        $handler->setFormatter($formatter);
        $logger->pushHandler($handler);

        return $logger;
    }
    
    /**
     * Current class legacy function
     */
    public static function getLogger() 
    {
        if (null === self::$logger) 
        {
            self::$logger = self::createLogger('Utils');
        }

        return self::$logger;
    }

    //#region Work with Design

    /**
     * Entry point to design files processing.
     *
     * 1. Creates temporary SVG files for each location (SvgUtils::processDesignLocation()):
     *    * E.g. files for 'Front' location (duplicated info from processDesignLocation() ):
     *      * design_Front.svg (exports always)
     *      * design_Front_cropped.svg (optional - only if editable area exists)
     *      * design_Front_print.svg (optional - only if product dimensions exists) + cropped (if needed) + used configured units
     * 2. Creates PDF/PNG files from SVG for each location.
     *    * file for PNG conversion hierarchy: cropped -> orig
     *    * file for PDF hierarchy:            print -> cropped -> orig
     *
     * @param string $guid - design id
     * @param \OutputConfig $outputConfig - output config object
     */
    public static function processDesign($guid, $outputConfig, $json = NULL)
    {
        $LAJSFolderPath = Configs::getLAJSFolderPath();
        $designFolderPath = Configs::getFilesFolderPath() . $guid . "/";

        $design_unit = isset($json->product->size->unit) ? $json->product->size->unit : 0;

        $UNIT = $design_unit ?: 'in';

        //product dimensions
        $sizes = NULL;
        if (isset($json->product) &&
            isset($json->product->size)) {
            $sizes = $json->product->size;
        }

        $scripFilename = "inkscape_batch.txt";
        // create folder for temporary files (if does not exist)
        $result = Utils::createFolder($designFolderPath . Configs::$TEMPORARY_FILES);
        //$logStr.= $result['log'];
        // create folder for external images (if does not exist)
        $result = Utils::createFolder($designFolderPath . Configs::$TEMPORARY_FILES . Configs::$SOURCES_ORDER_PHP);
        //$logStr.= $result['log'];
        // required for DEBUG=TRUE
        Utils::cleanInkscapeBatch($designFolderPath, $scripFilename);

        //used for "custom" output only
        $processedFiles = array();

        $errorMsg = NULL;

        // processing design locations
        foreach ($json->locations as $loc) {
            SvgUtils::processDesignLocation($loc, $designFolderPath, $LAJSFolderPath, $UNIT, NULL, $sizes);

            $locname = Utils::getLocationName($loc->name);

            self::getLogger()->debug("Processing location \"$locname\"");

            //Prepare convert to PDF/PNG start  TODO temporary solution
            $svgWidth = Configs::$DEFAULT_SVG_WIDTH;
            $svgHeight = Configs::$DEFAULT_SVG_HEIGHT;

            //create location container with the respective index
            array_push($processedFiles, array("name" => $locname));

            foreach ($outputConfig->rulesArray as &$item) {
                try {
                    self::getLogger()->debug("Processing rule: $item->id (".get_class($item).")");
                    $usedSvgWidth = $svgWidth;
                    $usedSvgHeight = $svgHeight;
                    if ($item->useEditableArea === true) {
                        if (isset($loc->editableArea) && strlen($loc->editableArea) > 0) {
                            $svgBox = explode(" ", $loc->editableArea);
                            $usedSvgWidth = $svgBox[2] - $svgBox[0];
                            $usedSvgHeight = $svgBox[3] - $svgBox[1];
                        }
                    }
                    $designPrefix = $item->includeProduct === false ? 'design_' . Configs::$NO_PRODUCT_SVG_MASK : 'design_';
                    $fileName = $designPrefix . $locname . ".svg";
                    $croppedFileName = $designPrefix . $locname . Configs::$CROPPED_SVG_MASK . ".svg";
                    $croppedFilePath = $designFolderPath . Configs::$TEMPORARY_FILES . $croppedFileName;
                    $printFileName = $designPrefix . $locname . Configs::$PRINT_SVG_MASK . ".svg";
                    $printFilePath = $designFolderPath . Configs::$TEMPORARY_FILES . $printFileName;
                    $fileToConvert = $fileName;
                    
                    // Determine source file to convert based on options
                    // TODO: refactor below
                    // TODO: cover PDF export with tests
                    // both for pdf & png
                    if ($item->useEditableArea === true) {
                        $fileToConvert = file_exists($croppedFilePath) ? $croppedFileName : $fileName;
                    }
                    // ------------
                    // only for png
                    if ($item->type === "PNG" && isset($item->useUnits) && $item->useUnits === true && file_exists($printFilePath)) {
                        $fileToConvert = $printFileName;
                    }
                    // ------------
                    // only for pdf
                    if ($item->type === "PDF" && isset($item->useUnits) && $item->useUnits === true) {
                        if (file_exists($printFilePath)) {
                            $fileToConvert = $printFileName;
                        } else if (file_exists($croppedFilePath)) {
                            $fileToConvert = $croppedFileName;
                        }
                    }
                    // -------------
                    self::getLogger()->debug('Processing source file: ' . $fileToConvert);
                    $fileToConvertPath = $designFolderPath . Configs::$TEMPORARY_FILES . $fileToConvert;
                    $outFolderPath = $designFolderPath;
                    if (isset($item->merge) && $item->merge === true) {
                        $outFolderPath = $designFolderPath . Configs::$TEMPORARY_FILES;
                    }
                    //No need to convert custom output, only prepare SVG
                    if($item->type !== "custom"){
                        Utils::addToInkscapeBatch($locname, $fileToConvertPath, $designFolderPath, $outFolderPath, $usedSvgWidth, $usedSvgHeight, $scripFilename, $item);
                    }
                    //Used for "custom" type - add the respective custom export SVG path
                    $processedFiles[count($processedFiles) - 1][$item->id] = $fileToConvertPath;
                } catch (Exception $e) {
                    self::getLogger()->error('Error when processing rule: ' . $item->id . ' ' . $e->getMessage());
                    $errorMsg = ($errorMsg === NULL ? "" : ($errorMsg . ", ")) . $locname . " - rule " . $item->id;
                }
            }
            unset($item);
            //Prepare convert to PDF/PNG end
        }

        Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "quit");

        self::getLogger()->debug("Added to Inkscape batch: \"$designFolderPath\", \"$scripFilename\"");

        Utils::executeInkscapeBatch($designFolderPath, $scripFilename);

        $batch_contents = file_get_contents($designFolderPath . $scripFilename);

        self::getLogger()->debug('Executed Inkscape batch: ' . $batch_contents);

        if (!Configs::isDebug()) {
            Utils::removeFile($scripFilename, $designFolderPath);
            self::getLogger()->debug("Removed Inkscape batch: $designFolderPath$scripFilename");
        }

        foreach ($outputConfig->rulesArray as $item) {
            if ($item->type === "PDF" && isset($item->merge) && $item->merge === true) {
                Utils::exportCombinedPDF($json, $designFolderPath . Configs::$TEMPORARY_FILES, $designFolderPath, $item->fileName);
            }
        }
        unset($item);

        //Custom items require an additional iteration, as all location files should be generated first
        foreach ($outputConfig->rulesArray as $item) {
            if ($item->type === "custom") {
                try {
                    self::getLogger()->debug('Processing custom rule: ' . $item->id);
                    //prepare an array with SVG's:
                    /*
                     * From structure:
                     * [0] => "name" -> "Front"
                     *        "convert_png" -> "svg_path"
                     *        "convert_png_2" -> "svg_another_path"
                     *
                     * to structure (item.id == "convert_png")
                     * [0] => "name" -> "Front"
                     *        "svg" -> "svg_path"
                     *        "exportFileName" -> "file_front.png"
                     */
                    $locations = array();
                    foreach($processedFiles as $loc) {
                        //match current custom item
                        if (isset($loc[$item->id])) {
                            $exportFileName = Utils::getFileName($item->fileName, $loc["name"]);

                            array_push($locations, array(
                                "name" => $loc["name"],
                                "svgFilePath" => $loc[$item->id],
                                "exportFileName" => $exportFileName,
                                "exportFilePath" => $designFolderPath.$exportFileName
                            ));
                        }
                    }

                    $output = array(
                        "options" => $item->options,
                        "fileName" => $item->fileName
                    );
                    $data = array(
                        "design" => $json,
                        "workDir" => $designFolderPath
                    );

                    //render function call
                    call_user_func($item->renderFunction, $locations, $output, $data);
                } catch (Exception $e) {
                    self::getLogger()->error('Error when processing custom rule: ' . $item->id . ' ' . $e->getMessage());
                    $errorMsg = ($errorMsg === NULL ? "" : ($errorMsg . ", ")) . "Custom rule " . $item->id;
                }
            }
        }

        if (file_exists($designFolderPath . Configs::$TEMPORARY_FILES) && !Configs::isDebug()) {
            //remove temp dir
            Utils::deleteDir($designFolderPath . Configs::$TEMPORARY_FILES);
            self::getLogger()->debug('Removed temp directory: "' . $designFolderPath . Configs::$TEMPORARY_FILES . '"');
        }
        
        self::getLogger()->debug('Process design completed');

        if (strlen($errorMsg) > 0) {
            self::getLogger()->info("Processing of design #$guid finished with errors: $errorMsg");
        } else {
            self::getLogger()->info("Processing of design #$guid finished with no errors");
        }
    }

    public static function exportCombinedPDF($json, $designFolderPath, $outputFilesPath, $filename)
    {
        $getPDFPath = function ($loc) use ($designFolderPath, $filename) {
            $locname = Utils::getLocationName($loc->name);
            $fnamePdf = basename($filename, '.pdf') . '_' . $locname . '.pdf';
            return "\"$designFolderPath$fnamePdf\"";
        };
        $inputFiles = array_map($getPDFPath, $json->locations);
        Utils::combinePDF($inputFiles, $outputFilesPath . $filename);
    }

    public static function combinePDF($inputFiles, $outputFile)
    {
        $command = "gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=\"$outputFile\" " . implode(" ", $inputFiles) . " -c quit";
        exec($command);
    }

    /**
     * @param $designFolderPath
     * @return mixed
     */
    public static function readSavedDesign($designFolderPath)
    {
        $file = file_get_contents_BOM($designFolderPath . "design.json");
        if (get_magic_quotes_gpc()) {
            $design = stripslashes($file);
        } else {
            $design = $file;
        }
        return json_decode($design);

    }

    /**
     * @param $path
     * @return mixed
     */
    public static function readDesign($path)
    {
        $res = NULL;

        if (file_exists($path)) {
            $res = unserialize(file_get_contents($path));
        }

        return $res;
    }

    /**
     * @param $json_data
     * @param $isTemplate
     * @param $id
     * @return array|null
     */
    public static function saveDesignData($json_data, $isTemplate, $id)
    {
        $guid = isset($id) ? $id : date("Ymd-His") . '-' . rand(10000, 99999);
        if ($isTemplate && !isset($id)) $guid = "template-" . $guid;
        $designs_path = Configs::getLAJSFolderPath() . Configs::$DESIGNS_RELATIVE_PATH;
        $upload_path = $designs_path . $guid;

        Utils::createFolder($designs_path);
        Utils::createFolder($upload_path);

        $json_file = $upload_path . "/design.json";
        $design = array(
            'id' => $guid,
            'type' => $_POST['type'],
            'date' => date("Y.m.d H:i"));

        file_put_contents($json_file, $json_data);
        return $design;
    }

    public static function getLocationName($name)
    {
        $res = preg_replace("([^\w\d\-_~,;:\[\]\(\).])", '', $name);
        return preg_replace('/\s+/', '', $res);
    }

    //#endregion Design Utils

    //#region Work with External Soft

    public static function checkImageMagick()
    {
        exec("convert -version", $out, $rcode);
        return $rcode == 0;
    }

    /**
     * @param $appName
     * @return array
     */
    public static function isInstalled($appName)
    {
        exec($appName . " --version", $out, $rcode);
        return array("installed" => $rcode == 0, "version" => $out);
    }

    public static function addToInkscapeBatchOld($locname, $filenameFull, $designFolderPath, $svgWidth, $svgHeight, $outputType, $dpi, $scripFilename)
    {
        $fnamePng = "design_" . $locname . ".png";
        $fnamePdf = "design_" . $locname . ".pdf";
        if ($outputType === "PNG") {
            Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "-e \"$designFolderPath$fnamePng\" \"$filenameFull\" -a 0:0:$svgWidth:$svgHeight -d $dpi");
        } else if ($outputType === "PDF") {
            Utils::addCommandToInkscapeBatch($designFolderPath, $scripFilename, "-T -A \"$designFolderPath$fnamePdf\" \"$filenameFull\" -a 0:0:$svgWidth:$svgHeight -w $svgWidth -h $svgHeight");
        }
    }

    public static function addToInkscapeBatch($locname, $filenameFull, $designFolderPath, $outFolderPath, $svgWidth, $svgHeight, $scriptFilename, $rule)
    {
        $fileName = Utils::getFileName($rule->fileName, $locname);
        if ($rule->type === "PNG") {
            $dpi = $rule->exportDpi;
            Utils::addCommandToInkscapeBatch($designFolderPath, $scriptFilename, "-e \"$outFolderPath$fileName\" \"$filenameFull\" -d $dpi");
        } else if ($rule->type === "PDF") {
            if (isset($rule->merge) && $rule->merge === true) {
                $fileName = basename($rule->fileName, '.pdf') . '_' . $locname . ".pdf";
            }
            Utils::addCommandToInkscapeBatch($designFolderPath, $scriptFilename, "-T -A \"$outFolderPath$fileName\" \"$filenameFull\" -a 0:0:$svgWidth:$svgHeight -w $svgWidth -h $svgHeight");
        }
    }

    public static function executeInkscapeBatch($designFolderPath, $scripFilename)
    {
        $scripFilenameFull = $designFolderPath . $scripFilename;
        exec("inkscape --shell < $scripFilenameFull");
    }

    public static function removeFile($filename, $path)
    {
        $fullPath = $path . $filename;
        unlink($fullPath);
    }

    public static function removeFiles($files)
    {
        foreach($files as $file) {
            unlink($file);
        }
    }

    public static function cleanInkscapeBatch($designFolderPath, $scripFilename)
    {
        $scripFilenameFull = $designFolderPath . $scripFilename;
        // delete the file
        if (file_exists($scripFilenameFull)) {
            unlink($scripFilenameFull);
        } 
    }

    public static function addCommandToInkscapeBatch($designFolderPath, $scripFilename, $command)
    {
        $scripFilenameFull = $designFolderPath . $scripFilename;
        // Open the file to get existing content
        if (file_exists($scripFilenameFull)) {
            $commands = file_get_contents($scripFilenameFull);
        } else {
            $commands = "";
        }
        if ($commands === false) $commands = "";

        $commands .= "$command\n";
        file_put_contents($scripFilenameFull, $commands);
    }

    //#endregion Work with External Soft

    //#region Work with Folders

    public static function cleanUpDesignFolder($guid)
    {
        $LAJSFolderPath = Configs::$DESIGN_RELATIVE_LAJS_FOLDER_PATH;
        $designFolderPath = $LAJSFolderPath . Configs::$DESIGNS_RELATIVE_PATH . $guid . "/";

        if (file_exists($designFolderPath . Configs::$TEMPORARY_FILES)) {
            Utils::deleteDir($designFolderPath . Configs::$TEMPORARY_FILES);
        }

        foreach (glob("$designFolderPath*") as $file) {
            if (strrpos($file, 'design.json') === false && strrpos($file, 'design_preview.png') === false) {
                //unlink($file);
            }
        }
    }

    public static function deleteDir($dirPath)
    {
        if (!file_exists($dirPath) || !is_dir($dirPath)) {
            throw new \InvalidArgumentException("$dirPath must be a directory");
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

    /**
     * Create folder if it doesn't exist
     */
    public static function createFolder($path)
    {
        $logStr= "";
        if (!file_exists($path)) {
            if (!mkdir($path, 0777)) {
                $logStr.= 'Failed to create folder ' . $path . ' :(' . '<br />';
            } else {
                $logStr.= 'Created directory ' . $path . '<br />';
            }
        }
        return array('log' => $logStr);
    }

    //#endregion Work with Folders

    //#region Work with JSON

    /**
     * Reads json file and returns as object.
     * @param $path
     * @return mixed
     */
    public static function jsonToObject($path)
    {
        $jsonFile = file_get_contents_BOM($path);
        if (get_magic_quotes_gpc()) {
            $jsonFile = trim(stripslashes($jsonFile));
        }
        return json_decode($jsonFile);
    }

    //#endregion Work with JSON

    //#region Work with ZIP
    /**
     * @param $zipFilename
     * @param $designFolderPath
     * @param $filesToZip
     * @return \ZipArchive
     */
    public static function zipFiles($zipFilename, $designFolderPath, $filesToZip)
    {
        $zip = new \ZipArchive();

        if ($zip->open($zipFilename, \ZipArchive::CREATE) !== TRUE) {
            exit("cannot open <$zipFilename>\n");
        }

        for ($i = 0; $i < count($filesToZip); ++$i) {
            $zip->addFile($designFolderPath . $filesToZip[$i], $filesToZip[$i]);
        }

        return $zip;
    }

    //#endregion Work with ZIP

    //#region Work with Locations
    public static function getFileName($template, $locname) {
        return strtr($template, array('$name' => $locname));
    }
    //#endregion Work with Locations

    public static function get_visuals($design_id, $server, $output_config, $json)
    {
        $files_folder = $design_id . '/';
        $file_path_prefix = (Configs::isProductionEnv() ? "" : Configs::$DESIGNS_RELATIVE_PATH) . $files_folder;
        $files_folder_path = Configs::getFilesFolderPath() . $files_folder;
        $originEnv = Configs::getGenVizPublicAddress();

        $visuals = new \stdClass();
        $visuals->files = new \stdClass();

        $ungrouped_files = array();

        // processing design locations
        foreach ($json->locations as $loc) {
            $locname = Utils::getLocationName($loc->name);

            foreach ($output_config->rulesArray as &$rule) {
                $fileName = strtr($rule->fileName, array('$name' => $locname));
                if ($rule->type === "PDF") {
                    if (!isset($rule->merge) || $rule->merge === false) {
                        $fileName = basename($rule->fileName, '.pdf') . '_' . $locname . ".pdf";
                    } else {
                        $curr = array_filter(
                            $ungrouped_files,
                            function ($e) use ($fileName) {
                                return $e["name"] == $fileName;
                            }
                        );

                        if (count($curr) > 0) {
                            continue;
                        }
                    }
                }

                array_push($ungrouped_files, array(
                    'name' => $fileName,
                    'id' => $rule->id,
                    'url' => $originEnv . $file_path_prefix . $fileName
                ));
            }
            unset($rule);
            //Prepare convert to PDF/PNG end
        }

        $zip_filename = $design_id . '.zip';
        if (isset($output_config->zip) && $output_config->zip === true &&
            file_exists($files_folder_path . $zip_filename)
        ) {
            $visuals->zip = $originEnv . $file_path_prefix . $zip_filename;
        }

        // grouping
        foreach ($ungrouped_files as &$preview) {
            if (property_exists($visuals->files, $preview["id"])) {
                continue;
            }

            $id_arr = array();
            foreach ($ungrouped_files as $preview_to_group) {
                if ($preview_to_group["id"] === $preview["id"]) {
                    array_push($id_arr, $preview_to_group["url"]);
                }
            }

            if (count($id_arr) > 0) {
                $visuals->files = (object) array_merge((array)$visuals->files,
                    array($preview["id"] => $id_arr)
                );
            }
        }

        unset($preview);

        return $visuals;
    }

    public static function url_origin($s, $use_forwarded_host = false)
    {
        $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on');
        $sp = strtolower($s['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
        $port = $s['SERVER_PORT'];
        $port = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
        $host = ($use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST'])) ? $s['HTTP_X_FORWARDED_HOST'] : (isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null);
        $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    public static function full_url($s, $use_forwarded_host = false)
    {
        return Utils::url_origin($s, $use_forwarded_host) . $s['REQUEST_URI'];
    }

}
