<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE);
/**
 * Visuals service
 * @version 2.1.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 2.1.0");
require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');
include_once './utils/outputConfig/OutputConfig.php';
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

use Monolog\Logger as Logger;
use Monolog\Handler\StreamHandler as StreamHandler;

use LiveArt\LoggerStub as LoggerStub;

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;
use OutputConfig;

if (Configs::$GEN_VIZ_LOGS) {
  $log = new Logger('generateVisualsLogger');
  $log->pushHandler(new StreamHandler('./generateVisuals.log', Logger::INFO));
  $log->pushHandler(new StreamHandler('./generateVisuals.log', Logger::ERROR));
} else {
  $log = new LoggerStub();
}

$guid = $_GET['design_id'];

$log->info("Received request for $guid with method: " . $_SERVER['REQUEST_METHOD']);
$log->info('getFilesFolderPath() resolved to ' . Configs::getFilesFolderPath());

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
    }
    if (!$cfg_is_object && !file_exists($cfg))
    {
        http_response_code(404);
        echo json_encode(array(
            'error' => "Config does not exist: '$cfg'."
        ));
        exit();
    } else
    {
        $log->info("Config has been provided through GET param");
        $config = new OutputConfig($cfg, $cfg_is_object);
    }
} else
{
    $cfgPath = Configs::getDefaultOutputConfigPath();
    $log->info('Using default output config');
    if (!file_exists($cfgPath)) {
        $log->error("Output config not found: \"$cfgPath\"");
    }

    $config = new OutputConfig($cfgPath, false);
}
$filesFolder = Configs::getFilesFolderPath();
$designFolderPath = $filesFolder . $guid . "/";
$json = NULL;
if ($_SERVER['REQUEST_METHOD'] === 'POST') { // if POST then design's json must be provided in body
    $input = file_get_contents('php://input');
    $json = get_object_vars(json_decode($input))['data'];
    Utils::createFolder($filesFolder);
    Utils::createFolder($designFolderPath);
    $log->info("Created directory \"$designFolderPath\"");
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') { 
    // otherwise just read it from files directory
    // works only for standalone LAJS100
    $json = Utils::readSavedDesign($designFolderPath);
}
$log->info('Design type: ' . $json->design->type);
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
