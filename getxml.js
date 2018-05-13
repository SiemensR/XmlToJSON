const fs = require('fs');
const download = require('download');

// download funcion for xml
download('https://nebido.com/sitemap.xml', 'dist').then(() => {
    console.log('done!');
});
