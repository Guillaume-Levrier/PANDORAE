const selectTheme = (themeName) => {
  window.electron.send("theme", { type: "set", theme: themeName });
  window.electron.sendSync("keyManager", {
    user: "NA",
    service: "theme",
    value: themeName,
    type: "setPassword",
  });
};

const requestTheme = () => {
  window.electron.send("theme", { type: "read" });
};

ipcRenderer.on("themeContent", (event, theme) => loadTheme(theme));

const loadTheme = (theme) => {
  switch (theme.script) {
    case "normal":
      normalCore();
      break;

    case "vega":
      vega();
      break;

    case "blood-dragon":
      bloodDragon();

      break;

    default:
      break;
  }

  setTimeout(() => {
    // Give the process enough time to create the relevant DOM elements
    Array.from(document.getElementsByClassName("themeCustom")).forEach((d) => {
      if (document.getElementById(d.id)) {
        Object.assign(document.getElementById(d.id).style, theme[d.id]);
      }
    });

    if (document.getElementById("coreCanvas") != null) {
      Object.assign(
        document.getElementById("coreCanvas").style,
        theme.coreCanvas
      );
    }

    if (theme["theme-background"] != null) {
      document.getElementById("screenMachine").src = theme["theme-background"];
    }

    if (theme["theme-mask"] != null) {
      document.getElementById("mask").src = theme["theme-mask"];
    }

    coreDefW = theme.coreDefW;
    coreDefH = theme.coreDefH;
    fullscreenable = theme.fullscreenable;
  }, 100);
};

// ========= THEMES =======

let screenZoomToggle = false;

const zoomThemeScreen = (theme) => {
  if (screenZoomToggle) {
    d3.select("body")
      .transition()
      .duration(2000)
      .style("transform", "scale(1,1)");
    document.getElementById("screenMachine").play();
    screenZoomToggle = false;
  } else {
    if (theme.hasOwnProperty("zoom")) {
      d3.select("body").style(
        "transform-origin",
        theme.zoom["transform-origin"]
      );
      d3.select("body")
        .transition()
        .duration(2000)
        .style("transform", theme.zoom["transform"]);
      document.getElementById("screenMachine").pause();
      screenZoomToggle = true;
    } else {
      field.value = "this theme doesn't support zooming";
    }
  }
};
