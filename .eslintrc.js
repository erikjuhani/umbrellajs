module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      extends: "plugin:@typescript-eslint/recommended",
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
          },
        ],
      },
      files: ["*.ts", "*.tsx"],
    },
    {
      env: { node: true },
      files: ["*.js"],
    },
  ],
};
