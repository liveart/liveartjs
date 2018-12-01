<?php

class CustomOutputUtils
{
    /**
     * @param $input - file path
     * @param $output - file path
     * @param $options - config.options
     * @param string $cmd custom command to add (e.g. "--export-background #FFFFFF")
     */
    public static function exportPng($input, $output, $options, $cmd = "")
    {
        $command = "inkscape $input -e $output";

        if (isset($options)) {
            if (isset($options->exportDpi)) {
                $command = "$command -d " . $options->exportDpi;
            }
            if (isset($options->width)) {
                $command = "$command -w " . $options->width;
            }
        }

        if (isset($cmd)) {
            $command = "$command $cmd";
        }
        exec($command);
    }

    /**
     * Used for texture rendering, requires IM
     * @param $images
     * @param $output
     */
    public static function mergeImages($images, $output)
    {
        $images_str = implode(" ", $images);
        exec("convert $images_str +append $output");
    }

    /**
     * Get nearest greater power of 2
     * E.g. greaterTwoPOW(208) = 256
     * (used for texture rendering)
     * @param $n number
     * @return float|int
     */
    public static function greaterTwoPow($n)
    {
        $pot = 1;
        $pow = 0;
        while ($pot < $n) {
            $pot = pow(2, $pow++);
        }
        return $pot;
    }

    /**
     * Read SVG file
     * @param $svgPath
     */
    public static function readSvg($svgPath)
    {
        file_get_contents($svgPath);
    }

    /**
     * More simple than SvgUtils::writeSVGFiles
     * @param $svg
     * @param $svgPath
     */
    public static function writeSvg($svg, $svgPath)
    {
        $f = fopen($svgPath, "w");
        fwrite($f, $svg['value']);
        fclose($f);
    }

    /**
     * Remove SVG elements  by xpath query
     * @param $svgInputPath
     * @param $svgOutputPath
     * @param $query
     * @return int
     */
    public static function svgRemoveByQuery($svgInputPath, $svgOutputPath, $query)
    {
        $doc = new \DOMDocument();
        $doc->load($svgInputPath);

        $svgXpath = new \DOMXPath($doc);
        $svgXpath->registerNamespace('svg', 'http://www.w3.org/2000/svg');
        $svgXpath->registerNamespace('xlink', 'http://www.w3.org/1999/xlink');
        $queryResult = $svgXpath->query($query);

        foreach ($queryResult as $element) {
            if ($element) $element->parentNode->removeChild($element);
        }

        return $doc->save($svgOutputPath);
    }
}