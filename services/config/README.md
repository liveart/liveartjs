## output.json

Used to configure export files.

#### Requirements:
1. [Inkscape 0.92.3](https://inkscape.org/en/release/) or newer
2. [Ghostscript](https://www.ghostscript.com/download.html) for single-file (merged) PDF
3. To use ZIP in php - [respective extension](http://php.net/manual/en/zip.installation.php)

`output.json` file interface:
 
```js
{
    zip: boolean; // defines whether zip archive will be created    
    files: [
        {
            type: string, // `PDF`, `PNG` or `custom`
            id: string, //conversion id
            fileName: string, // template string, '$name' will be replaced with the current location name sample: "location_$name_preview.png"; 
            options: object //see below
        }
    ]
}
```

#### `options` description:

Common:
```js
{
    useEditableArea: boolean = false; // crop image by editable area
    zip: boolean = true; // add file to ZIP archive (if enabled)
    includeProduct: boolean = true; // whether or not to include product in the output (default: true)
}
```

PDF only:
```js
{
    merge: boolean = true; //whether to create a single PDF with all locations merged
    useUnits: boolean = true; //use configured units for the output 
}
```

PNG only:
```js
{
    exportDpi: number = 72; //DPI
}
```

#### `custom` type 

Used to call pre-process (or post-process) functions to achieve custom output.
E.g.: Prepare texture for 3D, export PNG without raster objects, custom size.

See sample usage in `utils/CustomOutput.php`

sample:
```js
{   
    type: "custom";
    id, fileName; //the same
    renderFunction: string; // PHP function name from the same scope as output.json parser.
    options: { //any data for renderFunction is allowed
        useEditableArea, exportDpi, useUnits  //recommended attributes
        zip //ignored attribute
    }
}
```