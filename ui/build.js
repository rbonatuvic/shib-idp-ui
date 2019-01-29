const fs = require('fs-extra');

fs.ensureDir('./dist/unsecured').then(function () {
    try {
        fs.copySync('./src/error.html', './dist/unsecured/error.html')
        console.log('copy error page success!')
    } catch (err) {
        console.error(err)
    }

    try {
        fs.copySync('./node_modules/font-awesome/fonts', './dist/unsecured');
        console.log('copy fonts success!')
    } catch (err) {
        console.log(err);
    }
});



