<?php

class OutputOptionsObject
{
    public $useEditableArea;
    public $id = "";
    public $includeProduct;
    public $fileName;
    public $zip;

    public function __construct($rule)
    {
        if (isset($rule->options->useEditableArea)) {
            $this->useEditableArea = $rule->options->useEditableArea;
        } else {
            $this->useEditableArea = true;
        }

        $this->fileName = $rule->fileName;

        if (isset($rule->options->zip)) {
            $this->zip = $rule->options->zip;
        } else {
            $this->zip = true;
        }
        
        if (isset($rule->options->includeProduct)) {
            $this->includeProduct = $rule->options->includeProduct;
        } else {
            $this->includeProduct = true;
        }
    }
}

class PdfOutputOptionsObject extends OutputOptionsObject
{
    public $type = "PDF";
    public $id = "";
    public $useUnits;
    public $merge = true;

    public function __construct($rule)
    {
        parent::__construct($rule);

        if (isset($rule->options->useUnits)) {
            $this->useUnits = $rule->options->useUnits;
        } else {
            $this->useUnits = true;
        }

        if ($this->useUnits) {
            $this->useEditableArea = true;
        }

        if (isset($rule->options->merge)) {
            $this->merge = $rule->options->merge;
        }

        if (isset($rule->id)) {
            $this->id = $rule->id;
        }
    }
}

class PngOutputOptionsObject extends OutputOptionsObject
{
    public $type = "PNG";
    public $id = "";
    public $useUnits;
    public $exportDpi;

    public function __construct($rule)
    {
        parent::__construct($rule);

        if (isset($rule->options->exportDpi)) {
            $this->useUnits = true;
            $this->exportDpi = $rule->options->exportDpi;
        } else {
            $this->useUnits = false;
            $this->exportDpi = 96;
        }

        if (isset($rule->id)) {
            $this->id = $rule->id;
        }
    }
}

class CustomOutputOptionsObject extends OutputOptionsObject
{
    public $type = "custom";
    public $options;
    public $renderFunction;

    public function __construct($rule)
    {
        parent::__construct($rule);

        if (isset($rule->renderFunction)) {
            $this->renderFunction = $rule->renderFunction;
        }
        if (isset($rule->options)) {
            $this->options = $rule->options;
        } else {
            $this->options = array();
        }

        if (isset($rule->id)) {
            $this->id = $rule->id;
        }
    }
}
