import { datasetDisplay } from "../dataset";
import { fluxButtonClicked } from "../actionbuttons";
import { genDate } from "../userdata";
import { powerValve } from "../powervalve";
// ========

// The <hr> DOM element stands for "horizontal rule" which aims to be a thematic break between two
// sections of an HTML document. This function yields such an element, which helps us give more
// structure to our FLUX tab.

const userDataPath = window.electron.userDataPath;

const genHr = () => document.createElement("hr");

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

const basicQueryResultDiv = (queryData, resultNum) => {
  // query data is an object with both the query string to the service
  // and the result div

  console.log(queryData, resultNum);

  // fill in results
  queryData.resultDiv.innerHTML = `
        <strong>Query: ${queryData.query}</strong><br>
        Expected results at request time: ${resultNum}<br>
        Query date: ${genDate()}<br><br>`;

  // display result div
  queryData.resultDiv.style.display = "block";

  // display fill query div
};

const addFullQueryButton = (data, buttonText, powerAction, powerArg) => {
  const fullQueryButton = document.createElement("button");
  fullQueryButton.type = "submit";
  fullQueryButton.className = "flux-button";
  fullQueryButton.innerText = buttonText;
  fullQueryButton.addEventListener("click", () =>
    powerValve(powerAction, powerArg)
  );
  data.resultDiv.append(fullQueryButton);
};

export {
  addDatasetDisplaySection,
  addWarningDisclaimer,
  genHr,
  basicQueryResultDiv,
  addFullQueryButton,
};
