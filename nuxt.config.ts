import "./lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  },
});
