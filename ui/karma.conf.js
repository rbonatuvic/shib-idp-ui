// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const path = require('path');

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-spec-reporter'),
            require('@angular/cli/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true,
            skipFilesWithNoCoverage: false,
            thresholds: {
                emitWarning: false,
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
        reporters: ['spec', 'coverage-istanbul'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS_custom'],
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                flags: ['--disk-cache=false']
            }
        },
        singleRun: true
    });
};
