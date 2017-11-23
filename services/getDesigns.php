<?php

header('Access-Control-Allow-Origin: *');
require_once('lib/init.php');
require_once('configs.php');
use Liveart\Configs as Configs;

$designs_path = Configs::$LAJS_FOLDER_PATH . Configs::$DESIGNS_RELATIVE_PATH . "designs";
$user_email = $_GET['email'] ? $_GET['email'] : "";
$response["designs"] = array(); 

if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
    if($designs){
        foreach ($designs as $d) {
            if($d["type"] != "shared" && $d["email"] === $user_email){
                array_push ($response["designs"], array('id' => $d["id"], 'title' => $d["title"], 'date' => $d["date"], 'type' => $d["type"])); 
            }
        }
    }
}
	
// send response
echo json_encode($response);
?>