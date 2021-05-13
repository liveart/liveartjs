<?php
/*
	getQuote.php
	This is sample code for returning the price lines to designer

*/
  /**
   * Get Quote service
   * @version 0.5.1
   * version is also being passed in header
   */

	error_reporting(E_ERROR | E_PARSE);
	header("X-LA-Service-Version: 0.5.1");
	header('Access-Control-Allow-Origin: *');
    require_once('configs.php');
    use Liveart\Configs as Configs;

	// get and process data
    if(strtolower($_SERVER['CONTENT_TYPE'])=="application/json;charset=utf-8" || strtolower($_SERVER['CONTENT_TYPE'])=="application/json"){
        $rawJsonStr=file_get_contents("php://input"); // read request body
    } else { // legacy, get json from Content-Type: application/x-www-form-url-encoded
        // get json from 'data' form field
        $data = $_POST['data'];
        $rawJsonStr = stripslashes(urldecode($data));
    }

	$json = json_decode($rawJsonStr);

	// pure hard-code, you'd probably store the products data in DB
	$products = json_decode(file_get_contents(Configs::getLAJSFolderPath() . "/config/products.json"));
	// get the data

	$price = 20; // some default price
	$colorsNum = 0;

	// let's get item price from original json or put flat rate if it isn't there
	foreach ($products->productCategoriesList as $cat) {
		foreach ($cat->products as $prod) {
			// looking for the right product
	 		if ($prod->id == $json->product->id) {
	 			if (isset($prod->data) && isset($prod->data->price)) {
		 			$price = $prod->data->price;
	 			}
	 		}
		}
	 }
	// now let's calculate decoration based on colors used, like for screenprinting
	 foreach ($json->locations as $loc) {
	 	if (isset($loc->colors)) {
	 		$colorsNum += $loc->colors;
	 	}
	 }

	// finally, put some volume discount and calculate total
	$qty = 0;
	// disregard sizes
	foreach ($json->quantities as $q) {
		$qty += intval($q->quantity);
	}
	$disc = 0.0025 * $qty; // 0.25% discount for each
	// each color is $5 per item
	$decoPrice = round($colorsNum * $qty * 5, 2);
	$subTotal = $price*$qty + $decoPrice;
	// discount is...
	$discPrice = round($subTotal * $disc, 2);
	$total = $subTotal-$discPrice;

	// finally, start creating response
	$success = true;
	if ($success) {
		// on success
		$response = array('prices' => array(
				array('label' => 'Item Price', 'price' => format($price)),
				/*array('label' => 'Decoration', 'price' => format($decoPrice)),*/
				/*array('label' => 'Discount '.strval($disc*100).'%', 'price' => '-'.format($discPrice)),*/
				array('label' => 'Total', 'price' => format($total), 'isTotal' => true)
			)
		);
	} else {
		// on error
		$response = array('error' => array(
				'message' => 'Failed to process quote.'
			)
		);
	}

	function format($num) {
		return sprintf('$%01.2f', $num);
	}


	// send response
    header('Content-Type: application/json');
	echo json_encode($response);
?>