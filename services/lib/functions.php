<?php
session_start();
$rec = new Request();
function _request($name) {
	global $rec;
	Return $rec->Value($name);
}

function get_raw_post_data(){
	return ($GLOBALS["HTTP_RAW_POST_DATA"])?$GLOBALS["HTTP_RAW_POST_DATA"]:$HTTP_RAW_POST_DATA;
}

function ParseXMLData($xml_data){
	$parser = new xml_doc($xml_data);
	$parser->parse();
	return $parser->xml_index;
}

function FindTagByName($xml_index, $tag_name){
	@reset($xml_index);
	while(list($key,$val) = @each($xml_index)){
		if ($val->name == strtoupper($tag_name)){
			return $val;
		}
	}
	return;
}


function FindTagsByName($xml_index, $tag_name){
	$result = array();
	@reset($xml_index);
	while(list($key,$val) = @each($xml_index)){
		if ($val->name == strtoupper($tag_name)){
			$result[] = $val;
		}
	}
	return $result;
}

function ReadTagContent($xml_index, $tag_name){
	$tag_obj = $this->FindTagByName($xml_index, $tag_name);
	return  ($tag_obj)?$tag_obj->contents:"";
}

function pre_print($array) {
	echo '<pre>';
	print_r($array);
	echo '</pre>';
}

// Extend this routine if you'd like more info to be shown when checking order
function ParseOrderXmlData($doc){
	$order = array();
	if($doc){
		$order["pdf_url"] = $doc->attributes["PDF_URL"];
		$order["price"] = $doc->attributes["PRICE"];
		if($doc->children){
			$productTag = FindTagsByName($doc->children, "PRODUCT");
			if($productTag){
				while(list($key,$val) = @each($productTag)){
					$order["product_name"] = $val->attributes["NAME"];
				}
			}
		}
	}
	return $order;
}

function generateGUIDCharacter(){
	$possible = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$char = substr($possible, mt_rand(0, strlen($possible)-1), 1);
	return $char;
}

function generateGUID($length){
	$guid = "";
	for ($i=0;$i< $length; $i++ ){
		$guid .= generateGUIDCharacter();
	}
	return $guid;
}

function CreateFile($full_path, $content, $mode = "w"){
	if ($handle = fopen($full_path, $mode)) {
		if (fwrite($handle, $content)) {
			fclose($handle);
			return true;
		}
	}
	return false;
}

function ReadFileFromFS($filename){
	if (file_exists($filename)) {
		$handle = fopen ($filename, "r");
		$contents = fread ($handle, filesize ($filename));
		fclose ($handle);
		return $contents;
	}
	return "";
}

function GetOrderUidFromPdfName($name){
	return str_replace(".pdf", "", str_replace("liveArtPDF","", $name) );
}

function ComposeAdminEmailBody($guid, $order_data){
	$body = ADMIN_EMAIL_BODY;
	//
	$body = str_replace("[guid]", $guid, $body);
	$body = str_replace("[name]", $order_data["name"], $body);
	$body = str_replace("[email]", $order_data["email"], $body);
	$body = str_replace("[check_order_url]", CHECK_ORDER_URL . $guid , $body);
	//
	$body = str_replace("[quantity]", $order_data["quantity"] , $body);
	$body = str_replace("[proof_required]", $order_data["proof_required"] , $body);
	$body = str_replace("[inc_color]", $order_data["inc_color"] , $body);
	$body = str_replace("[image]", $order_data["image"] , $body);
	//
	return $body;
}


function SendOrderEmail($to, $subject, $body, $pdf_source, $pdf_name){
		$m = new PHPMailer();
		$m->Subject = $subject;
		$m->AddAddress($to);
		$m->MsgHTML($body);
		$m->From = FROM_EMAIL;
		$m->FromName = FROM_NAME;
		$m->AddStringAttachment($pdf_source, $pdf_name);
		//
		if(!$m->Send()) {
			return false;
		}
		return true;
}

function SafeGuid($guid){
	$restricted = array(".", "/", "\\", ":");
	return str_replace($restricted, "", $guid);
}

// Returns base URL with LiveArt
function getBaseURL() {
	$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === FALSE ? 'http' : 'https';
	$arr = explode("/", $protocol."://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']);
	return implode("/", array_slice($arr, 0, count($arr)-2))."/";
}

// Returns directory where files will be saved
function getFilesDir() {
	$break = explode('/', dirname(__FILE__));
	//call twice to throw out lib and services
	array_pop($break);
	array_pop($break);
	return implode('/', $break)."/files";
}

function file_get_contents_BOM($filename) {
	$str = file_get_contents($filename);
	$bom = pack("CCC", 0xef, 0xbb, 0xbf);
	if (0 === strncmp($str, $bom, 3)) {
	    $str = substr($str, 3);
	}
	return $str;
}

?>