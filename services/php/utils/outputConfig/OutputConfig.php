<?php

include_once "OutputOptionsObject.php";

class OutputConfig
{
    public $parsedConfig;
    public $rulesArray;
    public $zip;

    public function __construct($configPath, $cfg_is_object = false)
    {
        if ($cfg_is_object) {
            $this->parsedConfig = $configPath;
        } else {
            $this->parsedConfig = json_decode(file_get_contents($configPath));
        }
        foreach ($this->parsedConfig->files as &$elem) {
            if ($elem->type === "PDF") {
                $this->rulesArray[] = new PdfOutputOptionsObject($elem);
            } else if ($elem->type === "PNG") {
                $this->rulesArray[] = new PngOutputOptionsObject($elem);
            } else if ($elem->type === "custom") {
                $this->rulesArray[] = new CustomOutputOptionsObject($elem);
            }
        }
        unset($elem);

        $this->zip = $this->parsedConfig->zip;
    }
}
