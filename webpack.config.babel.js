/* eslint-env node */

// Built-ins
import { resolve } from "path";

// webpack-specific
import WebpackNodeExternals from "webpack-node-externals";
import AssetsWebpackPlugin from "assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export const mode = process.env.NODE_ENV === "production" ? "production" : "development";
export const src = (...args) => resolve(process.cwd(), "src", ...args);
export const dist = (...args) => resolve(process.cwd(), "dist", ...args);
export const isProd = mode === "production";

// webpack configs
module.exports = [
  // Client
  {
    name: "client",
    entry: {
      home: src("client", "routes", "index.jsx")
    },
    output: {
      filename: isProd ? "js/[name].[chunkhash:8].js" : "js/[name].js",
      chunkFilename: isProd ? "js/[name].[chunkhash:8].js" : "js/[name].js",
      path: dist("client"),
      publicPath: "/"
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/i,
          exclude: /node_modules/i,
          use: [
            {
              loader: "babel-loader",
              options: {
                envName: "client"
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader"
          ]
        }
      ]
    },
    plugins: [
      new AssetsWebpackPlugin({
        filename: "assets.json",
        path: dist("server"),
        update: true,
        fileTypes: ["css", "js"]
      }),
      new MiniCssExtractPlugin({
        filename: `css/${isProd ? "[name].[contenthash:8].css" : "[name].css"}`,
        chunkFilename: `css/${isProd ? "[name].[contenthash:8].css" : "[name].css"}`
      })
    ],
    resolve: {
      alias: {
        "Components": src("client", "components"),
        "Layouts": src("client", "layouts"),
        "Styles": src("client", "styles")
      }
    },
    mode,
    devtool: "source-map",
    stats: {
      exclude: /\.map$/i,
      excludeAssets: /\.map$/i,
      excludeModules: /\.map$/i,
      builtAt: false,
      children: false,
      modules: false
    }
  },
  // Server
  {
    target: "node",
    name: "server",
    entry: {
      server: src("server", "index.js")
    },
    output: {
      filename: "index.js",
      path: dist("server")
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/i,
          exclude: /node_modules/i,
          use: [
            {
              loader: "babel-loader",
              options: {
                envName: "server"
              }
            }
          ]
        },
        {
          test: /\.(c|le)ss$/i,
          use: "null-loader"
        }
      ]
    },
    resolve: {
      alias: {
        "Components": src("client", "components"),
        "Layouts": src("client", "layouts"),
        "Styles": src("client", "styles"),
        "Helpers": src("server", "helpers"),
        "Data": src("server", "data")
      }
    },
    externals: [
      WebpackNodeExternals()
    ],
    mode,
    devtool: isProd ? "hidden-source-map" : "source-map",
    stats: {
      exclude: /\.map$/i,
      excludeAssets: /\.map$/i,
      excludeModules: /\.map$/i,
      builtAt: false,
      children: false,
      modules: false
    }
  }
];
