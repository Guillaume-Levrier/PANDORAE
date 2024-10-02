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

    console.log(availability)

     Object.values(availability.dnsLocalServiceList).forEach((service) => {
      if (service.valid) {
        switch (service.name) {
            
        default:
           availableCategories.add("local");
            break;
        }
      }
    });
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

    updateCascade();
  });

export { retrieveAvailableServices, localServicePreviewer,availability };
