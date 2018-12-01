<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE);
/**
 * Visuals service
 * @version 1.0.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 1.0.0");
require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');
include_once './utils/outputConfig/OutputConfig.php';
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;
use OutputConfig;

$config = NULL;
if (isset($_GET['output_config']))
{
    $cfg = $_GET['output_config'];
    if (!file_exists($cfg))
    {
        echo json_encode(array(
            'visuals' => array(
                'error' => "Config does not exist: '$cfg'."
            )
        ));

        exit();
    } else
    {
        $config = new OutputConfig($cfg);
    }
} else 
{
    $config = new OutputConfig('../config/output.json');
}

$guid = $_GET['design_id'];
$lajsFolder = Configs::$LAJS_FOLDER_PATH;
$designFolderPath = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . $guid . "/";

$json = Utils::readSavedDesign($designFolderPath);
file_put_contents("log.txt", Utils::processDesign($guid, $config));
$isPHPzipInstalled = extension_loaded('zip');

if ($config->parsedConfig->zip === true && $isPHPzipInstalled) {
    $filesToZip = array();

    foreach ($config->rulesArray as &$rule) {
        if ($rule->zip === true) {
            if ($rule->merge === true) { // as there is only 1 file with all locations
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

    $zip->close();
}

echo json_encode(array(
    'visuals' => Utils::get_visuals($guid, $_SERVER, $config)
));