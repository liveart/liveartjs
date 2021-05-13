<?php

namespace Order;

error_reporting(E_ERROR | E_PARSE);
/**
 * Debug service
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
$lajsFolder = Configs::getLAJSFolderPath();
$designFolderPath = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . $guid . "/";

$json = Utils::readSavedDesign($designFolderPath);
Utils::processDesign($guid, $config);
$isPHPzipInstalled = extension_loaded('zip');
?>
<div>
    <ul class="list-group">
        <li class="list-group-item">
            PHP
            <span class="badge"><?php echo phpversion(); ?></span>
        </li>

        <?php
        $inkscapeInfo = Utils::isInstalled('inkscape');
        $inkscapeVersion = $inkscapeInfo["version"];
        if (!$inkscapeInfo["installed"]) {
            echo "<li class=\"list-group-item\">
                Inkscape
            <span class=\"badge\">NOT INSTALLED</span>
            </li>";
        } else {
            for ($i = 0; $i < sizeof($inkscapeVersion); $i++) {
                echo "<li class=\"list-group-item\">
                    Inkscape
                    <span class=\"badge\">" . str_replace('Inkscape ', '', $inkscapeVersion[$i]) . "</span>
                </li>";
            }
        } ?>

        <li class="list-group-item">
            PHP-zip
            <span class="badge"><?php echo $isPHPzipInstalled ? "installed" : "not installed"; ?></span>
        </li>

    </ul>


</div>
