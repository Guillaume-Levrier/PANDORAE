import * as d3 from "d3";
import { addHop, drawFlux } from "./tracegraph";
import { buttonList, funcSwitch } from "./buttons";

const svg = d3.select("svg");

let traces = [];

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
            addHop(["OPEN", "GALLICA", "ZOTERO"], traces);
          }
          break;
        case "Scopus":
          if (selections.scientometricsSelect) {
            addHop(["USER", "SCOPUS", "CSL-JSON"], traces);
          }
          break;

        case "Web Of Science":
          if (selections.scientometricsSelect) {
            addHop(["USER", "WEBㅤOFㅤSCIENCE", "CSL-JSON"], traces);
          }
          break;

        case "BIORXIV":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "BIORXIV", "ZOTERO"], traces);
          }
          break;

        case "Zotero":
          addHop(["USER", "CSL-JSON", "MANUAL", "ZOTERO", "SYSTEM"], traces);
          addHop(["CSL-JSON", "ZOTERO"], traces);
          break;

        case "Clinical Trials":
          if (selections.clinicalTrialsSelect) {
            addHop(["OPEN", "CLINICALㅤTRIALS", "SYSTEM"], traces);
          }
          break;

        case "Regards Citoyens":
          if (selections.parliamentsSelect) {
            addHop(["OPEN", "REGARDSCITOYENS", "CSL-JSON"], traces);
          }
          break;

        case "ISTEX":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "ISTEX", "CSL-JSON"], traces);
          }
          break;

        case "Dimensions":
          if (selections.scientometricsSelect) {
            addHop(["USER", "DIMENSIONS", "CSL-JSON"], traces);
          }
          break;

        case "PPS":
          if (selections.scientometricsSelect) {
            addHop(["OPEN", "PPS", "CSL-JSON"], traces);
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

          addHop([serv, "ZOTERO"], traces);
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

const retrieveAvailableServices = () =>
  window.electron.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);
    updateCascade();

    const buttonList = [];

    const localServicePreviewer = document.getElementById(
      "localservices-basic-previewer"
    );

    const table = document.createElement("UL");

    localServicePreviewer.append(table);

    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          const serv = service.toUpperCase().replace(" ", "-");

          const serviceLine = document.createElement("li");
          serviceLine.style = "display:flex;justify-content: space-between;";
          const serviceName = document.createElement("div");
          serviceName.innerHTML = `- ${availability.dnsLocalServiceList[service].type} - ${service}`;
          const serviceRemove = document.createElement("div");
          serviceRemove.style = "font-weight:bold;";
          serviceRemove.innerText = "x";
          serviceRemove.addEventListener("click", () => {
            serviceLine.remove();
            removeLocalService(service);
          });
          serviceLine.append(serviceName, serviceRemove);

          table.append(serviceLine);

          const solrCont = document.createElement("div");

          solrCont.id = serv.toLowerCase();
          solrCont.style.display = "none";
          solrCont.className = "fluxTabs";

          const sourceRequest =
            "http://" +
            availability.dnsLocalServiceList[service].url +
            ":" +
            availability.dnsLocalServiceList[service].port +
            "/solr/admin/collections?action=LIST&wt=json";

          // The answer is in the array at r.collections

          var sourceSolrRadio = "";

          var coreSource; // In theory, there is only one core collection

          fetch(sourceRequest)
            .then((r) => r.json())
            .then((r) => {
              coreSource = r.collections[0];
              for (let i = 0; i < r.collections.length; i++) {
                const col = r.collections[i];
                let checked = i === 0 ? "checked" : "";

                sourceSolrRadio += `<div>
            <input type="radio" name="bnf-solr-radio-${serv}" class="bnf-solr-radio-${serv}" id="${col}"  ${checked}  />
            <label for="${col}">${col}</label>
          </div>`;
              }
            })
            .then(() => {
              const facetRequest =
                "http://" +
                availability.dnsLocalServiceList[service].url +
                ":" +
                availability.dnsLocalServiceList[service].port +
                "/solr/" +
                coreSource +
                "/select?q=*rows=0&facet=on&facet.field=collections";

              fetch(facetRequest)
                .then((facet) => facet.json())
                .then((facets) => {
                  console.log(facets);

                  const facetList =
                    facets.facet_counts.facet_fields.collections;

                  var facetCheckBox = "";

                  for (let i = 0; i < facetList.length; i++) {
                    const face = facetList[i];

                    if (typeof face === "string") {
                      let checked = i === 0 ? "checked" : "";

                      facetCheckBox += `<div>
            <input type="checkbox" name="bnf-solr-checkbox-${serv}" class="bnf-solr-checkbox-${serv}" id="${face}"  ${checked}  />
            <label for="${face}">${face}</label>
          </div>`;
                    }
                  }

                  solrCont.innerHTML = `<!-- BNF SOLR TAB -->     
          <span class="flux-title">${service.toUpperCase()}</span>
          <br><br>
          <form id="bnf-solr-form" autocomplete="off">Query:<br>
            <input class="fluxInput" spellcheck="false" id="bnf-solr-query-${serv}" type="text" value=""><br><br>
            From: <input type="date" id="bnf-solr-${serv}-date-from"> - To: <input type="date" id="bnf-solr-${serv}-date-to"><br>
            <br>Selected source:
            ${sourceSolrRadio}<br><br>
             <br>Select collection:
            ${facetCheckBox}<br><br>
            <button type="submit" class="flux-button" id="bnf-solr-basic-query-${serv}">Retrieve
              basic info</button>&nbsp;&nbsp;
            <div id="bnf-solr-basic-previewer-${serv}" style="position:relative;"></div><br><br>
            <button style="display: none;" type="submit" class="flux-button" id="bnf-solr-fullquery-${serv}">Submit Full Query</button>
            <br><br>
          </form>`;

                  document.body.append(solrCont);

                  buttonList.push({
                    id: "bnf-solr-basic-query-" + serv,
                    serv,
                    func: "queryBnFSolr",
                    args: availability.dnsLocalServiceList[service],
                  });

                  buttonList.push({
                    id: "bnf-solr-fullquery-" + serv,
                    serv,
                    func: "powerValve",
                    arg: "BNF-SOLR",
                  });

                  buttonList.forEach((but) => {
                    document
                      .getElementById(but.id)
                      .addEventListener("click", (e) => {
                        e.preventDefault();
                        funcSwitch(e, but);

                        return false;
                      });
                  });
                });
            });

          break;

        default:
          break;
      }
    }
  });

export { retrieveAvailableServices };
