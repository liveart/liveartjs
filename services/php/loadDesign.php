<?php
  /**
   * Load Design service
   * @version 0.5.0
   * version is also being passed in header
   */
    header("X-LA-Service-Version: 0.5.0");
	header('Access-Control-Allow-Origin: *');
	header('Content-type: application/json');
	require_once('lib/init.php');
	require_once('configs.php');
    use Liveart\Configs as Configs;
    $lajsFolder = Configs::$LAJS_FOLDER_PATH;

	// get and process data
	$id = $_GET['design_id'];

	$file_path = $lajsFolder . Configs::$DESIGNS_RELATIVE_PATH . "$id/design.json";

	if (file_exists($file_path)) {
		$response = /*stripslashes*/(file_get_contents($file_path));
	} else {
		// on error
		$response = array('error' => array(
				'message' => 'Failed to load design:'.$file_path
			)
		);
		$response = json_encode($response);
	}

	// send response
	echo $response;
?>
