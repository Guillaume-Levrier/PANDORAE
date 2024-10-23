// These functions create the necessary HTML elements for each available cascade option.
//
// All the necessary information needs to be passed in the tabadata argument, which is defined as
// below. That object is there only as a descriptive model, it is never called.

import { CM } from "../../locales/locales";
import { userData } from "../userdata";
import { addAPIquerySection, addLocalFileSection } from "./flux-DOM-api-query";
import {
  addDatasetDisplaySection,
  addWarningDisclaimer,
} from "./flux-DOM-common";
import {
  addServiceCredentials,
  addUserField,
  newServiceFormBuilder,
  saveUserConfigs,
} from "./flux-DOM-user";

// A tab is only created when it is first called.
var previousTab = false;
const removePreviousTab = () => (previousTab ? previousTab.remove() : false);

const createCascadeTab = (tabData) => {
  removePreviousTab();

  // main container element
  const tab = document.createElement("div");
  tab.className = "fluxTabs";
  tab.id = tabData.id;
  previousTab = tab;
  //tab.style.display = "none";

  // title DOM element
  const title = document.createElement("div");
  title.className = "flux-title";
  title.innerText = tabData.title;

  // main description DOM element
  const description = document.createElement("div");
  description.className = "flux-description";
  description.innerHTML = tabData.description;

  tab.append(title, description);

  if (tabData.id === "user") {
    // add already registered data

    //prepopulate Zotero tab if it exists or fill it if it doesn't

    tabData.sections.forEach((section) => {
      if (section.data.name === "zotero") {
        if (userData.distantServices.hasOwnProperty("zotero")) {
          section.data.fields = userData.distantServices.zotero;
        } else {
          section.data.fields = { library: [], apikey: "" };
        }
      }
    });

    for (const service in userData.localServices) {
      const s = userData.localServices[service];
      tabData.sections.push({
        type: "addServiceCredentials",
        data: {
          name: service,
          description: CM.flux.serviceModels[service].description,
          fields: s,
          proximity: "distant",
        },
      });
    }

    // add new service button & save config button
    tabData.sections.push(
      {
        type: "newServiceForm",
      },
      {
        type: "saveUserConfigs",
      }
    );
  }

  // if this is a tab that lets one display data
  if (tabData.hasOwnProperty("sections")) {
    tabData.sections.forEach((section) => {
      switch (section.type) {
        case "warningDisclaimer":
          addWarningDisclaimer(tabData, section.data, tab);
          break;

        case "addServiceCredentials":
          addServiceCredentials(tabData, section.data, tab);
          break;

        case "personalInformation":
          addUserField(tabData, section.data, tab);
          break;

        case "tabDatasets":
          addDatasetDisplaySection(tabData, section.data, tab);
          break;

        case "loadLocalFlatFile":
          addLocalFileSection(tabData, section.data, tab);
          break;

        case "APIquery":
          addAPIquerySection(tabData, section.data, tab);
          break;

        case "saveUserConfigs":
          saveUserConfigs(tabData, section.data, tab);
          break;

        case "newServiceForm":
          newServiceFormBuilder(tab);

          break;

        default:
          break;
      }
    });
  }
  // Append section div to flux document body
  document.body.append(tab);

  // hide cascade graph & interface
  document.getElementById("flux-manager").style.display = "none";
  document.getElementById("selectCascade").style.display = "none";
};

export { createCascadeTab };