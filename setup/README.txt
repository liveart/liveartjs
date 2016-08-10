Change Canvas size:

A. LA.config.js
1. open LA.config.js in root folder, search for 'laOptions'
2. change laOptions.dimensions to desired size in format [width, height]

B. re-build styles
1. install nodejs from https://nodejs.org/en/download/
2. install grunt from http://gruntjs.com/getting-started
3. in command line run "npm install"
4. open assets/css/variables.config.less
5. change @canvasWidth and @canvasHeight to desired values
6. in command line run "grunt rebuildcss"
7. files are rebuild and re-placed in package

well done - let's try new canvas size