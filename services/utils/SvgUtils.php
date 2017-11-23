<?php

namespace Liveart;
require_once('configs.php');
use Liveart\Configs as Configs;

/**
 * Class SvgUtils
 * @package Liveart
 */
class SvgUtils {
	/**
	 * @param $svg
	 * @param $href
	 * @return string
     */
	public static function addFontLink($svg, $href) {
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
	 * @param $LAJSFolderPath
	 * @param $config
	 * @return mixed
     */
	public static function readConfigUnit ($LAJSFolderPath, $config){
		$configFile = file_get_contents_BOM($LAJSFolderPath.$config);
		if (get_magic_quotes_gpc()) {
			$configFile = trim(stripslashes($configFile));
		}
		$config = json_decode($configFile);
		if (isset($config->options->unit)) {
			return $config->options->unit;
		}
	}

    public static function readFontsCSSUrl($LAJSFolderPath, $config){
		$configFile = file_get_contents_BOM($LAJSFolderPath.$config);
		if (get_magic_quotes_gpc()) {
			$configFile = trim(stripslashes($configFile));
		}
		$config = json_decode($configFile);
		if (isset($config->options->fontsCSSUrl)) {
			return $config->options->fontsCSSUrl;
		}
	}

	/**
	 * @param $designFolderPath
	 * @return mixed
     */
	public static function readSavedDesign($designFolderPath){
		$file = file_get_contents_BOM($designFolderPath."design.json");
		if (get_magic_quotes_gpc()) {
			$design = stripslashes($file);
		} else {
			$design = $file;
		}
		return json_decode($design);

	}

	/**
	 * @param $svg
	 * @return array
     */
	public static function getExternalImages($svg){
		//matching pattern like xlink:href="url/files.ext" and href="url/files.ext" (MacOS Safari 8)
		$attrib = 'xlink:href';
		$attrib2 = 'href';
		$attribs = "(".preg_quote($attrib)."|".preg_quote($attrib2).")";
		$regexp = '/' . $attribs . '=([\'"]([^#].*?)["\'])/is';
		$externalImagesList = array();
		//form list of all external images - $externalImagesList
		preg_match_all($regexp, $svg, $externalImagesList, PREG_PATTERN_ORDER);
		return $externalImagesList;
	}

	/**
	 * @param $designFolderPath
	 * @param $sources
	 * @return array
     */
	public static function createFolderForExternalImages($designFolderPath, $sources){
		$log = "";
		//create folder for external images (if not exist)
		if (!file_exists($designFolderPath.$sources)) {
			if (!mkdir($designFolderPath.$sources, 0777)) {
			    $log .= 'Failed to create folder $sources :('.'<br />';
			} else {
				$log .=  'Created directory '.$sources.'<br />';
			}
		}
		return array('log' => $log);
	}

	/**
	 * @param $externalImagesList
	 * @param $svg
	 * @param $LAJSFolderPath
	 * @param $sources
	 * @param $designFolderPath
	 * @param $filesToZip
	 * @return array
     */
	public static function processExternalImages($externalImagesList, $svg, $LAJSFolderPath, $sources, $designFolderPath, $filesToZip){
		$log = "";
		//iterating all external images
		for($i = 0; $i < count($externalImagesList[3]); $i++) {
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
			if (strpos($imageUrlOrig, "http") !== 0 ) {
				$imageUrlFull = $LAJSFolderPath.$imageUrlOrig;
			} else {
				//copy images with absolute url
				$imageUrlFull = $imageUrlOrig;
			}
		        $imageFileName = basename($imageUrlOrig);

			if (strpos($imageFileName, 'getTextZ') !== false) {
				$imageFileName = 'getTextZ_'.uniqid().'.png';
				$imageUrlFull = str_replace("&amp;", "&", $imageUrlFull);
				$imageUrlFull = str_replace(" ", "%20", $imageUrlFull);
			}

			$imageUrlDestination = $designFolderPath.$sources.$imageFileName;
		        //copy all external images to $sources
			if (strlen($imageUrlOrig)) {
				if(!copy($imageUrlFull, $imageUrlDestination))
				{
				    $errors= error_get_last();
				    $log .=  "<b>COPY ERROR:</b> ".$errors['type'];
				    $log .=  "<br />\n".$errors['message'].'<br />';
				    //replace url to one from LAJS folder
				    $svg = str_replace($imageUrlOrig, $imageUrlFull, $svg);
				} else {
					//replace image url to one from $sources folder
				    $log .=  "<a href='$imageUrlDestination'>$imageUrlOrig</a> copied to $sources (".filesize($imageUrlDestination)."b)".'<br />';
				    $svg = str_replace($imageUrlOrig, $sources.$imageFileName.'" attr="u', $svg);
				    array_push($filesToZip, $sources.$imageFileName);
				}
			}
		}
		return array(
			'filesToZip' => $filesToZip,
			'svg' => $svg,
			'log' => $log
		) ;
	}

	/**
	 * @param $loc
	 * @param $defaultWidth
	 * @param $defaultHeight
	 * @return array
     */
	public static function getSVGSizes($loc, $defaultWidth, $defaultHeight){
		$svgWidth = $defaultWidth;
		$svgHeight = $defaultHeight;
		if(isset($loc) && isset($loc->editableArea)){
			$svgBox = explode(" ", $loc->editableArea);

			//update new svg dimensions
			$svgWidth = $svgBox[2] - $svgBox[0];
			$svgHeight = $svgBox[3] - $svgBox[1];
		}
		return array("width" => $svgWidth, "height" => $svgHeight);
	}

	// update viewBox based on editable area (if present. if not present - use default one)
	/**
	 * @param $loc
	 * @param $svg
	 * @param $sizes
	 * @param $UNIT
	 * @param $svgWidth
	 * @param $svgHeight
	 * @return array
     */
	public static function updateViewBox($loc, $svg, $sizes, $UNIT, $svgWidth, $svgHeight){
		$svgUnits = NULL;
		if (isset($loc->editableArea) && strlen($loc->editableArea) > 0) {
            $svg = SVGUtils::replaceUnderscore($svg);
			//original file with updated viewbox (as editable area)
			//convert (string)$svg to (simpleXML)
			$xml = simplexml_load_string( $svg );

            //Illustrator-compatible file (units and viewBox simulation)
			//svg file as DOMDocument
			$svgUnits = new \DOMDocument();
			$svgUnits->loadXML($svg);
			//xpath
			$svgUnitsXpath = new \DOMXPath($svgUnits);
			$svgUnitsXpath->registerNamespace('svg', 'http://www.w3.org/2000/svg');
			$svgUnitsXpath->registerNamespace('xlink', 'http://www.w3.org/1999/xlink');
			//root <svg> element
			$svgUnitsRoot = $svgUnitsXpath->query("/svg:svg")->item(0);

			if(!Configs::$SKIP_BOUNDS){
			$svgBox = explode(" ", $loc->editableArea);


				$svgSizes = SvgUtils::getSVGSizes($loc, $svgWidth, $svgHeight);
				//update new svg dimensions
				$svgWidth = $svgSizes["width"];
				$svgHeight = $svgSizes["height"];

				//set new x,y,w,h attrs (for proper Inkscape, AI CS5 render, AI CS6 - incorrect render)
				$xml['x'] = $svgBox[0];
				$xml['y'] = $svgBox[1];

				$xml['width'] = $svgWidth;
				$xml['height'] = $svgHeight;
				$xml['viewBox'] = $svgBox[0] . " " . $svgBox[1] . " " . $svgWidth . " " . $svgHeight;
			}

			$svgUnitsRoot->setAttribute('width', $svgWidth);
			$svgUnitsRoot->setAttribute('height', $svgHeight);

			if (isset($sizes) &&
                $sizes->width > 0 &&
				$sizes->height > 0 &&
                strlen($UNIT) > 0
			) {
			    $svgUnitsRoot->setAttribute('width', $sizes->width . $UNIT);
			    $svgUnitsRoot->setAttribute('height', $sizes->height . $UNIT);

				//Replace viewBox with <g>-wrap transformation (for Illustrator CS6+ file only)
				//1. reset ViewBox
				$svgUnitsRoot->setAttribute('viewBox', "0 0 $svgWidth $svgHeight");
				//2. Move all objects
				$svgUnitsChildren = $svgUnitsXpath->query('/svg:svg/*');
				//add <g> element for container
				$svgUnitsGroup = $svgUnits->createElement("g");
				$svgUnitsGroupNode = $svgUnitsRoot->appendChild($svgUnitsGroup);

				if (isset($svgUnitsGroupNode)) {
					$svgUnitsGroupNode->setAttribute('transform', "translate(-$svgBox[0], -$svgBox[1])");

					foreach ($svgUnitsChildren as $child) {
						//skip defs and desc
						if ($child->nodeName == "defs" || $child->nodeName == "desc") {
							continue;
						}
						//move to <g>
						$moveChild = $child->parentNode->removeChild($child);
						$svgUnitsGroupNode->appendChild($moveChild);
					}
				}
			}
			//convert (simpleXML)$xml back to string
			$svg = $xml->asXML();
		}
		return array(
			'svg' => $svg,
			'svgUnits' => $svgUnits,
			'svgWidth' => $svgWidth,
			'svgHeight' => $svgHeight
		);
	}

	/**
	 * @param $locname
	 * @param $designFolderPath
	 * @param $svg
	 * @param $filesToZip
	 * @param $svgWidth
	 * @param $svgHeight
	 * @param $svgUnits
     * @return array
     */
	public static function writeSVGFiles($locname, $designFolderPath, $svg, $filesToZip, $svgWidth, $svgHeight, $svgUnits){
		$filename = "design_".$locname.".svg";
        $filenameUnits = "design_".$locname."_units.svg";
		$fnamePng = "design_".$locname.".png";
		$fnamePdf = "design_".$locname.".pdf";
		$filenameFull = $designFolderPath.$filename;
        $filenameFullUnits = $designFolderPath.$filenameUnits;

		//if (!file_exists($filenameFull)) {
			$f = fopen($filenameFull, "w");
			fwrite($f, $svg);
			fclose($f);
			array_push($filesToZip, $filename);

			if(isset($svgUnits) && Configs::$USE_UNITS) {
				$svgUnits->save($filenameFullUnits);
				array_push($filesToZip, $filenameUnits);
			}
		//}
		return array(
			'filenameFull' => $filenameFull,
			'filesToZip' => $filesToZip
		);
	}

    /** 
     *  This fixes issue with black color fill in illustrator
     * 
     * replace "_" to "-x5f-" in class-fill pairs like
     * `<style> .top_right {fill:#F04C4B;} ... </style>` ... `<SVGNode ... class="top_right" ... >`
     * to 
     * `<style> .top-x5f-right {fill:#F04C4B;} ... </style>` ... `<SVGNode ... class="top-x5f-right" ... >`
     *
     * @param svg string
     * @return svg string
     */
    public static function replaceUnderscore($svg) {
        // 1. Match content of all <style> nodes.
        preg_match_all ('/<style(.*?)>(.*?)<\/style>/is', $svg, $matches);
        $matches = $matches[2];
        for($i = 0; $i < count($matches); $i++){
            $srt = $matches[$i];
            // 2. Match class names
            $srt = preg_replace('/{(.*?)}/', '', $srt);
            preg_match_all ('/\.(.*?)[\s|.|#]/is', $srt, $classes);
            $classes = $classes[1];
            for($j = 0; $j < count($classes); $j++) {
                $class = $classes[$j];
                // 3. Replace underscore symbol
                if(strpos($class, '_') !== false){
                    $newClassName = str_replace("_", "-x5f-", $class);
                    $svg = str_replace($class, $newClassName, $svg);
                }
            }
        }
        return $svg;
    }

}
?>