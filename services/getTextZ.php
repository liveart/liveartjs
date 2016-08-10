<?php
        //comment these if no log is required
        ini_set('display_errors',1);
        error_reporting(E_ERROR | E_WARNING | E_PARSE);

        //build font index to identify which font is required
        //for certain family/style/weight combination
        function buildFontIndex() {
                // get list of available fonts for imagemagick
                $o = shell_exec("convert -list font");
                $ph = array("\n  Font: ","\n    family: ","\n    style: ","\n    stretch: ","\n    weight: ","\n    glyphs: ");
                $to = array("\n",",",",",",",",",",");
                $l = str_replace($ph,$to,$o);

                $flist = explode("\n",$l);
                $flist2 = array();
                foreach ($flist as $f) {
                        array_push($flist2, explode(",",$f));
                }
                $fonts = array();
                foreach ($flist2 as $f2) {
                        $fonts[$f2[1]][$f2[2]][$f2[4]] = $f2[0];
                }
                // if the above can be optimized - be my guest :)
                return $fonts;
        }

        $temp_file = "../files/text".time().".png";
        $params = array();
        $isSlant = false;
        // text
        if (isset($_GET["t"])) {
                array_push($params, '-t "'.$_GET["t"].'"');
        }
        // angle -360..-1 for arc-bottom and 1..360 for arc-top
        if (isset($_GET["a"])) {
                $angle = intval($_GET["a"]);
        }
        // -d .... distortion ............ distortion amount; 0<=float<=1; default=0.5
        if (isset($_GET["d"])) {
                $dist = floatval($_GET["d"]);
        }
        if (isset($_GET["sw"])) {
                $strokeWidth = floatval($_GET["sw"]);
        }
        if (isset($_GET["fx"])) {
                switch ($_GET["fx"]) {
                        case "arch":
                                $fx = ($dist>0)? "arch-top" : "arch-bottom";
                                break;
                        case "arc": //circle applies here as well
                                $fx = ($angle>0)? "arc-top" : "arc-bottom";
                                break;
                        case "inflate":
                                $fx = "convex";
                                break;
                        case "wave":
                                // possibly test and add wave-top as well
                                $fx = "wave-bottom";
                                break;
                        case "perspective":
                                $fx = "wedge-bottom";
                                break;
                        case "perspective-top":
                                $fx = "wedge-top";
                                break;                                
                        case "slant":
                                $isSlant = true;
                                $fx = "slant";
                                break;
                        case "smile":
                                $fx = "convex-bottom";
                                break;
                }
        }
        array_push($params, "-e ".$fx);
        if (isset($angle)) { array_push($params, "-a ".abs($angle)); }
        if (isset($dist)) { array_push($params, "-d ".abs($dist)); }
        // setting font
        if (isset($_GET["fn"])) {
                $idx = buildFontIndex(); // get available fonts
                // map styles
                $styles = array("b" => array("Normal","700"),"i" => array("Italic","400"),"bi" => array("Italic","700"));
                if (isset($_GET["st"])) {// if style is set
                        $style = $styles[$_GET["st"]][0];
                        $weight = $styles[$_GET["st"]][1];
                } else { //set default ones
                        $style = "Normal";
                        $weight = "400";
                } 
				$fn = $idx[$_GET["fn"]][$style][$weight]; // attempt to fetch the right font
                //If no font in table with default style and weight
				if (!isset($fn)) {
					if (isset($idx[$_GET["fn"]][$style])) {
						//Find clothest weight with current style
						$closestWeight = 0;
						foreach ($idx[$_GET["fn"]][$style] as $i => $value) {
							if ($closestWeight == 0) {
								$closestWeight = $i;
							} else {
							        if (abs($weight - $closestWeight) > abs($i - $closestWeight)) {
		                                                	$closestWeight = $i;
								}
							}
					
						}
						$fn = $idx[$_GET["fn"]][$style][$closestWeight];
					} else {
						$fn = "Courier"; // this would mean font not found
					}
				}
                array_push($params, '-f "'.$fn.'"');
        } else {
                //put some default font
                array_push($params, '-f Courier');
        }
        if (isset($_GET["p"])) {
                 array_push($params, '-p '.$_GET["p"]); // point size
        }
        //set resolution of image
        if (isset($_GET["s"])) {
                $size = $_GET["s"];
                array_push($params, '-S '.$size); // width/height size
        }
        $color = "black";
        $outline = ""; // no outline by default
        if (isset($_GET["c"])) {        $color = $_GET[c];      }
        if (isset($_GET["o"])) {
                $outline = urldecode($_GET[o]);
                array_push($params, "-o '".$outline."'"); // outline color
                array_push($params, '-s outline -l 2');
        }
        array_push($params, "-c '".urldecode($color)."'"); // color
        array_push($params, '-b transparent');
        array_push($params, '-x 0');
        $line = './texteffect '.implode(" ", $params).' '.$temp_file;
        if ($isSlant) {
                $line = "convert -pointsize ".$_GET["p"]." -font "
                        .$fn." -fill '".$color."'"
                        .(($outline!="") ? " -stroke '".$outline."' -strokewidth ".$strokeWidth:"")
                        ." -gravity center label:'"
                        .$_GET["t"]."' -background transparent -transparent white -shear 0x"
                        .abs($angle)." ".$temp_file;
        }

        $t = exec($line);
        //error_log("EXEC:".$line, 3, "../files/.log");

        if (isset($_GET["debug"])) {
                echo $line;
                echo "<br>exec: ".$t;
        } else {
                header('Content-type: image/png');
                echo file_get_contents($temp_file);
        }
        unlink($temp_file);
?>