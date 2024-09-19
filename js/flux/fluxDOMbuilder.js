import { fluxButtonClicked } from "./actionbuttons";
import { fluxSwitch } from "./buttons";
import { datasetDisplay } from "./dataset";
import { serviceTester } from "./service-tester";
import { generateLocalServiceConfig } from "./sources/BNF/archivesinternet";
import { userData } from "./userdata";

const userDataPath = window.electron.userDataPath;

// These functions create the necessary HTML elements for each available cascade option.
//
// All the necessary information needs to be passed in the tabadata argument, which is defined as
// below. That object is there only as a descriptive model, it is never called.

const genHr = () => document.createElement("hr");

const addDatasetDisplaySection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Display available ${sectionData.id} datasets</h4>
  Click on the button below to load available datasets from the ${sectionData.id} data table.`;

  // div to show the loaded datasets
  const datasetDisplayDiv = document.createElement("div");
  datasetDisplayDiv.className = "fluxDatasetList";
  datasetDisplayDiv.id = tabData.id + "-datasetDisplay";

  // button to click to load the relevant datasets
  const displayAvailableDatasetsButton = document.createElement("button");
  displayAvailableDatasetsButton.type = "submit";
  displayAvailableDatasetsButton.className = "flux-button";
  displayAvailableDatasetsButton.innerText = "Display available datasets";

  const datasetDetailDiv = document.createElement("div");
  datasetDetailDiv.className = "datasetDetail";

  displayAvailableDatasetsButton.addEventListener("click", () => {
    fluxButtonClicked(displayAvailableDatasetsButton, true, "Datasets loaded");
    datasetDisplay(datasetDisplayDiv, sectionData.id, datasetDetailDiv);
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

  const queryPrompt = sectionData.query
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

  sendAPIQueryButton.addEventListener("click", () => {
    fluxButtonClicked(sendAPIQueryButton, sectionData.function.disable);
    fluxSwitch(sectionData.function.name, sectionData.function.args);
  });

  tabSection.append(sectionDescription, sendAPIQueryButton, queryResultDiv);

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
  serviceContainer.append(title);

  if (sectionData.hasOwnProperty("libraries")) {
    let count = 1;
    const librarylist = document.createElement("div");
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

      const addLib = document.createElement("i");
      addLib.style.fontSize = "10px";
      addLib.style.cursor = "pointer";
      addLib.innerText = "add_circle";
      addLib.className = "material-icons";
      addLib.addEventListener("click", () => {
        addLibraryField();
        addLib.remove();
      });

      libraryfieldContainer.append(label, libraryfield, addLib);
      librarylist.append(libraryfieldContainer);
      count++;
    };
    if (userData.distantServices.hasOwnProperty("zotero")) {
      if (userData.distantServices.zotero.libraries.length > 0) {
        userData.distantServices.zotero.libraries.forEach((d) =>
          addLibraryField(d)
        );
      }
    } else {
      addLibraryField();
    }
    serviceContainer.append(librarylist);
  }

  if (sectionData.hasOwnProperty("apikey")) {
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
    fluxButtonClicked(serviceTesterButton, true, "Requests sent");
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

  // Append section div to flux document body
  document.body.append(tab);

  // hide cascade graph & interface
  document.getElementById("flux-manager").style.display = "none";
  document.getElementById("selectCascade").style.display = "none";
};

export { createCascadeTab };

/* 
<div id="user" style="display:none;" class="fluxTabs">
  <span class="flux-title">USER</span><br><br>
  <span
    style="font-family: sans-serif;color:white;background-color: red;padding: 5px;text-align: center;display: flex;">The
    data entered below is
    unencrypted so as to make this application portable. Click on
    the button below to access the file and delete it manually if you are on a
    public computer.</span><br>
  <button type="submit" id="access-user-id" class="flux-button">Access User ID
    file</button>
  <!-- <button type="submit" id="change-user-id" class="flux-button">Change user folder location</button> -->
  <br>

  <br>
  <hr>
  <br>

  <span class="credential"><b>User information</b></span><br><br>
  <form id="user-data-form" autocomplete="off">
    <div class="credential"> Name:<br> <input class="fluxInput"
        spellcheck="false" id="userNameInput" type="text"
        placeholder="Enter your name"><br><br></div>
    <div class="credential"> Email:<br> <input class="fluxInput"
        spellcheck="false" id="userMailInput" type="text"
        placeholder="Enter your email"><br><br></div>
    <div class="credential"> Zotero group id:<br> <input class="fluxInput"
        spellcheck="false" id="zoterouserinput" type="text"
        placeholder="Enter your zotero group code"><br><br></div>
    <button type="submit" id="user-button" class="flux-button">Update User
      Credentials</button><br>

    <hr>
    <br>
    <span class="credential"><b>API Keys</b></span><br><br>
    <div class="credential APIcred">
      <i title="Click this button to check your API credentials status"
        class="material-icons validation"
        id="zoteroAPIValidation">help_outline</i> Zotero API key: <input
        class="fluxInput" spellcheck="false" id="zoterokeyinput" type="password"
        value=""><i title="Click this button to update your credentials"
        class="material-icons updateCredentials" id="Zotero">cached</i> <br><br>
    </div>
    <div class="credential APIcred">
      <i title="Click this button to check your API credentials status"
        class="material-icons validation" id="scopusValidation">help_outline</i>
      Scopus API key: <input class="fluxInput" spellcheck="false"
        id="scopuskeyinput" type="password" value=""><i
        title="Click this button to update your credentials"
        class="material-icons updateCredentials" id="Scopus">cached</i><br><br>
    </div>

    <div class="credential APIcred">
      <i title="Click this button to check your API credentials status"
        class="material-icons validation" id="wosValidation">help_outline</i>
      WoS API key: <input class="fluxInput" spellcheck="false" id="woskeyinput"
        type="password" value=""><i
        title="Click this button to update your credentials"
        class="material-icons updateCredentials"
        id="WebOfScience">cached</i><br><br>
    </div>

    <br>
    <hr>
    <br>

    <span class="credential"><b>Local services</b></span><br><br>
    <div class="credential">
      <div id="localservices-basic-previewer" style="position:relative;">
      </div>
    </div>

    <span class="credential">Use the fields below to add new local
      services.</span><br><br>

    <div class="credential">

      <input style="width:20%;display:none" class="fluxInput" spellcheck="false"
        id="newServiceName" type="text" placeholder="Service name">
      &nbsp;<input style="width:20%;display:none" class="fluxInput"
        spellcheck="false" id="newServiceLocation" type="text"
        placeholder="IP:PORT">
      &nbsp;
      &nbsp;<input style="width:20%;display:none" class="fluxInput"
        spellcheck="false" id="newArkViewer" type="text"
        placeholder="Ark Viewer Address"> &nbsp;

      <select style="width:20%;" class="fluxInput" spellcheck="false"
        id="newServiceType">
        <option value=""></option>
        <option value="BNF-SOLR">BNF-SOLR</option>
      </select> &nbsp;
      <button type="submit" id="new-service-button" class="flux-button">Add
        Service</button>
      <br><br>
      <br>
      <br>
      <br>



    </div>
  </form>
</div> */
