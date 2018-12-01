<?php

namespace Liveart;
require_once('configs.php');

use Liveart\Configs as Configs;

/**
 * Class SvgUtils
 * @package Liveart
 */
class SvgUtils
{
    /**
     * Creates temporary SVG files ready to convert in PDF/PNG
     * Temporary files for 'Front' location:
     *  1. design_Front.svg (exports always) - entire canvas according to viewBox
     *  2. design_Front_cropped.svg (optional - only if editable area exists) - viewBox reduced to editable area (used for PNG)
     *  3. design_Front_print.svg (optional - only if product dimensions exists) - cropped (if needed) + used configured units (used for PDF)
     * @param $loc
     * @param $designFolderPath
     * @param $LAJSFolderPath
     * @param $UNIT
     * @param $fontsCSSUrl
     * @param $sizes
     * @return array
     */
    public static function processDesignLocation($loc, $designFolderPath, $LAJSFolderPath, $UNIT, $fontsCSSUrl, $sizes)
    {
        $log = "";
        $readyToWriteSVG = array();
        $isDimensionsPresent = isset($sizes) && $sizes->width > 0 && $sizes->height > 0 && strlen($UNIT) > 0;
        $isEdiableAreaPresent = isset($loc->editableArea) && strlen($loc->editableArea) > 0;
        // Remove anything which isn't a word, whitespace, number
        // or any of the following caracters -_~,;:[]().
        $locname = Utils::getLocationName($loc->name);

        //1. read svg content
        $svg = $loc->svg;
        // adding <link> with fonts
        // TODO: skip as currently unsopported feature
        if (isset($fontsCSSUrl) && strlen($fontsCSSUrl) > 0) $svg = SvgUtils::addFontLink($svg, $fontsCSSUrl);

        //2. update links to external images
        $result = SvgUtils::processExternalImages($svg, $LAJSFolderPath, Configs::$SOURCES_ORDER_PHP, $designFolderPath);
        $svg = $result['svg'];
        $log .= $result['log'];

        //3. replace underscore (fixes issue with black color fill in illustrator)
        //   Actual only for default SVG (not for crop/print)
        // TODO: skip as currently unsupported feature (open SVG in AI)
        $svg = SvgUtils::replaceUnderscore($svg);

        //3.1 Replace <mask> with <clipPath>
        //TODO: actually needed only for PDF source files
        $svg = SvgUtils::replaceMask($svg);

        if (!$isDimensionsPresent || $isEdiableAreaPresent) {
            $fullCanvasSVG = array('name' => 'design_' . $locname . '.svg', 'value' => $svg);
            array_push($readyToWriteSVG, $fullCanvasSVG);
            
            // additionally export with no product
            $fullCanvasSvgNoProduct = SVGUtils::removeProductFromSvg($svg);
            $fullCanvasNoProdData = array('name' => 'design_' . Configs::$NO_PRODUCT_SVG_MASK . $locname . '.svg', 'value' => $fullCanvasSvgNoProduct);
            array_push($readyToWriteSVG, $fullCanvasNoProdData);
        }

        //4. update sizes based on editable area
        if ($isEdiableAreaPresent) {
            $croppedSVG = SvgUtils::cropByEditableArea($loc->editableArea, $svg);
            $croppedData = array('name' => 'design_' . $locname . Configs::$CROPPED_SVG_MASK . '.svg', 'value' => $croppedSVG);
            array_push($readyToWriteSVG, $croppedData);
            
            // additionally export with no product
            $croppedSvgNoProduct = SVGUtils::removeProductFromSvg($croppedSVG);
            $croppedNoProdData = array('name' => 'design_' . Configs::$NO_PRODUCT_SVG_MASK . $locname . Configs::$CROPPED_SVG_MASK . '.svg', 'value' => $croppedSvgNoProduct);
            array_push($readyToWriteSVG, $croppedNoProdData);
        }

        //5. update sizes based on product dimensions
        if ($isDimensionsPresent) {
            $svg = isset($croppedSVG) ? $croppedSVG : $svg;
            $svgForPrint = SvgUtils::updateSVGSizesToDimensions($svg, $sizes, $UNIT);

            $printData = array('name' => 'design_' . $locname . Configs::$PRINT_SVG_MASK . '.svg', 'value' => $svgForPrint);
            array_push($readyToWriteSVG, $printData);
            
            // additionally export with no product
            $printSvgNoProduct = SVGUtils::removeProductFromSvg($svgForPrint);
            $printSvgNoProdData = array('name' => 'design_' . Configs::$NO_PRODUCT_SVG_MASK . $locname . Configs::$PRINT_SVG_MASK . '.svg', 'value' => $printSvgNoProduct);
            array_push($readyToWriteSVG, $printSvgNoProdData);

            if (!$isEdiableAreaPresent) {
                //SVG for PNG export. crop by viewbox
                $xml = simplexml_load_string($svg);
                $svgBox = explode(" ", $xml['viewBox']);
                $xml['width'] = $svgBox[2];
                $xml['height'] = $svgBox[3];
                $svg = $xml->asXML();
                $fullCanvasSVG = array('name' => 'design_' . $locname . '.svg', 'value' => $svg);
                array_push($readyToWriteSVG, $fullCanvasSVG);
                
                // additionally export with no product
                $fullCanvasSvgNoProduct = SVGUtils::removeProductFromSvg($svg);
                $fullCanvasNoProdData = array('name' => 'design_' . Configs::$NO_PRODUCT_SVG_MASK . $locname . '.svg', 'value' => $fullCanvasSvgNoProduct);
                array_push($readyToWriteSVG, $fullCanvasNoProdData);
            }
        }

        //6. write files
        SvgUtils::writeSVGFiles($designFolderPath . Configs::$TEMPORARY_FILES, $readyToWriteSVG);

        return array(
            'log' => $log
        );
    }

