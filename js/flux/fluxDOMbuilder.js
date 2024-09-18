import { fluxButtonClicked } from "./actionbuttons";
import { fluxSwitch } from "./buttons";
import { datasetDisplay } from "./dataset";

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
  description.innerText = tabData.description;

  tab.append(title, description);

  // if this is a tab that lets one display data

  tabData.sections.forEach((section) => {
    switch (section.type) {
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
<div id="zotero" style="display:none;" class="fluxTabs">
  <span class="flux-title">ZOTERO</span><br><br>
  This tab lets you send a collection of documents retrieved by PANDORÆ to
  Zotero, and lets import a Zotero collection (regardless
  of its origin) to PANDORÆ.
  <br><br>
  <hr><br>
  <form id="zotero-export-form" autocomplete="off">
    This button lets you display the datasets in <strong>PANDORÆ's memory on
      your local device</strong> and upload them to Zotero.<br><br>
    <button type="submit" class="flux-button" id="cslcolret">Display available
      csljson files</button><br>
    <div id="selectedCollection">
      <div id="csljson-dataset-preview"></div>
      <div id="csljson-dataset-buttons" style="display:none;">
        <input class="fluxInput" spellcheck="false" class="sendToZotero"
          id="zoteroCollecName" type="text" placeholder="Enter collection name">

        <button type="submit" class="flux-button sendToZotero"
          id="zoteroCollecBuild">Create a new Zotero
          Collection</button>
      </div>
    </div>
    <div id="userCsljsonCollections"></div>
  </form>
  <br>
  <hr><br>
  <form id="zotero-import-form" autocomplete="off"></form>
  This button lets you display the collections of documents on <strong>your
    online Zotero library</strong> and download them to your system.<br><br>
  <button type="submit" class="flux-button" id="zotcolret">Display online
    library collections</button><br><br>
  <!-- <button type="submit" class="flux-button" id="zotcolret" onclick="zoteroLocalRetriever();return false">Display local zotero instance collections</button><br><br> -->
  <span id="zoteroImportInstruction" style="display:none;">Select the Zotero
    collections you want to import to PANDORÆ </span><br><br>

  <div id="zoteroResults" style="display:none;">
    <div id="userZoteroCollections" style="flex:auto"></div>

  </div>
  <br><br><br>
  <input class="fluxInput" spellcheck="false" id="zoteroImportName"
    style="display:none;" type="text" placeholder="Enter import name">
  <button type="submit" class="flux-button" style="display:none;"
    id="zotitret">Import selected collections into
    system</button><br>
  </form>
</div>

*/

/* <!-- SYSTEM TAB -->
<div id="system" style="display:none;" class="fluxTabs">
  <span class="flux-title">SYSTEM</span><br><br>
  Datasets listed in SYSTEM are available locally and ready to be exported to
  one of PANDORÆ's visualisation tools.
  <button type="submit" class="flux-button" id="systemList">Display available
    datasets</button><br>
  <div id="problematics"></div>
  <div style="display:flex;padding: 5px;margin: 5px;">
    <div id="system-dataset-preview" style="flex:auto"></div>
    <div id="system-dataset-buttons" style="display:none">
      <button type="submit" class="flux-button" id="downloadData">Download
        dataset</button>
      <button type="submit" class="flux-button" id="showConsole">Display in
        Console</button>
      <button type="submit" class="flux-button" id="checkPPS">Check on
        PPS</button>
      <br>
      <br><br>Export dataset to :<br>
      <input class='sysDestCheck' value='chronotype' name='chronotype'
        type='checkbox' /><label>chronotype</label><br>
      <input class='sysDestCheck' value='geotype' name='geotype'
        type='checkbox' /><label>geotype</label><br>
      <input class='sysDestCheck' value='anthropotype' name='anthropotype'
        type='checkbox' /><label>anthropotype</label><br>
      <input class='sysDestCheck' value='webArchive' name='webArchive'
        type='checkbox' /><label>webArchive</label><br>
      <input class='sysDestCheck' value='hyphotype' name='hyphotype'
        type='checkbox' /><label>hyphotype</label><br>
      <input class='sysDestCheck' value='fieldotype' name='fieldotype'
        type='checkbox' /><label>fieldotype</label><br>
      <input class='sysDestCheck' value='regards' name='regards'
        type='checkbox' /><label>regards</label><br>
      <input class='sysDestCheck' value='gazouillotype' name='gazouillotype'
        type='checkbox' /><label>gazouillotype</label><br>
      <input class='sysDestCheck' value='slider' name='slider'
        type='checkbox' /><label>slider</label><br>
      <input class="fluxInput" spellcheck="false" id="systemToType" type="text"
        placeholder="Enter a dataset name">
      <button type="submit" class="flux-button"
        id="systitret">Export</button><br>
    </div>
  </div>
  <div id="systemDatasetsList"></div>
  <br>
  <hr>
  <br>Import local dataset :<br>
  <input class="fluxInput" id="localUploadPath" type="file"
    accept=".json" /><br><br>
  <button type="submit" class="flux-button" id="load-local">Upload local dataset
    to SYSTEM</button>

</div> */
