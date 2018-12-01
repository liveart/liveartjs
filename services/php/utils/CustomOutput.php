<?php

require_once("Utils.php");
require_once("SvgUtils.php");
require_once("CustomOutputUtils.php");

use Liveart\Utils as Utils;
use Liveart\SvgUtils as SvgUtils;
use Liveart\CustomOutputUtils as OutputUtils;

/**
 * Sample custom function
 * Use CustomOutputUtils.php as functions helper
 *
 * Config:
        {
            "type": "custom",
            "renderFunction": "generatePng",
            "fileName": "design_$name_preview.png",
            "id": "preview_png",
            "options": {
                "useEditableArea": false,
                "width": 110
            }
        },
 *
 * Result: create PNG file for each location
 *
 * @param $locations array of locations (same order as in product) with the structure:
 *                      - name (product location name, e.g. "Front")
 *                      - svgFilePath (according to options, e.g. "../../001/temp/design_Front.svg")
 *                      - exportFileName (ready-to-use config.fileName, e.g. "design_Front_preview.svg")
 *                      - exportFilePath (path + exportFileName, e.g. "../../001/design_Front_preview.svg")
 * @param $output object with export configuration (from config):
 *                      - options
 *                      - fileName
 * @param $data object with the additional data:
 *                      - design (object with design json)
 *                      - workDir (directory with all the files (with trailing slash), e.g. "../../001/")
 */
function generatePng($locations, $output, $data)
{
    //iterate all locations
    foreach ($locations as $loc) {
        //custom export PNG function (accept custom  config.options.width)
        CustomOutputUtils::exportPng($loc["svgFilePath"], $loc["exportFilePath"], $output["options"]);
    }
}

function createTempFiles($locations, $output, $data)
{
    //create temporary files
    $tempFiles = array();
    foreach ($locations as $idx=>$loc) {
        //temporary SVG for each location
        $tempFilePath = "$data[workDir]svgTemp-$idx.svg";
        array_push($tempFiles, $tempFilePath);
        //process temp svg file here
    }
    //remove temp files
    Utils::removeFiles($tempFiles);
}

function generateDesignPreview($locations, $output, $data)
{
    foreach ($locations as $loc) {
        //custom export PNG function (accept custom  config.options.width)
        CustomOutputUtils::exportPng($loc["svgFilePath"], $loc["exportFilePath"], $loc["options"]);
        break;
    }
}

?>