import withNuxt from "./.nuxt/eslint.config.mjs";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import eslintParserVue from "vue-eslint-parser";

export default withNuxt(
  eslintPluginPrettierRecommended,
  {
    extends: [eslintPluginBetterTailwindcss.configs.recommended],
    languageOptions: {
      parser: eslintParserVue,
    },
    files: ["**/*.vue"],
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": "off", // conflicts with / covered by prettier-plugin-classnames
      "better-tailwindcss/enforce-consistent-class-order": "off", // conflicts with / covered by prettier-plugin-tailwindcss
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/assets/css/main.css",
      },
    },
  },
  {
    rules: {
      "prettier/prettier": "warn",
      "vue/component-name-in-template-casing": [
        "warn",
        "PascalCase",
        {
          registeredComponentsOnly: false,
        },
      ],
    },
  },
);
