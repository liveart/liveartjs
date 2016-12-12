# LiveArt HTML5 Trial Package
Trial version of the LiveArt HTML5 Product designer - http://www.developflash.com/html5-product-designer

LiveArt HTML5 is an HTML-based product designer with clean MVVM model, based on the following core technologies:
0. TypeScript;
1. Raphael;
2. Bootstrap;
3. KnockouJS and JQuery;

Further documentation could be found on:
- Primary API Reference - http://liveart.github.io/slate/#introduction
- Knowledge Base - https://liveart.uservoice.com/knowledgebase

This particular package also does include sample PHP backend endpoints, contained in services/ folder. Please note that they are not intended to be used on production.

## How to deploy and launch
1. Unzip the package into separate folder;
2. If launched locally, please use Firefox. (Other browsers have security issues with reading static JSON files).
3. If launched from server, make sure to follow technical requirements below.

## Technical requirements for server
- Any sort of Linux or Windows.
- Static files configuration for JSON and WOFF files. Failing to configure this step may result in malfunctioning designer.
- PHP enabled for correct design save and processing;
- ImageMagick and Inkscape (v0.91) installed on the server for image and output processing.
- scripts should have permission to write files into folders `/files` and `/files/uploads` (for sample save design, upload image, and make order)

========================

## CHANGELOG
### 0.10.22 RELEASE NOTES
Updates:
- added `mainBackgroundColor` option to .less configuration vars

### 0.10.21 RELEASE NOTES
Fixes:
- saveDesign request `location.editableArea` value is always sent (even if `options.includePrintingAreaInDesign == false` in config file)

saveDesign.php
- added "ordered" possible value for request attribute `data.type`. It can be `saved|shared|ordered`
- added `data.design` - Object - `{title?: string, type: string (saved|shared|ordered)}` attribute to reqeust

loadDesign.php
- added `data.design` - Object - optional(may be skipped for previously saved designs) - `{title?: string, type: string (saved|shared|ordered)}` attribute to response

UI changes:
- added preloaders for save\share design, get designs list and print
- translation changes:
	- added new keys: `PLACING_ORDER_MESSAGE`, `LOADING_YOUR_DESIGN_MESSAGE`, `SAVING_DESIGN_MESSAGE`, `SHARING_DESIGN_MESSAGE`

### 0.10.20 RELEASE NOTES
Fixes:
- `product.editableAreaSizes` has higher priority than product.location.editableAreaUnits
- UI fixes

uploadImage.php:
- added support of jpeg orientation (an exif data), including any SVG software (e.g. AI)

saveDesign.php sample:
- implemented design resaving with the same id and title

### 0.10.19 RELEASE NOTES
Updates: 
- correct flip
- removed dpu warning for products without editable area or editable area units
- correct loading of raster product color
- updated SinkinSans font files
- UI fixes (thumbnails, designNotes)
- fonts configuration fix

Social Networks:
- output changed max output photo size to 1375x1375 

getQuote changes:
- added: `product.location.object.isUploaded` (boolean) - added only for images.

**uploadImage changes**:
- changed request param: `fileurl` - string encoded with `encodeURIComponent()` function.<br/>example of decoding: `urldecode($_POST['fileurl'])` 

### 0.10.18 RELEASE NOTES
- reverted 'Promise' polyfill

### 0.10.17 RELEASE NOTES
Updates:
- Updated UI look (both desktop and mobile)
- Added Snapping for objects
- UI updates: shared url copy to clipboard, basic email validator
- fixing small issues

API changes:
- added: config.options.enableSnapGuides - enable objects snapping (default value - false)

### 0.10.16 RELEASE NOTES
Updates:
- Text styles fixes

### 0.10.15 RELEASE NOTES
Updates:
- UI fixes for social networks tab

### 0.10.14 RELEASE NOTES
Updates:
- improved stability
- UI fixes
- improved selected color in CP
- fixed disappeared mask in IE, proper minimal quontity calculation
- highly improved pantones colorpicker

API changes:
save design service:
added properties (for consistency):
- data.product.productColors (array of objects) - added only for m-color images (2+ colors) (was present for m-color images (1 color))
- data.product.color (string) - added only for m-color images (1 color) (was present on image-per-color products)
- data.product.colorName (string)- added only for m-color images (1 color) (was present on image-per-color products)

