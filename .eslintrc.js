module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      extends: "plugin:@typescript-eslint/recommended",
      files: ["*.ts", "*.tsx"],
    },
    {
      env: { node: true },
      files: ["*.js"],
    },
  ],
};
