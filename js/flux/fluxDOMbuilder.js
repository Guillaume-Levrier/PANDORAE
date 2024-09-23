import { fluxButtonClicked } from "./actionbuttons";
import { fluxSwitch } from "./buttons";
import { datasetDisplay } from "./dataset";
import { serviceTester } from "./service-tester";
import { userData } from "./userdata";

const userDataPath = window.electron.userDataPath;

// These functions create the necessary HTML elements for each available cascade option.
//
// All the necessary information needs to be passed in the tabadata argument, which is defined as
// below. That object is there only as a descriptive model, it is never called.

// ========

// The <hr> DOM element stands for "horizontal rule" which aims to be a thematic break between two
// sections of an HTML document. This function yields such an element, which helps us give more
// structure to our FLUX tab.
const genHr = () => document.createElement("hr");

// ======= addDatasetDisplaySection =======
//

const addDatasetDisplaySection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Display available ${sectionData.id.toUpperCase()} datasets</h4>
  Click on the button below to load available datasets from the ${sectionData.id.toUpperCase()} data table.`;

  // div to show the loaded datasets
  const datasetDisplayDiv = document.createElement("div");
  datasetDisplayDiv.className = "fluxDatasetList";
  datasetDisplayDiv.id = sectionData.id + "-datasetDisplay";

  // button to click to load the relevant datasets
  const displayAvailableDatasetsButton = document.createElement("button");
  displayAvailableDatasetsButton.type = "submit";
  displayAvailableDatasetsButton.className = "flux-button";
  displayAvailableDatasetsButton.innerText = "Display available datasets";

  const datasetDetailDiv = document.createElement("div");
  datasetDetailDiv.className = "datasetDetail";
  datasetDetailDiv.id = sectionData.id + "-datasetDetail";

  // When the "display available datasets" button is clicked
  displayAvailableDatasetsButton.addEventListener("click", () => {
    // Indicate:
    // - in which DOM elements the list of datasets must be shown (display)
    // - where the detail of each dataset can be shown on click (detail)
    // - in which table (FLUX, STANDARD or TYPE) the data is
    // - what is the source/category of data we are looking for

    const data = {
      table: sectionData.table,
      source: sectionData.source,
      display: datasetDisplayDiv.id,
      detail: datasetDetailDiv.id,
    };

    // Pass these informations to the datasetDisplay function
    datasetDisplay(data);

    // Update the button to show that the datasets have been presented to them
    fluxButtonClicked(displayAvailableDatasetsButton, true, "Datasets loaded");
  });

  tabSection.append(
    sectionDescription,
    datasetDetailDiv,
    datasetDisplayDiv,
    displayAvailableDatasetsButton
  );

  tab.append(genHr(), tabSection);
};

const addLocalFileSection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Load a local flat dataset to ${tabData.title}</h4>
  Click on the button below to load a file from your computer to the PANDORAE ${tabData.title} database. It accepts ${sectionData.accept} files.`;
  sectionDescription.style.paddingBottom = "1rem";
  const loadFlatFileInput = document.createElement("input");
  loadFlatFileInput.type = "file";
  loadFlatFileInput.className = "fluxInput";
  loadFlatFileInput.accept = sectionData.accept;

  const loadFlatFileButton = document.createElement("button");
  loadFlatFileButton.type = "submit";
  loadFlatFileButton.className = "flux-button";
  loadFlatFileButton.innerText = `Upload local dataset to ${tabData.title}`;

  tabSection.append(sectionDescription, loadFlatFileInput, loadFlatFileButton);

  tab.append(genHr(), tabSection);
};

