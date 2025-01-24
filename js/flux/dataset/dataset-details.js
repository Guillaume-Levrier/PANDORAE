//========== datasetDisplay ==========
import { CM } from "../../locales/locales";
import { powerValve } from "../powervalve";
import { fluxButtonClicked } from "../actionbuttons";
import { userData } from "../userdata";

//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).
//
// This function is a bit long, but does not get much from being more modularized.
//

const datasetDetail = (detailDiv, dataset, table) => {
  // This function provides info on a specific dataset

  //Make the div visible
  detailDiv.innerHTML = "";
  detailDiv.style.display = "flex";

  // The detail div contains two sub-divs:
  // 1. On the left pane, information on the dataset
  // 2. On the right pane, action panel (buttons) of things to do to that dataset

  const informationDiv = document.createElement("div");
  informationDiv.className = "datasetDetailInformationDiv";

  const actionDiv = document.createElement("div");
  actionDiv.className = "datasetDetailActionDiv";

  detailDiv.append(informationDiv, actionDiv);

  let size = 0;

  // Datasets can come in different formats and shapes
  // If the dataset is an array, its size is its length
  // If it's an object, its size is its number of properties
  //
  if (Array.isArray(dataset.data)) {
    size = dataset.data.length;
  } else if (typeof dataset.data === "object") {
    size = "";
    for (const key in dataset.data) {
      size += ` ${dataset.data[key].size} ${key} `;
    }
  }

  // 1. Building the left pane, the information div
  informationDiv.innerHTML = `<span style="font-weight:bold;"> ${dataset.name} </span>
  <br>Origin : ${dataset.source}
  <br>Total results : ${size} 
  <br>Upload date : ${dataset.date}
  <br>Unique ID : ${dataset.id}`;

  // 2. Building the right pane, the action div
  // Here come the most basic actions
  // *
  // *
  // 2.1 Download the selected dataset

  const downloadButton = genActionButton("Download dataset");

  downloadButton.addEventListener("click", () => {
    // Generate a name for the dataset
    const name = dataset.name + ".json";

    // Signal to the main process that we want this dataset saved
    // on the user's hard drive, which involves OS communication
    window.electron.send("saveDataset", {
      target: name,
      data: JSON.stringify(dataset, replacer),
    });

    // Signal to the user that their action has been taken into
    // account by changing the content of the button.
    fluxButtonClicked(downloadButton, true, "Dataset downloaded");
  });

  actionDiv.append(downloadButton);

  // 2.2 Delete the dataset from PANDORAE's internal database

  const deleteButton = genActionButton("Delete dataset");

  deleteButton.addEventListener("click", () => {
    detailDiv.innerHTML = "Dataset deleted";
    datasetRemove(table, dataset.id);
  });

  actionDiv.append(deleteButton);

  // That was easy.
  //
  // What comes below is the bespoke part for each
  // type of dataset that can be presented.

  try {
    // Here you will find a switch in a switch.
    // Branch 1 is the flux switch, that is data that has just been retrieved
    // then the deeper level is by data source
    // Branch 2 is standard table, it's already been CSL remapped for Zotero
    //
    //
    switch (table) {
      case "flux":
        switch (dataset.source) {
          case "istex":
          case "dimensions":
          case "webofscience":
          case "scopus":
          case "regards citoyens":
          case "web archive":
            // X.X Standardize to CSL
            const standardizeCSL = genActionButton("Standardize dataset");

            standardizeCSL.addEventListener("click", () => {
              powerValve("standardizeDataset", dataset);
              fluxButtonClicked(standardizeCSL, true, "Dataset standardized");
            });

            actionDiv.append(standardizeCSL);

            break;
        }
        break;

      case "standard":
        switch (dataset.source) {
          case "istex":
          case "dimensions":
          case "webofscience":
          case "scopus":
          case "regards citoyens":
          case "web archive":
            // send to zotero

            const sendToZotero = genActionButton("Upload to Zotero");
            sendToZotero.addEventListener("click", () => {
              const selectLibrary = (userData, dataset, button) => {
                // add a name field
                const nameField = document.createElement("input");
                nameField.type = "text";
                nameField.className = "fluxInput";
                nameField.placeholder = "Collection name";
                nameField.value = dataset.name;
                button.parentNode.append(nameField);

                userData.distantServices.zotero.library.forEach((id) => {
                  const url = `https://api.zotero.org/groups/${id}/collections?v=3&key=${userData.distantServices.zotero.apikey}`;
                  fetch(url)
                    .then((r) => r.json())
                    .then((r) => {
                      var name = "(empty library)";
                      if (r.length > 0) {
                        if (parseInt(id) === parseInt(r[0].library.id)) {
                          name = r[0].library.name;
                        }
                      }
                      const sendToCollectionButton = genActionButton(
                        "Upload to " + name
                      );

                      sendToCollectionButton.addEventListener("click", () => {
                        powerValve("zoteroCollectionBuilder", {
                          name: nameField.value,
                          id,
                          dataset,
                        });
                        fluxButtonClicked(
                          sendToCollectionButton,
                          true,
                          "Sending to " + name
                        );
                      });
                      button.parentNode.append(sendToCollectionButton);
                    })
                    .catch((e) => {
                      console.log(e);
                      throw e;
                    });
                });
              };

              selectLibrary(userData, dataset, sendToZotero);

              fluxButtonClicked(
                sendToZotero,
                true,
                "Loading Zotero collection names"
              );
            });

            actionDiv.append(sendToZotero);

            break;
          case "hyphe":
          case "zotero":
            //refer to explorer-explainer.md

            const typeList = Object.keys(CM.types.names);

            const optionList = document.createElement("div");
            optionList.innerHTML = `<div style="text-decoration: underline;">Select at least one relevant <span style="font-family:monospace;">TYPE</span> explorer below:</div><br>`;
            optionList.style.padding = "5%";

            detailDiv.style.display = "flex";

            actionDiv.append(optionList);

            typeList.forEach((dataType) => {
              const systemOption = document.createElement("div");
              systemOption.className = "systemOption";
              const optionData = document.createElement("input");
              optionData.className = "sysDestCheck";
              optionData.value = dataType;
              optionData.name = dataType;
              optionData.type = "checkbox";
              const optionLabel = document.createElement("label");
              optionLabel.innerText = CM.types.names[dataType];
              systemOption.append(optionData, optionLabel);
              optionList.append(systemOption);
            });

            const exportOptions = document.createElement("div");

            exportOptions.style = "display:flex;margin-top:1rem;";

            const datasetNameInput = document.createElement("input");
            datasetNameInput.className = "fluxInput";
            datasetNameInput.spellcheck = false;
            datasetNameInput.id = "systemToType";
            datasetNameInput.type = "text";
            datasetNameInput.style.width = "220px";
            datasetNameInput.placeholder = "Enter a dataset name";

            datasetNameInput.value = dataset.name;

            const exportButton = genActionButton("Export");
            exportButton.addEventListener("click", () => {
              var dest = document.getElementsByClassName("sysDestCheck");
              const explorers = [];
              for (let i = 0; i < dest.length; i++) {
                if (dest[i].checked) {
                  explorers.push(dest[i].value);
                }
              }

              powerValve("sysExport", {
                id: dataset.id,
                name: datasetNameInput.value,
                explorers,
              });
            });

            exportOptions.append(datasetNameInput, exportButton);

            optionList.append(exportOptions);

            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  } catch (error) {
    // If it fails at one point
    //detailDiv.innerHTML = error; // Display error message
    window.electron.send("console-logs", error); // Log error
    throw error;
  }
};

const genActionButton = (innerText) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "flux-button";
  button.innerText = innerText;

  return button;
};

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export { datasetDetail };
