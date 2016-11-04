<?php
error_reporting(E_ERROR | E_PARSE);

require_once('lib/init.php');

$guid = isset($_POST['id']) ? $_POST['id'] : getUID();
$json_data = $_POST['data'];

$designs_path = "../files/designs";
$designs = array(); //for designs list

if (!file_exists("../files/")) {
	// create dir for file stuff
	mkdir("../files/");
} 

if (file_exists($designs_path)) {
	$designs = unserialize(file_get_contents($designs_path));
}

$guid = getUID();
$title = (isset($_POST['title'])) ? $_POST['title'] : "Ordered: ".$guid;
$email = (isset($_POST['email'])) ? $_POST['email'] : "NoMail: ".$guid;
$design = array(
			'id' => $guid,
			'title' => $title,
			'email' => $email,
			'type' => $_POST['type'],
			'date' => date("Y.m.d H:i"));
$added = false;
if(isset($_POST['id']) && isset($_POST['title'])) {
    $id = $_POST['id'];
    foreach($designs as $key=>$value) {
        if($id == $value["id"]) {
            if($_POST['title'] == $value["title"]) {
                $design["id"] = $id;
                $designs[$key] = $design;
                $added = true;
            }
            break;
        }
    }
}

$upload_path = "../files/".$design["id"];
if (!file_exists($upload_path)) {
	// create dir for design
	mkdir($upload_path);
} 


$json_file = $upload_path."/design.json";
file_put_contents($json_file, $json_data);
if(!$added) array_push($designs, $design);

/*if (!file_exists($json_file)) {
	if (CreateFile($json_file, $json_data)){ 
		$design = array(
			'id' => $guid,
			'title' => $title,
			'email' => $email,
			'type' => $_POST['type'],
			'date' => date("Y.m.d H:i"));
        
        $added = false;
        foreach($designs as $key=>$value) {
            if($value["id"] == $design["id"]) {
                if($value["title"] == $design["title"]) {
                    $designs[$key] = $design;
                    $added = true;
                } else {
                    $design["id"] = getUID();
                }
                break;
            }
        }
		if(!added) array_push($designs, $design);
	}
}*/
//var_dump($design);

//serialize list of designs back into file
file_put_contents($designs_path, serialize($designs));

$success = true;
if ($success) {
	// on success
	$response = array('design' => array(
			'id' => $design["id"], 
			'title' =>  $design["title"]
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

function getUID(){
    return date("Ymd-His").'-'.rand(10000, 99999);
}
?>