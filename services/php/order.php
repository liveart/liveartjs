<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE | E_NOTICE | E_WARNING);
/**
 * Order service
 * @version 0.6.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 0.6.0");
require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');
include_once './utils/outputConfig/OutputConfig.php';
header("Access-Control-Allow-Origin: *");

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;
use OutputConfig;

$config = new OutputConfig('../config/output.json');

$guid = $_GET['design_id'];
$lajsFolder = Configs::$LAJS_FOLDER_PATH;
$designFolderPath = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . $guid . "/";

$json = Utils::readSavedDesign($designFolderPath);
Utils::processDesign($guid, $config);
$isPHPzipInstalled = extension_loaded('zip');

if ($config->parsedConfig->zip === true && $isPHPzipInstalled) {
    $filesToZip = array();

    foreach ($config->rulesArray as &$rule) {
        if ($rule->zip === true) {
            if (isset($rule->merge) && $rule->merge === true) { // as there is only 1 file with all locations
                $filesToZip[] = $rule->fileName;
            } else {
                foreach ($json->locations as &$loc) {
                    if ($rule->zip === true) {
                        $fileName = strtr($rule->fileName, array('$name' => $loc->name));
                        $filesToZip[] = $fileName;
                    }
                }

                unset($loc);
            }
        }
    }
    unset($rule);

    $zipFilename = $designFolderPath . $guid . ".zip";
    $zip = Utils::zipFiles($zipFilename, $designFolderPath, $filesToZip);

    $zipNumFiles = $zip->numFiles;
    $zipStatus = $zip->status;

    $zip->close();
}

if (isset($_GET['info'])) {
    header("Location: ../static/order_info.html?design_id=$guid");
}
