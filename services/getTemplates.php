<?php

header('Access-Control-Allow-Origin: *');
require_once('lib/init.php');
require_once('configs.php');

use Liveart\Configs as Configs;
use Liveart\SvgUtils;

$templates_path = Configs::$LAJS_FOLDER_PATH . Configs::$CONFIG_TEMPLATES;
$productId = $_GET['product_id'] ? $_GET['product_id'] : "";
$response["templatesCategoriesList"] = array();

if (file_exists($templates_path)) {
    $templates = json_decode(file_get_contents($templates_path));
    if ($templates) {

        $categories = $templates_list = $templates->templatesCategoriesList;
        $response["templatesCategoriesList"] = processTemplateCategories($categories, $productId);
    }
}


function processTemplateCategories($categories, $productId)
{
    $result = array();
    foreach ($categories as $category) {
        $cat = processTemplateCategory($category, $productId);
        if ($cat) {
            array_push($result, $cat);
        }
    }
    return $result;
}

function processTemplateCategory($category, $productId)
{
    $templates_list = isset($category->templatesList)?$category->templatesList:array();
    $template_categories = isset($category->categories)?$category->categories:array();

    $res_templates = array();
    if ($templates_list) {
        $res_templates = processTempalteList($templates_list, $productId);
    }
    $res_categories = array();
    if ($template_categories) {
        $res_categories = processTemplateCategories($template_categories, $productId);
    }
    $category->templatesList = $res_templates;
    $category->categories = $res_categories;


    if (count($category->templatesList) === 0 && count($category->categories) === 0) {
        return null;
    }

    return $category;
}

function processTempalteList($templates_list, $productId)
{
    $templatesArray = array();
    foreach ($templates_list as $t) {
        if ($productId == "") {
            if (!isset($t->productId)) {
                array_push($templatesArray, $t);
            }
        } else {
            if (isset($t->productId) && $t->productId === $productId) {
                array_push ($templatesArray, $t);
            }
        }
    }
    return $templatesArray;
}

// send response
echo json_encode($response);
?>