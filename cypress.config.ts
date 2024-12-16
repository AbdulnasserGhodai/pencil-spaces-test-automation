const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );
  return config;
}

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  e2e: {
    specPattern: "**/*.feature",
    defaultCommandTimeout: 50000,
    pageLoadTimeout: 100000,
    hideXHRInCommandLog: false,
    setupNodeEvents,
  },
  env: {
    APP_URL: "https://spaces.pencilapp.com",
    EMAIL: "",
    PASSWORD: "",
  },
});
