const webpack = require("webpack");
const path = require("path");

// Styleguidist (v11.2.0) doesn't display components with create ract app 5
// This webpackConfig is a workaround for that
// For more information see https://github.com/styleguidist/react-styleguidist/issues/1910#issuecomment-1013763698

const webpackConfig = {
  module: {
    rules: [
      {
        test: /.\.md$/, // look for .md files in component folder
        type: "javascript/auto", // Tell webpack to interpret the result from examples-loader as JavaScript
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    // Rewrites the absolute paths to those two files into relative paths
    new webpack.NormalModuleReplacementPlugin(
      /react-styleguidist\/lib\/loaders\/utils\/client\/requireInRuntime$/,
      "react-styleguidist/lib/loaders/utils/client/requireInRuntime"
    ),
    new webpack.NormalModuleReplacementPlugin(
      /react-styleguidist\/lib\/loaders\/utils\/client\/evalInContext$/,
      "react-styleguidist/lib/loaders/utils/client/evalInContext"
    ),
  ],
};

module.exports = {
  webpackConfig,
  components: "src/components/**/*.{jsx,tsx}",
  propsParser: require("react-docgen-typescript").parse,
};
