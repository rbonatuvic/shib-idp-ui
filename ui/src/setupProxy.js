const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {

    const port = 8080;

    const context = process.env.PUBLIC_URL;
    const rewriteFn = function (path, req) {
        return path.replace(context, '');
    };

    app.use(
        `${context}/api`,
        createProxyMiddleware({
            target: `http://localhost:${port}${context}/`,
            changeOrigin: true,
            onProxyRes: function (proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            }
        })
    );

    app.use(
        `${context}/actuator`,
        createProxyMiddleware({
            target: `http://localhost:${port}${context}/`,
            changeOrigin: true
        })
    );

    app.use(
        `${context}/login`,
        createProxyMiddleware({
            target: `http://localhost:${port}${context}/`,
            changeOrigin: true
        })
    );

    app.use(
        `${context}/logout`,
        createProxyMiddleware({
            target: `http://localhost:${port}${context}/`,
            changeOrigin: true
        })
    );
};
