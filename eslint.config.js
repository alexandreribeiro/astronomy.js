import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    ignores: ["dist/*"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
