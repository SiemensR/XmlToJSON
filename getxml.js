// npm dependencies for xml and filesystem
const fs = require('fs');
const download = require('download');
const x2j = require('xml2js');
//Here is the source url for the xml file; function will download the xml, if it still does not exist
download('https://nebido.com/sitemap.xml', 'dist').then(() => {
  console.log('done!');
});
// xml will be saved in the folder dist
var sInputFile = "dist/sitemap.xml"
//starting of xml to json parser
var p = new x2j.Parser();
var sXMLData = fs.readFileSync(sInputFile, 'utf8');
p.parseString(sXMLData, function( err, result ) {
  var s = JSON.stringify( result, undefined, 3 );
// console.log( "Result" + "\n", s, "\n" ); --> uncommit it, if you wanna see the result in console
// create new json file with all contents from xml
  fs.writeFile('urlList.json',s, function (err) {
    if (err)
    return console.log(err);
    console.log('Successfully wrote file urlList.json!');
  });
});
