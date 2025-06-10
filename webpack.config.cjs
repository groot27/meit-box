const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const dotenv = require("dotenv");
const { ModuleFederationPlugin } = require("webpack").container;

const env = dotenv.config({
  path: path.resolve(__dirname, ".env.stage"),
}).parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});
module.exports = {
  entry: { remote: "./src/main.ts" },
  mode: "development",
  output: {
    publicPath: "http://localhost:5001/",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // alias @ to /src
      "@/components": path.resolve(__dirname, "src/components"),
      "@/api": path.resolve(__dirname, "src/api"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
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
          transpileOnly: true, // optional: faster, but no type checking
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        type: "asset/resource", // emits a file and returns a URL
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin(envKeys),
    new ModuleFederationPlugin({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./CalendarDaily": "./src/components/calendar/Calendar.vue",
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
    port: 5001,
    static: path.join(__dirname, "dist"),
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
