<?php
error_reporting(E_ERROR | E_PARSE);

/**
 * Save Design service
 * @version 0.5.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 0.5.0");
header('Content-type: application/json');

require_once('lib/init.php');
require_once('utils/Utils.php');
require_once('configs.php');

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;

$lajsFolder = Configs::getLAJSFolderPath();
$designs_path = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . "designs";
$designs = array(); //for designs list
if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
}

$designId = null;
$added = false;
$json = file_get_contents('php://input');
$obj = get_object_vars(json_decode($json));

if(isset($obj['id']) && isset($obj['title'])) {
    $id = $obj['id'];
    foreach($designs as $key=>$value) {
        if($id == $value["id"]) {
            if($obj['title'] == $value["title"]) {
                $designId = $id;
                unset($designs[$key]);
            }
            break;
        }
    }
}

$json_data = json_encode($obj['data']);
$title = (isset($obj['title'])) ? $obj['title'] : null;
$email = (isset($obj['email'])) ? $obj['email'] : null;

$design = Utils::saveDesignData($json_data, false, $designId);
$design["title"] = $title;
$design["email"] = $email;
$design["type"] = $obj['type'];

$success = true;
if($design){
	array_push($designs, $design);
	//serialize list of designs back into file
	file_put_contents($designs_path, serialize($designs));
} else {
	$success = false;
}

if ($success) {
	// on success
    $response = array('design' => array(
			        'id' => $design["id"],
			        'title' => $design["title"]
		        )
	        );
} else {
	// on error
	$response = array('error' => array(
		'message' => 'Failed to save design.'
	));
}

// send response
echo json_encode($response);
?>
