# i18n-json-plugins

This project can support improving i18n environment as DX.

## Features

- ✅ automatically adding a new key from your code to i18n json files
- 👷‍♂️ automatically translating via DeepL from one lang to all langs
- 👷‍♂️ automatically removing an empty field from i18n json

## Supporting Langs / Libs

|               | Status |
| ------------- | ------ |
| typescript    | ✅     |
| javascript    | 👷     |
| react-i18next | ✅     |
| vue           | 👷     |
| webpack       | ✅     |
| vite          | 👷     |

## Usage

webpack.config.js

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: "@hiroppy/i18n-json-webpack-plugin/lib/loader",
        options: {
          langs: ["ja", "en"],
          basePath: "./public/static/locales",
        },
      },
    ],
  },
};
```
