/* eslint-env node */

// Built-ins
import path from "path";

// webpack-specific
import AssetsWebpackPlugin from "assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export const mode = process.env.NODE_ENV === "production" ? "production" : "development";
export const src = (...args) => path.resolve(process.cwd(), "src", ...args);
export const dist = (...args) => path.resolve(process.cwd(), "dist", ...args);
export const isProd = mode === "production";
export const assetsPluginInstance = new AssetsWebpackPlugin({
  filename: "assets.json",
  path: dist("server"),
  update: true,
  fileTypes: ["css", "js"]
});

export const commonConfig = {
  mode,
  devtool: isProd ? "hidden-source-map" : "source-map",
  stats: {
    exclude: /\.map$/i,
    excludeAssets: /\.map$/i,
    excludeModules: /\.map$/i,
    builtAt: false,
    children: false,
    modules: false
  },
};