const addAPIquerySection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const queryPrompt = sectionData.queryField
    ? "Fill in the query in the field below."
    : "";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Retrieve datasets from ${sectionData.target.toUpperCase()}</h4>
  ${queryPrompt} Click on the button to submit the request.`;
  sectionDescription.style.paddingBottom = "1rem";

  // button to click to load the relevant datasets
  const sendAPIQueryButton = document.createElement("button");
  sendAPIQueryButton.type = "submit";
  sendAPIQueryButton.className = "flux-button";
  sendAPIQueryButton.innerText =
    "Load data from " + sectionData.target.toUpperCase();

  const queryResultDiv = document.createElement("div");
  queryResultDiv.className = "fluxQueryResult";
  queryResultDiv.style.display = "none";

  const functionArgs = sectionData.function.args;
  functionArgs.resultDiv = queryResultDiv;

  tabSection.append(sectionDescription);

  const queryField = document.createElement("input");

  if (sectionData.queryField) {
    queryField.type = "text";
    queryField.className = "fluxInput";
    tabSection.append(queryField);
  }

  sendAPIQueryButton.addEventListener("click", () => {
    fluxButtonClicked(sendAPIQueryButton, sectionData.function.aftermath);
    if (sectionData.queryField) {
      sectionData.function.args.query = queryField.value;
    }
    fluxSwitch(sectionData.function.name, sectionData.function.args);
  });

  tabSection.append(sendAPIQueryButton, queryResultDiv);

  tab.append(genHr(), tabSection);
};

const addUserField = (tabData, sectionData, tab) => {
  console.log(userData);
  const userFieldContainer = document.createElement("div");
  userFieldContainer.className = "credential";

  const label = document.createElement("label");
  label.innerText = `${sectionData.name} : `;
  label.style.width = "100px";

  const field = document.createElement("input");
  field.className = "fluxInput";
  field.style = "font-size;12px;width:400px;";
  field.type = "text";
  field.placeholder = "Enter your " + sectionData.name;
  field.spellcheck = false;
  field.id = sectionData.id + "Input";

  if (userData.hasOwnProperty(sectionData.id)) {
    field.value = userData[sectionData.id];
  }

  userFieldContainer.append(label, field);

  tab.append(userFieldContainer);
};

const addServiceCredentials = (tabData, sectionData, tab) => {
  const serviceContainer = document.createElement("div");
  serviceContainer.style = "padding:0.5rem";
  const title = document.createElement("div");
  title.innerText = sectionData.name;
  title.style = "font-size:14px; text-transform: capitalize;";

  const description = document.createElement("div");
  description.innerHTML = sectionData.description;
  description.style = "text-align:justify;padding:1rem;";
  serviceContainer.append(title, description);

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    console.log(sectionData.helper.url);
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    serviceContainer.append(helper);
  }

  if (sectionData.hasOwnProperty("libraries")) {
    let count = 1;
    const librarylist = document.createElement("div");
    librarylist.style = "margin-top:1rem";

    const addLib = document.createElement("div");
    addLib.className = "flux-button";
    addLib.style = "width:100px;margin:0.5rem;margin-left:150px;";
    addLib.innerText = "Add a new library";

    const addLibraryField = (libID) => {
      const libraryfieldContainer = document.createElement("div");
      libraryfieldContainer.style = `display: flex;
    width: 220px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;padding:0.3rem;`;

      const label = document.createElement("label");
      label.innerText = `Library ${count} : `;

      const libraryfield = document.createElement("input");
      libraryfield.className = "zoteroLibraryField fluxInput";
      libraryfield.type = "text";
      libraryfield.placeholder = "0000000"; //5361175
      libraryfield.spellcheck = false;
      libraryfield.id = libID ? libID : sectionData.name + count + "-Library";
      libraryfield.value = libID ? libID : "";

      libraryfieldContainer.append(label, libraryfield);
      librarylist.append(libraryfieldContainer);
      count++;
    };

    addLib.addEventListener("click", () => addLibraryField());

    if (userData.distantServices.hasOwnProperty("zotero")) {
      if (userData.distantServices.zotero.libraries.length > 0) {
        userData.distantServices.zotero.libraries.forEach((d) =>
          addLibraryField(d)
        );
      }
    } else {
      addLibraryField();
    }

    serviceContainer.append(librarylist, addLib);
  }

  if (sectionData.hasOwnProperty("apikey")&&userData.distantServices.hasOwnProperty(sectionData.name)) {
    const label = document.createElement("label");
    label.innerText = `API key : `;
    const apikeyfield = document.createElement("input");
    apikeyfield.style = "font-size;12px;width:auto;margin-top:15px;";
    apikeyfield.type = "password";
    apikeyfield.className = "fluxInput";
    apikeyfield.placeholder =
      "Paste your " + sectionData.name + " API key here";
    apikeyfield.spellcheck = false;
    apikeyfield.id = sectionData.name + "-APIkey";
    const apikey = userData.distantServices[sectionData.name].apikey;
    apikeyfield.value = apikey ? apikey : 0;
    serviceContainer.append(label, apikeyfield);
  }

  // service tester
  // button to click to load the relevant datasets
  const serviceTesterButton = document.createElement("button");
  serviceTesterButton.type = "submit";
  serviceTesterButton.className = "flux-button";
  serviceTesterButton.innerText = "Test service connectivity";

  serviceTesterButton.addEventListener("click", () => {
    fluxButtonClicked(
      serviceTesterButton,
      sectionData.aftermath,
      "Requests sent"
    );
    serviceTester(sectionData.name, userData.distantServices[sectionData.name]);
  });

  serviceContainer.append(serviceTesterButton);

  tab.append(genHr(), serviceContainer);
};

const addWarningDisclaimer = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "warning-flux";

  const warningText = document.createElement("div");
  warningText.innerText = sectionData.content;

  tabSection.append(warningText);
  if (sectionData.hasOwnProperty("func")) {
    const button = document.createElement("div");
    button.innerText = sectionData.func.text;
    button.className = "buttonDisclaimer";
    button.addEventListener("click", () => {
      switch (sectionData.func.id) {
        case "openUserDirectory":
          window.electron.send(
            "openPath",
            userDataPath + "/PANDORAE-DATA/userID/"
          );

          break;

        default:
          break;
      }
    });
    tabSection.append(button);
  }

  tab.append(tabSection);
};

// A tab is only created when it is first called.
var previousTab = false;
var removePreviousTab = () => (previousTab ? previousTab.remove() : false);

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
