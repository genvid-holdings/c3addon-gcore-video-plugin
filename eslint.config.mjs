import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores(["src/ts-defs/**"]),
  {
    files: ["**/*.ts"],
    extends: ["js/recommended"],
    plugins: { js },
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  {
    files: ["**/tsconfig.json"],
    language: "json/jsonc",
    plugins: { json },
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
  tseslint.configs.recommended,
]);