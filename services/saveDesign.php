<?php
error_reporting(E_ERROR | E_PARSE);

require_once('lib/init.php');
require_once('utils/Utils.php');
require_once('configs.php');

use Liveart\Utils as Utils;
use Liveart\Configs as Configs;

$lajsFolder = Configs::$LAJS_FOLDER_PATH;
$designs_path = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . "designs";
$designs = array(); //for designs list
if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
}

$designId = null;
$added = false;
if(isset($_POST['id']) && isset($_POST['title'])) {
    $id = $_POST['id'];
    foreach($designs as $key=>$value) {
        if($id == $value["id"]) {
            if($_POST['title'] == $value["title"]) {
                $designId = $id;
                unset($designs[$key]);
            }
            break;
        }
    }
}

$json_data = $_POST['data'];
$title = (isset($_POST['title'])) ? $_POST['title'] : null;
$email = (isset($_POST['email'])) ? $_POST['email'] : null;

$design = Utils::saveDesignData($json_data, false, $designId);
$design["title"] = $title;
$design["email"] = $email;

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