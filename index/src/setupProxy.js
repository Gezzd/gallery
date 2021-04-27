const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware("/api", {
      target: "http://127.0.0.1/",
      pathRewrite: { '^/api': '' },
      changeOrigin: true  // 如果接口跨域，需要进行这个参数配置,
      // secure: false,       // 设置支持https协议的代理
    })
  );
  app.use(
    proxy.createProxyMiddleware("/fans/**", {
      target: "https://easy-mock.com/mock/5c0f31837214cf627b8d43f0/",
      changeOrigin: true
    })
  );
};