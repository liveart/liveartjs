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

#### `options` description

_(With default values)_

Common:
```js
{
    useEditableArea: boolean = true; // crop image by editable area
    zip: boolean = true; // add file to ZIP archive (if enabled)
    includeProduct: boolean = true; // whether or not to include product in the output
}
```

PDF only:
```js
{
    merge: boolean = true; // whether to create a single PDF with all locations merged
    useUnits: boolean = true; // use configured units for the output; editable area is used for export
}
```

PNG only:
```js
{
    exportDpi: number; // DPI
}
```

    `exportDpi` usage notes:
    - if `exportDpi` is not specified:
        - export in SVG coordinate system, e.g. default full output is 590x530px
    - if units are configured (editable area or resizable product):
        - export dimensions as unit@dpi above
    - if units are not configured:
        - `exportDpi: 96` has no effect as becomes default
        - scale SVG coordinate system respectively, e.g. 300dpi mean 3.12 scale (300/96)

    PNG export notes:
    - `useEditableArea: false` is useless for any resizable products (the same result)

    PNG export known issues:
    - avoid using `useEditableArea: false` with `exportDpi` for non-resizable products with configured units (actually nonsense output)

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
    options: { // any data for renderFunction is allowed
        useEditableArea, exportDpi, useUnits  // require custom implementation (or reuse) to work as described above
        zip // ignored attribute
    }
}
```