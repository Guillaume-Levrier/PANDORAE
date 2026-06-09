module.exports = {
  packagerConfig: {
    name: "PANDORÆ",
    asar: true,
    icon: "icons/PANDORAE",
  },
  rebuildConfig: {
    force: true,
  },
  makers: [
    /* {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {
        // background: "./assets/dmg-background.png",
        format: "ULFO",
      },
    }, */
    /* {
      name: "@electron-forge/maker-squirrel",
      config: {},
    }, */
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "win32"],
      config: { icon: "/icons/PANDORAE" },
    },
    // use  npm run make -- --platform=win32 --arch=x64 to compile for windows
    /* {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    }, */
  ],

  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "Guillaume-Levrier",
          name: "PANDORÆ",
        },
        prerelease: true,
      },
    },
  ],

  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        devContentSecurityPolicy:
          "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
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
              name: "audio",
              html: "./html/audio.html",
              js: "./js/audio.js",
              preload: {
                js: "./js/preload-audio.js",
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
  ],
};
