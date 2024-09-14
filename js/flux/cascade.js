const svg = d3.select("svg");

var availability;

const selections = {
  scientometricsSelect: false,
  digitalLibrariesSelect: false,
  clinicalTrialsSelect: false,
  parliamentsSelect: false,
  twitterSelect: false,
  hypheSelect: false,
  localSelect: false,
};

function configureCascade() {
  for (const theme in selections) {
    const select = document.getElementById(theme);
    select.addEventListener("change", () => {
      selections[theme] = select.checked;
      document.getElementById("cascade").innerHTML = "";

      updateCascade();
    });
  }
}

configureCascade();

function updateCascade() {
  traces = [];
  document.getElementById("cascade").innerHTML = "";

  availability.dnslist.forEach((d) => {
    if (d.valid) {
      switch (d.name) {
        case "Gallica":
          if (selections.digitalLibrariesSelect) {
            addHop(["OPEN", "GALLICA", "ZOTERO"]);
          }
          break;
        case "Scopus":
          if (selections.scientometricsSelect) {
            addHop(["USER", "SCOPUS", "CSL-JSON"]);
          }
          break;

        case "Web Of Science":
          if (selections.scientometricsSelect) {
            addHop(["USER", "WEBㅤOFㅤSCIENCE", "CSL-JSON"]);
          }
          break;

        case "BIORXIV":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "BIORXIV", "ZOTERO"]);
          }
          break;

        case "Zotero":
          addHop(["USER", "CSL-JSON", "MANUAL", "ZOTERO", "SYSTEM"]);
          addHop(["CSL-JSON", "ZOTERO"]);
          break;

        case "Clinical Trials":
          if (selections.clinicalTrialsSelect) {
            addHop(["OPEN", "CLINICALㅤTRIALS", "SYSTEM"]);
          }
          break;

        case "Regards Citoyens":
          if (selections.parliamentsSelect) {
            addHop(["OPEN", "REGARDSCITOYENS", "CSL-JSON"]);
          }
          break;

        case "ISTEX":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "ISTEX", "CSL-JSON"]);
          }
          break;

        case "Dimensions":
          if (selections.scientometricsSelect) {
            addHop(["USER", "DIMENSIONS", "CSL-JSON"]);
          }
          break;

        case "PPS":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "PPS", "CSL-JSON"]);
            ipcRenderer
              .invoke("getPPSMaturity")
              .then((time) => updatePPSDate(time));
          }
          break;

        default:
          break;
      }
    }
  });

  if (selections.twitterSelect) {
    addHop(["USER", "TWITTER", "SYSTEM"]);
  }
  if (selections.hypheSelect) {
    addHop(["OPEN", "HYPHE", "SYSTEM"]);
  }

  if (selections.localSelect) {
    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          const serv = service.toUpperCase().replace(" ", "-");

          addHop([serv, "ZOTERO"]);
          break;
      }
    }
  }

  drawFlux(svg, traces, false, true);

  buttonList.forEach((but) => {
    var clickable = 1;
    document.getElementById(but.id).addEventListener("click", (e) => {
      if (clickable) {
        funcSwitch(e, but);
        clickable = 0;
        setTimeout(() => (clickable = 1), 5000);
      } else {
        window.electron.send(
          "console-logs",
          `Cooldown not finished for action ${but.id}.`
        );
      }
      e.preventDefault();
      return false;
    });
  });
}
