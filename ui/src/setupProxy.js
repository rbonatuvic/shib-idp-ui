const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {

    const port = 10101;

    app.use(
        '/api',
        createProxyMiddleware({
            target: `http://localhost:${port}`,
            changeOrigin: true,
            onProxyRes: function (proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            }
        })
    );

    app.use(
        '/actuator',
        createProxyMiddleware({
            target: `http://localhost:${port}`,
            changeOrigin: true
        })
    );

    app.use(
        '/login',
        createProxyMiddleware({
            target: `http://localhost:${port}`,
            changeOrigin: true
        })
    );

    app.use(
        '/logout',
        createProxyMiddleware({
            target: `http://localhost:${port}`,
            changeOrigin: true
        })
    );
};