    //#region External Images

    /**
     * @param $svg
     * @return array
     */
    public static function getExternalImages($svg)
    {
        //matching pattern like xlink:href="url/files.ext" and href="url/files.ext" (MacOS Safari 8)
        $attrib = 'xlink:href';
        $attrib2 = 'href';
        $attribs = "(" . preg_quote($attrib) . "|" . preg_quote($attrib2) . ")";
        $regexp = '/' . $attribs . '=([\'"]([^#].*?)["\'])/is';
        $externalImagesList = array();
        //form list of all external images - $externalImagesList
        preg_match_all($regexp, $svg, $externalImagesList, PREG_PATTERN_ORDER);
        return $externalImagesList;
    }

    /**
     * @param $svg
     * @param $LAJSFolderPath
     * @param $sources
     * @param $designFolderPath
     * @return array
     */
    public static function processExternalImages($svg, $LAJSFolderPath, $sources, $designFolderPath)
    {
        $log = "";
        // get external images
        $externalImagesList = SvgUtils::getExternalImages($svg);
        //iterating all external images
        for ($i = 0; $i < count($externalImagesList[3]); $i++) {
            //$externalImagesList[3] - array of attr values, e.g. 'url/files.ext' (without xlink:href and quotes)
            $imageUrlOrig = $externalImagesList[3][$i];
            //Skip css files
            if (strrpos($imageUrlOrig, ".css") == strlen($imageUrlOrig) - 4)
                continue;
            //echo(strrpos($imageUrlOrig, "data:image") === 0);
            // skips images if they are as data string
            if (strrpos($imageUrlOrig, "data:image") === 0)
                continue;
            //add link prefix to relative files (LAJS folder) - gallery images
            if (strpos($imageUrlOrig, "http") !== 0) {
                $imageUrlFull = $LAJSFolderPath . $imageUrlOrig;
            } else {
                //copy images with absolute url
                $imageUrlFull = $imageUrlOrig;
            }
            $imageFileName = basename($imageUrlOrig);

            if (strpos($imageFileName, 'getTextZ') !== false) {
                $imageFileName = 'getTextZ_' . uniqid() . '.png';
                $imageUrlFull = str_replace("&amp;", "&", $imageUrlFull);
                $imageUrlFull = str_replace(" ", "%20", $imageUrlFull);
            }

            $imageUrlDestination = $designFolderPath . Configs::$TEMPORARY_FILES . $sources . $imageFileName;
            //copy all external images to $sources
            if (strlen($imageUrlOrig)) {
                if (!copy($imageUrlFull, $imageUrlDestination)) {
                    $errors = error_get_last();
                    $log .= "<b>COPY ERROR:</b> " . $errors['type'];
                    $log .= "<br />\n" . $errors['message'] . '<br />';
                    //replace url to one from LAJS folder
                    $svg = str_replace($imageUrlOrig, $imageUrlFull, $svg);
                } else {
                    //replace image url to one from $sources folder
                    $log .= "<a href='$imageUrlDestination'>$imageUrlOrig</a> copied to $sources (" . filesize($imageUrlDestination) . "b)" . '<br />';
                    $svg = str_replace($imageUrlOrig, $sources . $imageFileName . '" attr="u', $svg);
                }
            }
        }
        return array(
            'svg' => $svg,
            'log' => $log
        );
    }

    //#endregion External Images

    //#region Sizes, ViewBox

