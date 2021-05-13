<?php
/**
 * Get Templates service
 * @version 0.5.0
 * version is also being passed in header
 */
header("X-LA-Service-Version: 0.5.0");
header('Access-Control-Allow-Origin: *');
require_once('lib/init.php');
require_once('configs.php');

use Liveart\Configs as Configs;

$lajsFolder = Configs::getLAJSFolderPath();
$templates_path = $lajsFolder . Configs::$TEMPLATES_LIST_RELATIVE_PATH;
$productId = $_GET['product_id'] ? $_GET['product_id'] : "";
$response["templatesCategoriesList"] = array();

if (file_exists($templates_path)) {
    $templates = json_decode(file_get_contents($templates_path));
    if ($templates) {
        if (isset($templates->templatesCategoriesList)) {
            $response["templatesCategoriesList"] = processTemplateCategories($templates->templatesCategoriesList, $productId);
        } else if (isset($templates->templatesList)) {
            $response["templatesList"] = processTemplatesList($templates->templatesList, $productId);
        }
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
    $templates_list = isset($category->templatesList) ? $category->templatesList : array();
    $template_categories = isset($category->categories) ? $category->categories : array();

    $res_templates = array();
    if ($templates_list) {
        $res_templates = processTemplatesList($templates_list, $productId);
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

function processTemplatesList($templates_list, $productId)
{
    $templatesArray = array();
    $i = 1;
    foreach ($templates_list as $t) {

        if ($productId == "") {
            $item = array(
                'id' => $t->id,
                'name' => isset($t->name) ? $t->name : "Design Idea $i",
                "thumb" => $t->thumb
            );
            $i++;
            if ($t->type === "design idea") {
                array_push($templatesArray, $item);
            }
        } else if (isset($t->productId) && $t->productId === $productId) {
            $item = array(
                'id' => $t->id,
                'name' => isset($t->name) ? $t->name : "Premade Template $i",
                "thumb" => $t->thumb
            );
            $i++;
            array_push($templatesArray, $item);
        }
    }
    return $templatesArray;
}

// send response
echo json_encode($response);
?>
