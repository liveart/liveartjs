<?php
error_reporting(E_ERROR | E_PARSE);
header("Access-Control-Allow-Origin: *");

/**
 * Upload Image service
 * @version 0.5.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 0.5.0");
require_once('configs.php');

use Liveart\Configs as Configs;

date_default_timezone_set('UTC');

$response = array();
/** Image data */
$content;
$ext;

if (!empty($_SERVER['CONTENT_LENGTH']) && empty($_FILES) && empty($_POST)) {
    echo json_encode(array('error' => array('message' => 'The uploaded image is too large. You must upload a file smaller than ' . ini_get("upload_max_filesize"))));
} else {

    $file_field = 'image';
    //regular upload
    if ((!empty($_FILES[$file_field])) && ($_FILES[$file_field]['error'] == 0)) {
        $file = $_FILES["image"];
        if (is_image($file["name"])) {
            $ext = pathinfo($file["name"], PATHINFO_EXTENSION);
            if (function_exists("exif_imagetype")) {
                //Strip orientation information for JPEG
                if (exif_imagetype($file["tmp_name"]) == IMAGETYPE_JPEG) {
                    image_fix_orientation($file["tmp_name"]);
                }
            }
            $content = file_get_contents($file["tmp_name"]);
            unlink($file["tmp_name"]);
        } else {
            $response = array('error' => array(
                'message' => 'Incorrect image type!'
            ));
        };
    }

    //upload by url
    if (isset($_POST['fileurl'])) {
        $response = array("url" => "", "error" => false, "msg" => "");
        $url = urldecode($_POST['fileurl']);

        $name = $url;
        $pos = strpos($url, "?");
        if ($pos !== false) {
            $name = substr($url, 0, $pos);
        }

        $ext = getExtension($url);

        $name = $guid = date("Ymd-His") . '-' . rand(10000, 99999) . "." . $ext;


        if (is_image($name)) {
            $ext = pathinfo(basename($name), PATHINFO_EXTENSION);
            $content = file_get_contents($url);
            if ($content == false) {
                $response = array('error' => array(
                    'message' => 'Can\'t upload image from the URL'
                ));
                return;
            }
        } else {
            $response = array('error' => array(
                'message' => 'Incorrect image type!'
            ));
        };
    };

    $configs = Configs::$UPLOAD_CONFIGS;
    $name = date("Ymd-His") . "_" . uniqid() . "." . $ext;

    if ($content) {
        if ($configs["destination"] === "folder") {
            $relative_folder = $configs["folder"]["relative_path"];
            $relative_path = $relative_folder . $name;
            $file_url = $configs["folder"]["url_prefix"] . $name;

            if (!is_dir($relative_folder)) {
                mkdir($relative_folder, 777, true);
            }


            $originEnv = getenv('LACP_PUBLIC_ADDRESS') !== false ? getenv('LACP_PUBLIC_ADDRESS') . '/api/liveart/php/' : '';

            file_put_contents($relative_path, $content);
            $response["url"] = $originEnv . $file_url;
        }
    } else if (!isset($response["error"])) {
        $response = array('error' => array(
            'message' => 'Image content is empty!'
        ));
    }

    echo json_encode($response);
}

function is_image($filename)
{
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($ext, array("jpg", "jpeg", "svg", "gif", "bmp", "png"));
}

function image_fix_orientation($filename)
{
    $exif = exif_read_data($filename);
    if (!empty($exif['Orientation'])) {
        $image = imagecreatefromjpeg($filename);
        switch ($exif['Orientation']) {
            case 3:
                $image = imagerotate($image, 180, 0);
                break;

            case 6:
                $image = imagerotate($image, -90, 0);
                break;

            case 8:
                $image = imagerotate($image, 90, 0);
                break;
        }

        imagejpeg($image, $filename, 90);
    }
}

function getExtension($url)
{
    stream_context_set_default([
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);
    $mime = get_headers($url, 1)["Content-Type"];

    if ($mime !== NULL) {
        return explode('/', $mime)[1];
    } else {
        $ext = pathinfo($name, PATHINFO_EXTENSION);
        return strtolower($ext);
    }
}

?>
