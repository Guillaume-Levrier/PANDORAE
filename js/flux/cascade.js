import * as d3 from "d3";
import { addHop, drawFlux } from "./tracegraph";
import { buttonList, fluxSwitch } from "./buttons";
import { userData } from "./userdata";

const createCascadeSelectors = (availableCategories) => {
  const selectCascadeDiv = document.createElement("div");
  selectCascadeDiv.id = "selectCascade";

  const fieldSet = document.createElement("fieldSet");
  fieldSet.style = "border:0px";

  const currentSelection = {};

  const addCascadeCategory = (category) => {
    currentSelection[category] = false;

    const categoryDiv = document.createElement("div");

    const categoryInput = document.createElement("input");
    categoryInput.type = "radio";
    //categoryInput.id = `${category}Select`;
    categoryInput.name = "categorySelector";
    categoryInput.checked = false;

    const categoryLabel = document.createElement("label");
    categoryLabel.for = category;
    categoryLabel.style = "text-transform: capitalize;";
    categoryLabel.innerText = category;

    categoryInput.addEventListener("change", () => {
      for (const cat in currentSelection) {
        currentSelection[cat] = 0;
      }
      currentSelection[category] = true;

      updateCascade(currentSelection);
    });

    categoryDiv.append(categoryInput, categoryLabel);

    fieldSet.append(categoryDiv);
  };

  availableCategories.forEach((d) => addCascadeCategory(d));

  selectCascadeDiv.append(fieldSet);

  document.body.append(selectCascadeDiv);
};

const svg = d3.select("svg");

let traces = [];

var availability;

function updateCascade(selections) {
  traces = [];
  document.getElementById("cascade").innerHTML = "";

  addHop(["USER", "STANDARDIZE"], traces);

  //if (availability.dnslist.zotero.valid) {

  // zotero is always accessible, even if not connected
  // so as to give access to system.
  // in the future, pandorae will be able to connect to
  // local instance of zotero
  addHop(["STANDARDIZE", "ZOTERO", "SYSTEM"], traces);
  //}

  if (selections) {
    Object.values(availability.dnslist).forEach((d) => {
      if (d.valid) {
        // Checkbox switch

        //Hops switch
        switch (d.name) {
          case "Gallica":
            if (selections.libraries) {
              addHop(["GALLICA", "ZOTERO"], traces);
            }
            break;
          case "Scopus":
            if (
              selections.scientometrics &&
              userData.distantServices.hasOwnProperty("scopus")
            ) {
              addHop(["USER", "SCOPUS", "STANDARDIZE"], traces);
            }
            break;

          case "Web Of Science":
            if (
              selections.scientometrics &
              userData.distantServices.hasOwnProperty("web of science")
            ) {
              addHop(["USER", "WEBㅤOFㅤSCIENCE", "STANDARDIZE"], traces);
            }
            break;
          /* 
          case "BIORXIV":
            if (selections.scientometrics) {
              addHop(["BIORXIV", "STANDARDIZE"], traces);
            }
            break;

          case "Clinical Trials":
            if (selections.clinicalTrialsSelect) {
              addHop(["CLINICAL TRIALS", "SYSTEM"], traces);
            }
            break;

          case "Regards Citoyens":
            if (selections.parliaments) {
              addHop(["REGARDS CITOYENS", "STANDARDIZE"], traces);
            }
            break; */

          case "ISTEX":
            if (selections.scientometrics) {
              addHop(["ISTEX", "STANDARDIZE"], traces);
            }
            break;

          case "Dimensions":
            if (
              selections.scientometrics &&
              userData.distantServices.hasOwnProperty("dimensions")
            ) {
              addHop(["USER", "DIMENSIONS", "STANDARDIZE"], traces);
            }
            break;

          /* case "PPS":
            if (selections.scientometrics) {
              addHop(["PPS", "STANDARDIZE"], traces);
              window.electron
                .invoke("getPPSMaturity")
                .then((time) => updatePPSDate(time));
            }
            break; */

          default:
            break;
        }
      }
    });

    /* if (selections.twitterSelect) {
    addHop(["USER", "TWITTER", "SYSTEM"]);
  }
    */
    if (selections.hyphe) {
      addHop(["HYPHE", "SYSTEM"], traces);
    }

    if (selections.local) {
      for (const service in availability.dnsLocalServiceList) {
        switch (availability.dnsLocalServiceList[service].type) {
          case "BNF-SOLR":
            const serv = service.toUpperCase().replace(" ", "-");

            addHop([serv, "ZOTERO"], traces);
            break;
        }
      }
    }
  }

  drawFlux(svg, traces, false, true);

  buttonList.forEach((but) => {
    const buttonDOM = document.getElementById(but.id);
    if (buttonDOM) {
      var clickable = 1;
      buttonDOM.addEventListener("click", (e) => {
        if (clickable) {
          fluxSwitch(e, but);
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
    }
  });
}

const localServicePreviewer = document.createElement("div");

const retrieveAvailableServices = () =>
  window.electron.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);

    const availableCategories = new Set();

    Object.values(availability.dnslist).forEach((service) => {
      if (service.valid) {
        switch (service.name) {
          case "Dimensions":
          case "Web Of Science":
          case "BIORXIV":
          case "Scopus":
          case "ISTEX":
            availableCategories.add("scientometrics");
            break;

          case "Regards Citoyens":
            availableCategories.add("parliaments");
            break;

          case "Gallica":
            availableCategories.add("libraries");
            break;

          default:
            break;
        }
      }
    });

    availableCategories.add("hyphe");

    createCascadeSelectors([...availableCategories]);

    const buttonList = [];

    const table = document.createElement("UL");

    localServicePreviewer.append(table);

    for (const service in availability.dnsLocalServiceList) {
      if (availability.dnsLocalServiceList[service].type.valid) {
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
                          fluxSwitch(e, but);

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
    }
    updateCascade();
  });

export { retrieveAvailableServices, localServicePreviewer };