pantones configuration changes (full description - LAJS/TASK743):
added:
- product.pantones.useForDecoration (bool, default false) - show pantones for text, one-color and m-color graphics
- product.pantones.useForProduct (bool, default false) - show pantones for product colorizing (note: only for m-color products)

renamed & changed:
- product.colorizableElements.showPantones -> hidePantones (note: default - false)
- graphic.colorizableElements.showPantones -> hidePantones (the same)

### 0.10.13 RELEASE NOTES
API changes:
getQuote changes:
- added: data.colorsNum - number of unique colors on all locations
- added: data.isFullColor - bool to indicate full colors at least on one location
- changed: data.colors - also included dummy colors (graphics.colors as number, e.g. "colors": "7") - same as locations and object colors count logic

Updates:
- simplified setting custom translation
- low default DPI to avoid raster images warnings
- UI updates: css, mobile view, new fonts

### 0.10.12 RELEASE NOTES

Changes:
unproportional resize available by default for all editable objects

Updates:
Resizable products hotfix (changing sizes)
Load design with proper font rendering

### 0.10.11 RELEASE NOTES

Updates:
improved MS Edge compatibility

### 0.10.10 RELEASE NOTES

Features:
translation added: see LA.js laTranslation.coreTranslation and laTranslation.uiTranslation

UI updates:
browser alerts replaced with bootsrap alerts
added load design preloader

Other: servises completely refactored (API not changed)

### 0.10.6 RELEASE NOTES

API changes:
getQuote update:
optional data (only if product has proper design area sizes configration):
data.locations[].designedArea
data.locations[].designedAreaRect
data.locations[].designedHeight
data.locations[].designedArea
data.locations[].objects[].designedArea

data.product.productColors[].name - color name (before - colorizable area name)


UI updates:
new form - edit image colors(combined with gallery, also removed text/graphic color picker from bottom menu)
enabled social networks galleries and names numbers for mobile view
social networks gallery usability updates

other:
new fonts

fixes:
small fixes, images optimization: ignore Illustrator extra data, proper editable area export to Illustrator CS6+

### 0.10.5 RELEASE NOTES
package structure change:
- separated LiveArt init() to LA.config.js
feature:
- added config.options.fitProductImage: false (if true - fit product image and mask into canvas keeping proportion)

UI updates, new fonts, optimization

### 0.10.4 RELEASE NOTES
features:
- pantones color tab (setup: FJS/TASK87 msg#18)

API update:
- GetQuote request POST var changes (legacy preserved, LAJS/TASK516 msg#23)

responsive UI updates, ruler rendering updates, improved products/graphics search,
  new fonts, compatible with inkscape 0.47, render product description as html, other small fixes

Pantones configuration (FJS/TASK87 msg#18)
added options:
- config.colors.pantones_url - optional string -  url to the pantones colors json (same format as colors.json)
- product.colorizableElements.showPantones - optional boolean (default false) - show pantones colors
- graphic.colorizableElements.showPantones - the same

### 0.10.3 RELEASE NOTES
Fixes designs created in v0.10.0 
(no saved quantity for products.sizes.length == 0; as result - broken load/order)

### 0.10.2 RELEASE NOTES
Added resizable canvas for responsive
Configuration:
1. in LA.js: change laOptions.dimensions: 
2. in variables.config.less: change @canvasWidth and @canvasHeight, recompile css
for end-user:
- follow /Release/setup/README.txt instruction

Changes:
- no dedicated css for horizontal layout (aka landscape iPhone)
- if container 900 > width > 587 : 
-- canvas.width = 100%
-- before: 587px (const)

### 0.10.1 RELEASE NOTES
- UI fixes, sizes on UI fixes (both zero sizes product and multiple sizes product)

### 0.10.0 RELEASE NOTES
LiveArt Container is responsive with more usable edit panels now. 
Responsive notes:
- Default dimensions: 900px * 650px
- Adopted width dimensions: 587px;
- Responsive width range: 355-587px;
- Adopted height dimensions: 620px and 420px (for default width only)
- Special adopted states:
	- iPhone 6 plus landscape
	- iPhone 6 landscape
	- iPhone 5 landscape
