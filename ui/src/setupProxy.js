const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            secure: false,
            logLevel: "debug"
        })
    );

    app.use(
        '/actuator',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            secure: false,
            logLevel: "debug"
        })
    );

    app.use(
        '/login',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            secure: false,
            logLevel: "debug"
        })
    );

    app.use(
        '/logout',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            secure: false,
            logLevel: "debug"
        })
    );
};