    /**
     * Updates x,y,width,height and viewBox based on editable area
     * @param string $editableArea - 4 numbers with spaces
     * @param string $svg
     * @return string $svg
     */
    public static function cropByEditableArea($editableArea, $svg)
    {
        if (!isset($editableArea) || strlen($editableArea) < 1) return NULL;

        //convert (string)$svg to (simpleXML)
        $xml = simplexml_load_string($svg);

        $svgBox = explode(" ", $editableArea);
        $svgWidth = $svgBox[2] - $svgBox[0];
        $svgHeight = $svgBox[3] - $svgBox[1];

        //set new x,y,w,h attrs (for proper Inkscape, AI CS5 render, AI CS6 - incorrect render)
        $xml['x'] = $svgBox[0];
        $xml['y'] = $svgBox[1];

        $xml['width'] = $svgWidth;
        $xml['height'] = $svgHeight;
        $xml['viewBox'] = "$svgBox[0] $svgBox[1] $svgWidth $svgHeight";

        //convert (simpleXML)$xml back to string
        $svg = $xml->asXML();

        return $svg;
    }
    
    /**
     * Removes product from the provided SVG.
     * Method:
     * 1. Remove Top and Bottom layers
     * @param string $svg
     * @return string $svg
     */
    public static function removeProductFromSvg($svg)
    {
        $doc = new \DOMDocument();
        $doc->loadXML($svg);
        //xpath
        $xpath = new \DOMXPath($doc);
        $xpath->registerNamespace('svg', 'http://www.w3.org/2000/svg');
        $xpath->registerNamespace('xlink', 'http://www.w3.org/1999/xlink');
        
        $top = $xpath->query("//svg:g[contains(concat(' ', normalize-space(@class), ' '), ' la-top-layer ')]")->item(0);
        $main = $xpath->query("//svg:g[contains(concat(' ', normalize-space(@class), ' '), ' la-main-layer ')]")->item(0);
        $bottom = $xpath->query("//svg:g[contains(concat(' ', normalize-space(@class), ' '), ' la-bottom-layer ')]")->item(0);
        
        if (!is_null($top)) 
        {
            $top->parentNode->removeChild($top);
        }
        
        if (!is_null($bottom)) 
        {
            $bottom->parentNode->removeChild($bottom);
        }
        
        if (!is_null($main)) 
        {
            $main->removeAttribute('clip-path');
            $main->removeAttribute('mask');
        }
       
        return $doc->saveXML();
    }

    /**
     * Updates width, height based on product dimensions.
     * Converts non-zero viewBox to leads from zero.Wraps content to <g> and moves(fix for Illustrator).
     * @param string $svg
     * @param object $sizes
     * @param string $UNIT
     * @return string $svg
     */
    public static function updateSVGSizesToDimensions($svg, $sizes, $UNIT)
    {
        if (!isset($sizes) || $sizes->width < 1 || $sizes->height < 1 || strlen($UNIT) < 1) return NULL;
        $svgForPrint = NULL;
        //convert (string)$svg to (simpleXML)
        $xml = simplexml_load_string($svg);
        //Illustrator-compatible file (units and viewBox simulation)
        //svg file as DOMDocument
        $svgForPrint = new \DOMDocument();
        $svgForPrint->loadXML($svg);
        //xpath
        $svgForPrintXpath = new \DOMXPath($svgForPrint);
        $svgForPrintXpath->registerNamespace('svg', 'http://www.w3.org/2000/svg');
        $svgForPrintXpath->registerNamespace('xlink', 'http://www.w3.org/1999/xlink');
        //root <svg> element
        $svgForPrintRoot = $svgForPrintXpath->query("/svg:svg")->item(0);

        $svgBox = explode(" ", $xml['viewBox']);
        $svgForPrintRoot->setAttribute('width', $sizes->width . $UNIT);
        $svgForPrintRoot->setAttribute('height', $sizes->height . $UNIT);

        //Replace viewBox with <g>-wrap transformation (for Illustrator CS6+ file only)
        //1. reset ViewBox
        $svgForPrintRoot->setAttribute('viewBox', "0 0 $svgBox[2] $svgBox[3]");
        //2. Move all objects
        $svgForPrintChildren = $svgForPrintXpath->query('/svg:svg/*');
        //add <g> element for container
        $svgForPrintGroup = $svgForPrint->createElement("g");
        $svgForPrintGroupNode = $svgForPrintRoot->appendChild($svgForPrintGroup);

        if (isset($svgForPrintGroupNode)) {
            $svgForPrintGroupNode->setAttribute('transform', "translate(-$svgBox[0], -$svgBox[1])");

            foreach ($svgForPrintChildren as $child) {
                //skip defs and desc
                if ($child->nodeName == "defs" || $child->nodeName == "desc") {
                    continue;
                }
                //move to <g>
                $moveChild = $child->parentNode->removeChild($child);
                $svgForPrintGroupNode->appendChild($moveChild);
            }
        }

        //convert DOM document to string
        $svgForPrint = $svgForPrint->saveXML();

        return $svgForPrint;
    }

