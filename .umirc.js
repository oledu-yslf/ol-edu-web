// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          immer: true,
          hmr: true,
        },
        dynamicImport: true,
        title: 'ol-edu-web',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    "/api": {
      "target": "http://39.107.41.56:8005/",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
};

