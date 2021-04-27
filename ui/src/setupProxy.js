const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            onProxyRes: function (proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            }
        })
    );

    app.use(
        '/actuator',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })
    );

    app.use(
        '/login',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })
    );

    app.use(
        '/logout',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true
        })
    );
};