    //#endregion Sizes, ViewBox

    /**
     *  This fixes issue with black color fill in illustrator
     *  Read more in "tests\services\testData\svgFunctions\replaceUnderscore\README.md"
     *
     * replace "_" to "-x5f-" in class-fill pairs like
     * `<style> .top_right {fill:#F04C4B;} ... </style>` ... `<SVGNode ... class="top_right" ... >`
     * to
     * `<style> .top-x5f-right {fill:#F04C4B;} ... </style>` ... `<SVGNode ... class="top-x5f-right" ... >`
     *
     * @param $svg string
     * @return mixed|string $svg
     */
    public static function replaceUnderscore($svg)
    {
        // 1. Match content of all <style> nodes.
        preg_match_all('/<style(.*?)>(.*?)<\/style>/is', $svg, $matches);
        $matches = $matches[2];
        for ($i = 0; $i < count($matches); $i++) {
            $srt = $matches[$i];
            // 2. Match class names
            $srt = preg_replace('/{(.*?)}/', '', $srt);
            preg_match_all('/\.(.*?)[\s|.|#]/is', $srt, $classes);
            $classes = $classes[1];
            for ($j = 0; $j < count($classes); $j++) {
                $class = $classes[$j];
                // 3. Replace underscore symbol
                if (strpos($class, '_') !== false) {
                    $newClassName = str_replace("_", "-x5f-", $class);
                    $svg = str_replace($class, $newClassName, $svg);
                }
            }
        }
        return $svg;
    }

    /**
     *  Optimization for Adobe Illustrator + PDF: replace <mask> with <clipPath> for design <g>
     *  Read more in "tests\services\testData\svgFunctions\replaceMask\README.md"
     *
     * @param $svg string
     * @return string $svg
     */
    public static function replaceMask($svg)
    {
        $doc = new \DOMDocument();
        $doc->loadXML($svg);

        $docXpath = new \DOMXPath($doc);
        $docXpath->registerNamespace('svg', 'http://www.w3.org/2000/svg');
        $docXpath->registerNamespace('xlink', 'http://www.w3.org/1999/xlink');
        //root <svg> element
        $docDesignG = $docXpath->query("//svg:g[contains(@class,'la-main-layer')]")->item(0);
        if ($docDesignG) {
            $a = $docDesignG->hasAttribute("mask");
            if ($docDesignG->hasAttribute("mask")) {
                $maskValue = $docDesignG->getAttribute('mask');
                $patt = "/url\([\'\\\"]?#(.+[^\'\\\"])[\'\\\"]?\)/i";
                preg_match($patt, $maskValue, $matches);
                $maskId = $matches[1];
                $maskEl = $docXpath->query("//svg:mask[contains(@id,'$maskId')]")->item(0);
                if ($maskEl) {
                    //rename attr
                    $docDesignG->setAttribute('clip-path', $maskValue);
                    $docDesignG->removeAttribute('mask');

                    //'rename' node
                    // create the <clipPath> node.
                    $clipPathNode = $doc->createElement('clipPath');
                    $maskAttrs = $maskEl->attributes;
                    foreach ($maskAttrs as $maskAttr) {
                        $clipPathNode->setAttributeNodeNS($maskAttr->cloneNode());
                    }
                    $maskEl->parentNode->appendChild($clipPathNode);

                    // Move the <mask> children over.
                    if ($childNodes = $docXpath->query("//svg:mask[contains(@id,'$maskId')]/*")) {
                        foreach ($childNodes as $childNode) {
                            $clipPathNode->appendChild($childNode);
                        }
                    }

                    // Remove <mask>.
                    $maskEl->parentNode->removeChild($maskEl);
                }
            }
        }

        return $doc->saveXML();
    }

    /**
     * @param $svg
     * @param $href
     * @return string
     */
    public static function addFontLink($svg, $href)
    {
        $doc = new \DOMDocument();
        $doc->loadXML($svg);
        $link = $doc->createElement("link");
        $link->setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        $link->setAttribute("type", "text/css");
        $link->setAttribute("rel", "stylesheet");
        $link->setAttribute("href", $href);
        $node = $doc->getElementsByTagName('defs')->item(0);

        $node->appendChild($link);

        return $doc->saveXML();
    }

    /**
     * Gets array of SVG strings and writes to files
     * @param string $designFolderPath - path for save
     * @param array({string} name, {string} value) $readyToWriteSVG - array of SVG string - name
     */
    public static function writeSVGFiles($designFolderPath, $readyToWriteSVG)
    {
        foreach ($readyToWriteSVG as $svg) {
            $filenameFull = $designFolderPath . $svg['name'];
            $f = fopen($filenameFull, "w");
            fwrite($f, $svg['value']);
            fclose($f);
        }
    }
}

?>
