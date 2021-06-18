<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE);
/**
 * Visuals service
 * @version 2.3.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 2.3.0");
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

$log = Utils::createLogger('GenerateVisuals');

$guid = $_GET['design_id'];
$method = $_SERVER['REQUEST_METHOD'];

$log->debug("Received request for $guid with method: " . $_SERVER['REQUEST_METHOD']);
$log->debug('getFilesFolderPath() resolved to ' . Configs::getFilesFolderPath());

$errorMsg = NULL;

$configFileName = NULL;
$config = NULL;
if (isset($_GET['config']))
{
    $cfg = urldecode($_GET['config']);
    $cfg_is_object = false;
    try {
        $js = json_decode($cfg);
        if (json_last_error() == JSON_ERROR_NONE) {
            $cfg = $js;
            $cfg_is_object = true;
        }
    } catch (Exception $e) {
        $errorMsg = "Failed to parse GET param 'config'";
    }
    if (!$cfg_is_object && !file_exists($cfg))
    {
        $errorMsg = "Config '$cfg' does not exist on file system";
        $log->error($errorMsg);

        http_response_code(404);
        echo json_encode(array('error' => $errorMsg));
        exit();
    } else
    {
        $configFileName = !$cfg_is_object ? $cfg : "[Object]";
        $log->debug("Using config from GET param: '$configFileName'");
        $config = new OutputConfig($cfg, $cfg_is_object);
    }
} else
{
    $cfgPath = Configs::getDefaultOutputConfigPath();
    if (!file_exists($cfgPath)) {
        $errorMsg = "Config '$cfgPath' does not exist on file system";
        $log->error($errorMsg);
    }

    $configFileName = $cfgPath;
    $log->debug("Using default config: '$configFileName'");

    $config = new OutputConfig($cfgPath, false);
}

$log->info("New $method request for design #$guid using config '$configFileName'");

$filesFolder = Configs::getFilesFolderPath();
$designFolderPath = $filesFolder . $guid . "/";
$json = NULL;
if ($method === 'POST') { 
    // if POST then design's json must be provided in body
    $input = file_get_contents('php://input');
    $json = get_object_vars(json_decode($input))['data'];

    if(empty($json)) $log->error("Design object is empty. Please verify payload.");
    
    Utils::createFolder($filesFolder);
    Utils::createFolder($designFolderPath);
    $log->debug("Created directory \"$designFolderPath\"");
} else if ($method === 'GET') { 
    // otherwise just read it from files directory
    // works only for standalone LAJS100
    $json = Utils::readSavedDesign($designFolderPath);
}
$log->debug('Design type: ' . $json->design->type);
$process_design_logs = Utils::processDesign($guid, $config, $json);
file_put_contents("log.txt", $process_design_logs);
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
                        $locname = Utils::getLocationName($loc->name);
                        $fileName = strtr($rule->fileName, array('$name' => $locname));
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

header('Content-Type: application/json');
echo json_encode(
    Utils::get_visuals($guid, $_SERVER, $config, $json)
);
