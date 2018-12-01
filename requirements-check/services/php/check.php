<?php
error_reporting(E_ERROR | E_PARSE);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once('util/check_version.php');
include_once('../../../LiveArtJS/services/php/configs.php');
include_once('../../../services/php/configs.php');
use Liveart\Configs as Configs;

$string = file_get_contents("../../config.json");
$json_c = json_decode($string, true);

foreach ($json_c['software'] as &$obj) {
    $ver = Utils::handle_version($obj);
    $obj = (array)$obj;
    $obj['installedVersion'] = $ver;
    $obj = (object)$obj;
}
unset($obj);

$json_c['configuration']['designs'] = array(
    'path' => Configs::$DESIGNS_RELATIVE_PATH,
    'writable' => is_writable('../../../' . Configs::$DESIGNS_RELATIVE_PATH)
);

$upload_relative_to_root_dir = Configs::$UPLOAD_CONFIGS["folder"]["url_prefix"]; // TODO: properly resolve to DESIGNS_FOLDER_RELATIVE_PATH

$json_c['configuration']['upload'] = array(
    'destination' => Configs::$UPLOAD_CONFIGS["destination"],
    'path' => $upload_relative_to_root_dir,
    'writable' => is_writable('../../../' . $upload_relative_to_root_dir),
    'maxSize' => ini_get("upload_max_filesize")
);

http_response_code(200);
echo json_encode($json_c);