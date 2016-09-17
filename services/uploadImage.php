<?php
	error_reporting(E_ERROR | E_PARSE | E_WARNING);
	header("Access-Control-Allow-Origin: *");
	
	$absolute_path = "files/uploads/";
	$relative_path = "../files/uploads/";
	if (!is_dir($relative_path)) {
            mkdir($relative_path, 777, true);
	}

	//regular upload
	if (isset($_FILES["image"])) {
		$file = $_FILES["image"];		
		if(is_image($file["name"])){
			$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
      date_default_timezone_set('UTC');
			$name = date("Ymd-His")."_".uniqid().".".$ext;		
			$res = move_uploaded_file($file["tmp_name"], $relative_path.$name);
      
      if (!$res) {
        $response = array('error' => array(
				  'message' => 'Unable to save the image'
			  ));
      } else {    
			  //Strip orientation information for JPEG
        if(function_exists("exif_imagetype")){ 
			      if(exif_imagetype($relative_path.$name) == IMAGETYPE_JPEG){
			        $img = imagecreatefromjpeg ($relative_path.$name);
				      imagejpeg ($img, $relative_path.$name, 100);
				      imagedestroy ($img);
			      }
        }

		    $response["url"] = $absolute_path.$name; 
      }
		} else {
			$response = array('error' => array(
				'message' => 'Incorrect image type!'
			));
		};
		
		echo json_encode($response);
	};

	//upload by url
	if (isset($_POST['fileurl'])) {
		$response = array("url"=>"","error"=>false,"msg"=>"");
		if(is_image($_POST['fileurl'])){
			$url = $_POST['fileurl'];
			$name = basename($url);
			$ext = pathinfo($name, PATHINFO_EXTENSION);
			$ext = strtolower($ext);
			$name = date("Ymd-His")."_".uniqid().".".$ext;	
			
			$upload = file_put_contents($relative_path.$name, file_get_contents($url));
			if ($upload) {
				$response["url"] = $absolute_path.$name;
			}else{
				$response = array('error' => array(
					'message' => 'Can\'t upload image from the URL'
				));
			}
		}else{
			$response = array('error' => array(
				'message' => 'Incorrect image type!'
			));
		};

		echo json_encode($response);
		
	};
	
	function is_image($filename){
		$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
		return in_array($ext , array("jpg", "jpeg", "svg", "gif", "bmp", "png"));
	}
?>
