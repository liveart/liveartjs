<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
require_once('lib/init.php');

require_once('configs.php');
use Liveart\Configs as Configs;
$lajsFolder = Configs::$LAJS_FOLDER_PATH;

$email = $_GET['email'];

$designs_path = $lajsFolder . Config::$DESIGNS_RELATIVE_PATH;

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
