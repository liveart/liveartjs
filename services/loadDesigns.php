<?php
header('Access-Control-Allow-Origin: *');
require_once('lib/init.php');

$email = $_GET['email'];

$designs_path = "../files/designs";

if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
}

$response["designs"] = array(); 

foreach ($designs as $d) {
	if ($d["email"]==$email) {
		array_push ($response["designs"], array('id' => $d["id"], 'title' => $d["title"], 'date' => $d["date"])); 	
	}
}
		
// send response
echo json_encode($response);
?>