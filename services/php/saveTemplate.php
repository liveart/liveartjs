<?php
error_reporting(E_ERROR | E_PARSE);

/**
 * Save Template service
 * @version 0.5.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 0.5.0");
header('Content-type: application/json');
require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');
include_once './utils/outputConfig/OutputConfig.php';

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;


$lajsFolder = Configs::$LAJS_FOLDER_PATH;
$templates_path = $lajsFolder . Configs::$TEMPLATES_LIST_RELATIVE_PATH;

$templates = (object) array("templatesCategoriesList" => []); //for designs list
if (file_exists($templates_path)) {
	$templates = json_decode(file_get_contents($templates_path));
}

$json = file_get_contents('php://input');
$obj = get_object_vars(json_decode($json));
$json_data = json_encode($obj['data']);
$template["id"] = (isset($obj['id'])) ? $obj['id'] : "template-".date("Ymd-His").'-'.rand(10000, 99999);
$template = Utils::saveDesignData($json_data, true, $template["id"]);

$config = new OutputConfig('../config/generateDesignPreview.json');
Utils::processDesign($template["id"], $config);

$thumb = Configs::$DESIGNS_RELATIVE_PATH . $template["id"]."/design_preview.png";
$template["thumb"] = $thumb;
Utils::cleanUpDesignFolder($template["id"]);
if(isset($obj['productId']))
    $template["productId"] = $obj['productId'];
$title = isset($obj['title']) ? $obj['title'] : null;
$type = isset($obj['type']) ? $obj['type'] : null;
$template["type"] = $type;
$productId = isset($obj['data']) && isset($obj['data']->productId) ? $obj['data']->productId : null;
$template["productId"] = $productId;

$success = true;

if($template){
    if(!isset($obj['id'])){
        $added = false;
        if (isset($templates->templatesCategoriesList)) {
            for ($i = 0; $i < count($templates->templatesCategoriesList); $i++) {
                $category = $templates->templatesCategoriesList[$i];
                if ($category->id == "templates") {
                    array_push($category->templatesList, $template);
                    $added = true;
                    break;
                }
            }
        }

        //
        if(!$added) {
            if (isset($templates->templatesList)) {
                array_push($templates->templatesList, $template);
            }
        }
    }

	//serialize list of designs back into file
	file_put_contents($templates_path, json_encode($templates));
} else {
	$success = false;
}

if ($success) {
	// on success
    $response = array('template' => array(
        'id' => $template["id"],
        'title' => $title
		        )
	        );
} else {
	// on error
	$response = array('error' => array(
		'message' => 'Failed to save Template.'
	));
}

// send response
echo json_encode($response);
?>
