
const download = require('download');
const x2j = require('xml2js');
const puppeteer = require('puppeteer');
var fs = require('fs');

var step2 = false;
var step3 = false;

function First() {
if (!fs.existsSync('./dist/sitemap.xml')) {
  // Here starts the save of xml to json
  download('https://www.thrombosisadviser.com/sitemap.xml', 'dist').then(() => {
    console.log('Sitemap successfully downloaded!');
  });
step2 = true;
};
};

function Second() {
if (step2 == true) {
  // xml will be saved in the folder dist
  var sInputFile = "./dist/sitemap.xml"
  //starting of xml to json parser
  var p = new x2j.Parser();
  var sXMLData = fs.readFileSync(sInputFile, 'utf8');
  p.parseString(sXMLData, function( err, result ) {
    var s = JSON.stringify( result, undefined, 3 );
  // console.log( "Result" + "\n", s, "\n" ); --> uncommit it, if you wanna see the result in console
  // create new json file with all contents from xml
    fs.writeFile('./dist/urlList.json',s, function (err) {
      if (err)
      return console.log(err);
      console.log('\n Successfully wrote file urlList.json!');
    });
  });
  // end xml to json
} else {
  console.log("could not load sitemap or it already exists");
};
};

function Third() {
  fs.readFile('./dist/urlList.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);

    //const fs = require('file-system');

    const devices = [
      { name: 'Small-Desktop-1', width: 1280, height: 800 },
    ];
    // for (i = 0; i < obj.length; i++) { //da es zu viele Links gibt, wird node abstürzen :D
    for (i = 0; i < 5; i++) {


      // Enter URL which will be captured
      const urls = [
        //  { name: 'Facebook', link: obj[3].loc},
        { name: i, link: obj.urlset['url'][i]['loc'][0] }];
        async function setViewports(device, url) {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.waitFor(300);
          await page.goto(url.link);
    //      await page.click(a,left); //click nicht fertig! sollte aber theoretisch funktionieren

          // Setting-up viewports
          await page.setViewport({
            width : device.width,
            height: device.height
          });
          await getScreenshots(device, url, page, browser);
        }


        // Directory Create if not exist
        async function getScreenshots(device, url, page, browser) {
          var new_location = `./screenshots/` + device.name+`(`+ device.width+`-`+device.height +`)`;
          fs.mkdir(new_location, function (err) {
            if (err) { //console.log(err)
            }
          });

          await page.screenshot({
            path: new_location +`/`+ url.name + `.png`,
            fullPage: true
          });
          browser.close();
        }

        async function getUrlAndResolutions(devices, urls) {
          for (let device of devices) {
            for (let url of urls) {
              await setViewports(device, url);
            }
          }
        }
        getUrlAndResolutions(devices, urls);
      }
    });
  };


First();
setTimeout(Second, 1000);
setTimeout(Third, 2000);
