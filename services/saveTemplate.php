<?php
error_reporting(E_ERROR | E_PARSE);

require_once('lib/init.php');
require_once('utils/SvgUtils.php');
require_once('utils/Utils.php');
require_once('configs.php');

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;
use Liveart\SvgUtils as SvgUtils;

$templates_path = "../config/templates.json";
$templates = (object) array("templatesCategoriesList" => []); //for designs list
if (file_exists($templates_path)) {
	$templates = json_decode(file_get_contents($templates_path));
}

$json_data = $_POST['data'];
$template["id"] = (isset($_POST['id'])) ? $_POST['id'] : "template-".date("Ymd-His").'-'.rand(10000, 99999);
$template = Utils::saveDesignData($json_data, true, $template["id"]);

Utils::processDesign($template["id"]);

$thumb = Utils::exportDesignPreview($template["id"], 110);
$template["thumb"] = $thumb;
Utils::cleanUpDesignFolder($template["id"]);
if(isset($_POST['productId']))
    $template["productId"] = $_POST['productId'];
$name = isset($_POST['name']) ? $_POST['name'] : null;
$template["name"] = $name;

$success = true;

if($template){
    if(!isset($_POST['id'])){
        $added = false;
        for($i = 0; $i < count($templates->templatesCategoriesList); $i++) {
            $category = $templates->templatesCategoriesList[$i];
            if($category->id == "templates"){
                array_push($category->templatesList, $template);
                $added = true;
                break;
            }
        }

        if(!$added) {
            $category = array(
                'id' => "templates",
                'name' => 'templates',
                'templatesList' => array($template)
            );
            array_push($templates->templatesCategoriesList, $category);
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
			        'name' => $name
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