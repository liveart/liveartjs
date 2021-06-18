<?php

require_once("Utils.php");
require_once("SvgUtils.php");
require_once("CustomOutputUtils.php");

use Liveart\Configs as Configs;

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

/**
 * Sample custom function
 * Goal: 
 *  - Use prepared SVG for each location
 *  - Customize the file
 *  - Clean-up the result
 */
function createTempFiles($locations, $output, $data)
{
    //array with temporary file paths
    $tempFiles = array();
    //iterate all locations
    foreach ($locations as $idx => $loc) {
        //temporary SVG file path for each location
        $tempFilePath = "$data[workDir]/temp/svgTemp-$idx.svg";
        array_push($tempFiles, $tempFilePath);
        //process actual SVG file (prepared) - `$loc["svgFilePath"]`
        //and save result to `$tempFilePath` path
    }
    //remove temp files
    if (!Configs::isDebug()) {
        Utils::removeFiles($tempFiles);
    }
}

/**
 * Sample custom function
 * Used by LACP by default
 * Create preview for the design (only first location)
 * Custom options:
 *  - width
 */
function generateDesignPreview($locations, $output, $data)
{
    foreach ($locations as $loc) {
        //custom export PNG function (accept custom config.options.width and legacy options)
        CustomOutputUtils::exportPng($loc["svgFilePath"], $loc["exportFilePath"], $output["options"]);
        //stop on the first location
        break;
    }
}

?>