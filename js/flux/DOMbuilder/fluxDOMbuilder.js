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

  // If this is the user tab, then it needs to give relevant config options
  if (tabData.id === "user") {

 userData.distantServices.forEach(s=> {
      tabData.sections.push({
        type: "addServiceCredentials",
        data: {
          name: s.serviceType+" - "+s.serviceConfig["account name"],
          description: CM.flux.serviceModels[s.serviceType].description,
          helper: CM.flux.serviceModels[s.serviceType].helper,
          fields: s.serviceConfig,
          proximity: "distant",
        },
      });
    })


    userData.localServices.forEach(s=> {
      tabData.sections.push({
        type: "addServiceCredentials",
        data: {
          name: s.serviceType+" - "+s.serviceConfig["account name"],
          description: CM.flux.serviceModels[s.serviceType].description,
          helper: CM.flux.serviceModels[s.serviceType].helper,
          fields: s.serviceConfig,
          proximity: "local",
        },
      });
      })
  

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
  // If this is not the user tab, then we need to check whether this is a public endpoint
  // or something that needs configuration "file" (more like JSON object as userdata property).
  else{
    // To check whether there is config info, we start by normalizing both the tab ID
    // And the configs we have to see if we have any matches.

    const tabID = tabData.id;

    const services =[...userData.distantServices,...userData.localServices];
    
    const relevantServicesConfig=[];
    
    services.forEach(s=>{
      const serviceID = s.serviceType.toLowerCase().replaceAll(" ","-")
      if (serviceID===tabID){
        relevantServicesConfig.push(s)
      } 
    }  )

    // We then add the config to the tabData, which enables us to find
    // which endpoint to target and how
    tabData.relevantServicesConfig=relevantServicesConfig;

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
