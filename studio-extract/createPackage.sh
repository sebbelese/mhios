cd studio-javascript
npm install
cd src/utils
browserify reader.js -s readFromArchive -o studioreaderpack.js
mv studioreaderpack.js  ../../../../reader/static/js/
cd ../../..
