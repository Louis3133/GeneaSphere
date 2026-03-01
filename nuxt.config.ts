import "./lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
  ],
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  colorMode: {
    dataValue: "theme",
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
});
