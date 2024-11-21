import { fluxSwitch } from "../fluxswitch";
import { fluxButtonClicked } from "../actionbuttons";
import { genHr } from "./flux-DOM-common";

import { buildBnFsolrArguments } from "../sources/BNF/archivesinternet";
import { buildNosDeputesArguments } from "../sources/parlements/regardscitoyens";

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

  tabSection.append(sectionDescription);

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    helper.style.marginBottom = "1rem";
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    tabSection.append(helper);
  }

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

  const queryField = document.createElement("input");

  sendAPIQueryButton.addEventListener("click", () => {
    fluxButtonClicked(sendAPIQueryButton, sectionData.function.aftermath);
    if (sectionData.queryField) {
      sectionData.function.args.query = queryField.value;
    }
    fluxSwitch(sectionData.function.name, sectionData.function.args);
  });

  if (sectionData.queryField) {
    queryField.type = "text";
    queryField.className = "fluxInput";
    tabSection.append(queryField);

    if (sectionData.hasOwnProperty("placeholder")) {
      queryField.placeholder = sectionData.placeholder;
    }
  }

  tabSection.append(sendAPIQueryButton);

  const functionArguments = Object.values(sectionData.function.args);

  if (functionArguments.length > 0) {
    buildAdditionalArguments(sectionData, tabSection);
  }

  tabSection.append(queryResultDiv);

  const errorDiv = document.createElement("div");
  errorDiv.id = sectionData.target + "_error";
  errorDiv.className = "fluxErrorDiv";
  tabSection.append(errorDiv);

  tab.append(genHr(), tabSection);
};

const displayInErrorDiv = (text, target) =>
  (document.getElementById(target + "_error").innerText = text);

const buildAdditionalArguments = (data, sectionDiv) => {
  console.log(data, sectionDiv);

  switch (data.key) {
    case "bnf-solr":
      buildBnFsolrArguments(data, sectionDiv);

      break;

    case "nos deputes":
      buildNosDeputesArguments(data, sectionDiv);
      break;

    default:
      break;
  }
};





export { addLocalFileSection, addAPIquerySection, displayInErrorDiv };
