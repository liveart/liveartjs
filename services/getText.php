<?php

	//ini_set('display_errors',1);
	//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
	// TODO get fonts from config
	// TODO implement correct temp text file storage
	$temp_file = "../files/text".time().".png";

	// TODO implement correct storage flush if required
	// if (file_exists($temp_file)) { unlink($temp_file); }
	$params = array();
	array_push($params, '-t "'.$_GET["t"].'"');
	$fx = "arch-top"; // by default
	if (isset($_GET["fx"])) {
		$fx = $_GET["fx"];
	}
	array_push($params, "-e ".$fx);
	array_push($params, '-f "../fonts/Ubuntu/Ubuntu-R.ttf"');
	if (empty($_GET["p"])) {
		if (empty ($_GET["s"])) { 
			$size = "400x"; 
		} else {
			$size = $_GET["s"];
		}
		array_push($params, '-S '.$size); // width/height size
	} else {
		array_push($params, '-p '.$_GET["p"]); // point size
	}
	$color = "black";
	if (isset($_GET["c"])) {
		$color = $_GET[c];
	}
	array_push($params, '-c '.$color); // color
	array_push($params, '-b transparent');
	array_push($params, '-x 0');
	$line = './texteffect '.implode(" ", $params).' '.$temp_file;

	//$line = './texteffect -t "'.$_GET["t"].'" -e arch-top -f "../fonts/Ubuntu/Ubuntu-R.ttf" -p "'.$_GET["p"].'" -c black -b transparent -x 0 '.$temp_file;

	$t = exec($line);
	//error_log("EXEC:".$line, 3, "../files/.log");

	if (isset($_GET["debug"])) {
		echo $line;
		echo "<br>exec: ".$t;
	} else {
		header('Content-type: image/png');
		echo file_get_contents($temp_file);	
	}

?>