
const download = require('download');
const x2j = require('xml2js');
const puppeteer = require('puppeteer');
var fs = require('fs');

var step2 = false;
var step3 = false;

function First() {
  // Here starts the save of xml to json
  download('https://www.nebido.com/sitemap.xml', 'dist').then(() => {
    console.log('Sitemap successfully downloaded!');
  });
};

function Second() {
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
      console.log('\nSuccessfully wrote file urlList.json!');
    });
  });
  // end xml to json
};



function Third() {
  fs.readFile('./dist/urlList.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);

    //const fs = require('file-system');
    const cookie1 = {
      name: 'CC_HCP_Usertype',
      value: 'HCP',
      domain: 'www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: false,
      secure: false
    }
    const cookie2 = {
      name: 'nebido_com',
      value: 'R3NBSE3sIPx9vskF8h5wi0',
      domain: 'www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: true,
      secure: false
    }
    const cookie3 = {
      name: 'WHGCOOKIECONSENT',
      value: 'YTozOntzOjM6Imd0bSI7YjoxO3M6Mjoid3QiO2I6MTtzOjU6InNldEF0IjtpOjE1MjY3NTg4NTQ7fQ==:"anZzOXphZDBiek90NzVkWVdjUU1jMHlKaDJJS29lV3hBZXgwZkJRaDB1QVlQTmViaWRvQ29tQ1BpWVZUWFRPVnJZNURJcU9VQWtDUGlZVlRYVE9Wclk1RElxT1VBa2E6Mzp7czozOiJndG0iO2I6MTtzOjI6Ind0IjtiOjE7czo1OiJzZXRBdCI7aToxNTI2NzU4ODU0O30="',
      domain: '.www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: false,
      secure: false
    }
    const cookie4 = {
      name: '_ga',
      value: 'GA1.2.755296856.1526758334',
      domain: 'www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: false,
      secure: false
    }
    const cookie5 = {
      name: '_gid',
      value: 'GA1.2.755296856.1526758334',
      domain: 'www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: false,
      secure: false
    }
    const cookie6 = {
      name: '_gat_UA-84741036-17',
      value: '1',
      domain: 'www.nebido.com',
      // url: '',
      path: '/',
      httpOnly: false,
      secure: false
    }
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
          await page.setCookie(cookie1);
          await page.setCookie(cookie2);
          await page.setCookie(cookie3);
          await page.setCookie(cookie4);
          await page.setCookie(cookie5);
          await page.setCookie(cookie6);
          await page.waitFor(3000);
          await page.goto(url.link);
          // Setting-up viewports
          await page.setViewport({
            width : device.width,
            height: device.height
          });
    //      await this.page.waitFor(2000);
    //      await this.page.click('#cookie-bar .button-wrapper .cc-btn');
    //      await page.waitFor(300);
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
