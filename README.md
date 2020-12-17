## LiveArt HTML5 1.0.0 LTS
LiveArt HTML5 is an HTML5 product design component, suitable for any web2print tasks including signs, uniforms, apparel or sticker decoration. Its 1.0.0 release is based on new SVG engine contrary to 0.10.X version.

Please see detailed [release notes](https://liveart.uservoice.com/knowledgebase/articles/1839169-liveart-v1-0-0) that describe differences and new features for the 1.0.0. The current will be also designated as an LTS (Long Term Support) version for the next years.

Primary integration reference:
- [API Reference](http://liveart.github.io/slate/#introduction)
- [JSON Schemas](SCHEMAS.md)
- [Knowledge Base](https://liveart.uservoice.com/knowledgebase)
- [Online Demo](https://demo.liveartdesigner.com/release/LAJS100/iframe.html)

## Getting Started

### Prerequisites
Despite LiveArt is a fully client-side component, it is provided with basic backend to save designs and prepare production output. Certain pre-requisites are required to run the designer locally or on the server.
1. [PHP 5.5+](http://php.net/downloads.php)
    - Needed to run the server and the sample php services
    - Ensure it is added to PATH
        - Run cmd `php -version` to check manually
    - _What if I ignore the installation?_
        - The component will not launch as it requires sample PHP services to function. Please refer to [v1.0.0 migration guide](https://liveart.uservoice.com/knowledgebase/articles/1839187) for more information.
2. [Inkscape](https://inkscape.org) 0.92.3 - 0.92.5
    - Needed to proceed with the order output generation
    - Ensure it is added to PATH
        - Run cmd `inkscape --version` to check manually
    - _What if I ignore the installation or install a different version?_
        - No PNG/PDF production output will be generated 
3. [Ghostscript](https://www.ghostscript.com/download.html)
    - Needed to concatenate single-file PDF if multiple locations were designed
    - Ensure it is added to PATH
        - Run cmd `gs --version` to check manually
    - _What if ignore the installation?_
        - No PDF output for multiple location products 
            - (unless configured `merged: false` in `services/config/output.json`)

#### Use bundled utility to verify requirements

1. [Run locally](#running-locally) or [on the server](#running-on-the-server)
3. Open [`http://localhost:9000/requirements-check/client/index.html`](http://localhost:9000/requirements-check/client/index.html) in the browser
4. Verify the requirements are met
5. Remove `requirements-check` directory (__!__) before upload to production

### Running locally
1. Open cmd/terminal in the directory with LiveArt
2. Run
    ```bash
    php -S localhost:9000
    ```
3. Open `http://localhost:9000/iframe.html` in the browser

### Running on the server
1. Map the LiveArt folder to the desired endpoint.
2. Ensure JSON and WOFF files are served as static. Failing to configure this step may result in malfunctioning designer.
3. Scripts should have permission to write files into folders `/files` and `/files/uploads` (for sample save design, upload image, and make order)