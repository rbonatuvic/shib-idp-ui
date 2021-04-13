// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const path = require('path');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-spec-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageReporter: {
            dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: false,
            thresholds: {
                emitWarning: true,
                global: {
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80
                },
                each: {
                    statements: 30,
                    branches: 30,
                    functions: 30,
                    lines: 30,
                    overrides: {}
                }
            }
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: ['spec', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: false,
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};
