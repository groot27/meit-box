const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const dotenv = require("dotenv");
const { ModuleFederationPlugin } = require("webpack").container;

// Load .env.stage
const env = dotenv.config({
  path: path.resolve(__dirname, ".env.stage"),
}).parsed;

const envKeys = Object.keys(env || {}).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// Base shared config
const createBaseConfig = ({
  name,
  entryName,
  entryPath,
  exposeName,
  exposePath,
  remoteFileName,
  port,
}) => ({
  name,
  entry: { [entryName]: entryPath },
  mode: "development",
  output: {
    publicPath: `http://localhost:${port}/`,
    path: path.resolve(__dirname, `dist/${name}`),
    filename: `${entryName}.js`,
    clean: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/api": path.resolve(__dirname, "src/api"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/i18n": path.resolve(__dirname, "src/i18n"),
      "@/pages": path.resolve(__dirname, "src/pages"),
    },
    extensions: [".ts", ".js", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: entryName,
      filename: remoteFileName,
      exposes: {
        [exposeName]: exposePath,
      },
      shared: {
        vue: {
          singleton: true,
          eager: true,
        },
      },
    }),
  ],
  devServer: {
    port,
    static: path.join(__dirname, "dist"),
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});

module.exports = [
  createBaseConfig({
    name: "remoteMonthlyView",
    entryName: "remoteMonthlyView",
    entryPath: "./src/remotesEntries/monthlyViewEntry.ts",
    exposeName: "./RemoteMonthlyView",
    exposePath: "./src/components/calendar/Calendar.vue",
    remoteFileName: "remoteMonthlyView.js",
    port: 5001,
  }),
  createBaseConfig({
    name: "remoteOrders",
    entryName: "remoteOrders",
    entryPath: "./src/remotesEntries/ordersEntry.ts",
    exposeName: "./RemoteOrders",
    exposePath: "./src/components/orders/OrderList.vue",
    remoteFileName: "remoteOrders.js",
    port: 5002,
  }),
  createBaseConfig({
    name: "remoteDashboard",
    entryName: "remoteDashboard",
    entryPath: "./src/remotesEntries/dashboardEntry.ts",
    exposeName: "./RemoteDashboard",
    exposePath: "./src/components/dashboard/Dashboard.vue",
    remoteFileName: "remoteDashboard.js",
    port: 5003,
  }),
];
