import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    env: {
      browser:true,
      es2021:true
    },
    extends: [
      "eslint:recommended",
      "standard"
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType:"module"
    },
    rules: {
      "indent":["error",2],
      "linebreal-style":["error","unix"],
      "quotes":["error","double"],
      "semi": ["error", "always"]
    }
  }
];
