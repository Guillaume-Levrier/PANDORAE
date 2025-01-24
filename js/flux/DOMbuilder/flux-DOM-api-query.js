import { fluxSwitch } from "../fluxswitch";
import { fluxButtonClicked } from "../actionbuttons";
import { genHr } from "./flux-DOM-common";

import { buildBnFsolrArguments } from "../sources/webArchives/archivesinternet";
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

  const sectionTitle = document.createElement("div");
  sectionTitle.innerHTML = `<h4>Retrieve datasets from ${sectionData.target.toUpperCase()}</h4>`;
  tabSection.append(sectionTitle);

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `${queryPrompt} Click on the button to submit the request.`;
  sectionDescription.style.paddingBottom = "1rem";
  const descHelp = document.createElement("div");
  descHelp.style.display = "none";
  descHelp.append(sectionDescription);

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    helper.style.marginBottom = "1rem";
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    descHelp.append(helper);
  }

  if (descHelp.children.length > 0) {
    // if there is either description or helper, add the descHelp box

    const toggleHelp = document.createElement("span"); // the descHelp box appears when a ? button is clicked
    toggleHelp.innerHTML = `<i style='cursor: pointer;font-size:1rem;padding-left:0.5rem;' class='material-icons'>help_outline</i>`;
    toggleHelp.addEventListener("click", () => {
      switch (descHelp.style.display) {
        case "block":
          descHelp.style.display = "none";
          break;

        case "none":
          descHelp.style.display = "block";
          break;

        default:
          break;
      }
    });

    sectionTitle.style =
      "font-size:14px; text-transform: capitalize;display:flex;flex-direction: row;align-items: center;";
    sectionTitle.append(toggleHelp);
    tabSection.append(descHelp);
  }

  // select config file if applicable
  console.log(tabData);

  var config;

  if (tabData.relevantServicesConfig.length > 0) {
    const targetSelection = document.createElement("div");
    targetSelection.className = "fluxTargetSelection";
    const label = document.createElement("label");
    label.innerText = "Select target for request: ";
    label.for = tabData.id + "target-selection";

    const select = document.createElement("select");
    select.id = tabData.id + "target-selection";

    const optionMap = {};

    tabData.relevantServicesConfig.forEach((service, i) => {
      const option = document.createElement("option");

      const name = service.serviceConfig["account name"];
      option.value = name;
      option.innerText = name;

      optionMap[name] = service.serviceConfig;

      if (i === 0) {
        config = service.serviceConfig;
      }
      select.append(option);
    });

    select.addEventListener("change", () => {
      config = optionMap[select.value];
      if (functionArguments.length > 0) {
        buildAdditionalArguments(config, sectionData, tabSection);
      }
    });

    targetSelection.append(label, select);
    tabSection.append(targetSelection);
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
    sectionData.function.args.config = config;
    console.log(sectionData.function.name);
    console.log(sectionData.function.args);
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
    buildAdditionalArguments(config, sectionData, tabSection);
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

const buildAdditionalArguments = (config, sectionData, sectionDiv) => {
  switch (sectionData.key) {
    case "bnf-solr":
      buildBnFsolrArguments(config, sectionData, sectionDiv);
      break;

    case "nos deputes":
      buildNosDeputesArguments(config, sectionData, sectionDiv);
      break;

    default:
      break;
  }
};

export { addLocalFileSection, addAPIquerySection, displayInErrorDiv };
