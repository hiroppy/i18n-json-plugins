"use strict";

const I18nJsonPlugin = require("@hiroppy/i18n-json-webpack-plugin");

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.tsx?/,
      loader: require.resolve("@hiroppy/i18n-json-webpack-plugin/lib/loader"),
      options: {
        langs: ["ja", "en"],
        basePath: "./public/static/locales",
      },
    });

    // config.plugins.push(new I18nJsonPlugin());

    return config;
  },
};
