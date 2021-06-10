const fs = require('fs-extra');

fs.ensureDir('./build/unsecured').then(function () {
    try {
        fs.copySync('./node_modules/@fortawesome/fontawesome-free/webfonts', './build/unsecured');
        console.log('copy fonts success!')
    } catch (err) {
        console.log(err);
    }
});
