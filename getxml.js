const fs = require('fs');
const download = require('download');
download('https://nebido.com/sitemap.xml', 'dist').then(() => {
    console.log('done!');
});
