const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        devServer: {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":
              "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers":
              "X-Requested-With, content-type, Authorization",
          },
          stats: "verbose",
          hot: false,
          inline: false,
          client: {
            overlay: {
              errors: false,
              warnings: false,
            },
          },
        },
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              name: "main_window",
              html: "./html/index.html",
              js: "./js/index.js",
              preload: {
                js: "./js/preload-index.js",
              },
            },
            {
              name: "flux",
              html: "./html/flux.html",
              js: "./js/flux.js",
              preload: {
                js: "./js/preload-flux.js",
              },
            },
            {
              name: "chaeros",
              html: "./html/chaeros.html",
              js: "./js/chaeros.js",
              preload: {
                js: "./js/preload-chaeros.js",
              },
            },
            {
              name: "database_manager",
              html: "./html/database_manager.html",
              js: "./js/database_manager.js",
              preload: {
                js: "./js/preload-database_manager.js",
              },
            },
          ],
        },
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    /*
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
    */
  ],
};
