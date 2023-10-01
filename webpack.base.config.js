const { rules } = require("eslint-config-next");
const { default: test } = require("node:test");

module: {
  rules: [
    {
      test: /\.s?css$/,
      exclude: [resolvePath("../src/styles")],
      use: [
        {
          loader: "css-loader",
          options: {
            localsConvention: "camelCase",
            modules: true,
          },
        },
        "sass-loader",
        "import-glob-loader",
      ],
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    },
  ];
}
