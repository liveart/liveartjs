<?php
error_reporting(E_ERROR | E_PARSE);

require_once('lib/init.php');

$guid = date("Ymd-His").'-'.rand(10000, 99999);
$json_data = $_POST['data'];

$upload_path = "../files/".$guid;
$designs_path = "../files/designs";
$designs = array(); //for designs list

if (!file_exists("../files/")) {
	// create dir for file stuff
	mkdir("../files/");
} 
if (!file_exists($upload_path)) {
	// create dir for design
	mkdir($upload_path);
} 

if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
}

$title = (isset($_POST['title'])) ? $_POST['title'] : "Ordered: ".$guid;
$email = (isset($_POST['email'])) ? $_POST['email'] : "NoMail: ".$guid;

$json_file = $upload_path."/design.json";
if (!file_exists($json_file)) {
	if (CreateFile($json_file, $json_data)){ 
		$design = array(
			'id' => $guid,
			'title' => $title,
			'email' => $email,
			'type' => $_POST['type'],
			'date' => date("Y.m.d H:i"));
		array_push($designs, $design);
	}
}

//serialize list of designs back into file
file_put_contents($designs_path, serialize($designs));

$success = true;
if ($success) {
	// on success
	$response = array('design' => array(
			'id' => $guid, 
			'title' => $title
		)
	);
} else {
	// on error
	$response = array('error' => array(
			'message' => 'Failed to save design.'
		)
	);
}

// send response
echo json_encode($response);
?>