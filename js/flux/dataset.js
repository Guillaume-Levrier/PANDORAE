import * as Inputs from "@observablehq/inputs";

//========== datasetDisplay ==========
import { CM } from "../locales/locales";
import { powerValve } from "./powervalve";
import { fluxButtonClicked } from "./actionbuttons";
import { loadHyphe } from "./sources/hyphe/hyphe-flux";

// datasetDisplay shows the datasets (usually JSON or CSV files) available in the relevant /datasets/ subdirectory.

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

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

window.electron.databaseReply((args) => {
  switch (args.reply_type) {
    case "datasetList":
      displayDatasetList(
        args.r,
        args.parameters.display,
        args.parameters.detail,
        args.parameters.table
      );
      break;

    case "dataset":
      break;

    default:
      break;
  }
});

const displayDatasetList = (datasets, displayid, detailid, table) => {
  const displayDiv = document.getElementById(displayid);
  const detailDiv = document.getElementById(detailid);

  const searchField = Inputs.search(datasets, {
    placeholder: "Look for a dataset…",
    label: "Search this data table",
    spellcheck: false,
  });

  searchField.style = "padding:5px;";

  const displayTable = document.createElement("div");

  const updateTable = () => {
    displayTable.innerHTML = "";

    const searchTable = Inputs.table(searchField.value, {
      columns: ["name", "date", "source"],
      width: "100%",
      multiple: false,
    });

    searchTable.style =
      "margin:5px;padding:5px;border:1px solid rgb(220,220,220)";

    searchTable.addEventListener("input", () => {
      if (searchTable.value) {
        datasetDetail(detailDiv, searchTable.value, table);
      } else {
        datasetDetail.style.display = "none";
        detailDiv.innerHTML = "";
      }
    });

    displayTable.append(searchTable);
  };

  searchField.addEventListener("input", updateTable);

  updateTable();

  displayDiv.append(searchField, displayTable);
};

const datasetDisplay = (data) =>
  window.electron.send("database", {
    operation: "getDatasetList",
    parameters: data,
  });

const datasetRemove = (table, id) =>
  window.electron.send("database", {
    operation: "removeDataset",
    parameters: { table, id },
  });

//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).

const datasetDetail = (detailDiv, dataset, table) => {
  // This function provides info on a specific dataset

  //Make the div visible
  detailDiv.innerHTML = "";
  detailDiv.style.display = "flex";

  // The detail div contains two sub-divs:
  // 1. information on the dataset
  // 2. action panel (buttons) of things to do to that dataset

  const informationDiv = document.createElement("div");
  informationDiv.className = "datasetDetailInformationDiv";

  const actionDiv = document.createElement("div");
  actionDiv.className = "datasetDetailActionDiv";

  detailDiv.append(informationDiv, actionDiv);

  // information div
  informationDiv.innerHTML = `<span style="font-weight:bold;"> ${dataset.name} </span>
  <br>Origin : ${dataset.source}
  <br>Total results : ${dataset.data.length} 
  <br>Upload date : ${dataset.date}
  <br>Unique ID : ${dataset.id}`;

  // most basic actions

  // button to click to download the relevant datasets
  const downloadButton = document.createElement("button");
  downloadButton.type = "submit";
  downloadButton.className = "flux-button";
  downloadButton.innerText = "Download dataset";
  downloadButton.addEventListener("click", () => {
    const name = dataset.name + ".json";
    window.electron.send("saveDataset", {
      target: name,
      data: JSON.stringify(dataset, replacer),
    });
    fluxButtonClicked(downloadButton, true, "Dataset downloaded");
  });

  actionDiv.append(downloadButton);

  const deleteButton = document.createElement("button");
  deleteButton.type = "submit";
  deleteButton.className = "flux-button";
  deleteButton.innerText = "Delete dataset";
  deleteButton.addEventListener("click", () => {
    // send the coordinates of the dataset to remove from the database
    detailDiv.innerHTML = "Dataset deleted";
    datasetRemove(table, dataset.id);
  });

  actionDiv.append(deleteButton);

  try {
    switch (dataset.source) {
      case "istex":
      case "dimensions":
      case "webofscience":
      case "scopus":
        // Standardize to CSL

        const standardizeCSL = document.createElement("button");
        standardizeCSL.type = "submit";
        standardizeCSL.className = "flux-button";
        standardizeCSL.innerText = "Standardize dataset";
        standardizeCSL.addEventListener("click", () => {
          powerValve("standardize", dataset);
          fluxButtonClicked(standardizeCSL, true, "Dataset standardized");
        });

        actionDiv.append(standardizeCSL);

        break;
      case "standard":
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

        const exportButton = document.createElement("button");
        exportButton.type = "submit";
        exportButton.className = "flux-button";
        exportButton.innerText = "Export";
        exportButton.addEventListener("click", () =>
          powerValve("sysExport", {
            id: dataset.id,
            name: datasetNameInput.value,
          })
        );

        exportOptions.append(datasetNameInput, exportButton);

        optionList.append(exportOptions);

        break;
    }
  } catch (error) {
    // If it fails at one point
    //detailDiv.innerHTML = error; // Display error message
    window.electron.send("console-logs", error); // Log error
    throw error;
  }
};

//========== datasetLoader ==========
// datasetLoader allows user to load datasets from a local directory into a PANDORAE target subdirectory.

const datasetLoader = () => {
  let uploadedFiles = document.getElementById("dataset-upload").files; // Uploaded file as a variable

  let targets = [];

  var dest = document.getElementsByClassName("locDestCheck");

  for (let i = 0; i < dest.length; i++) {
    if (dest[i].checked) {
      targets.push(dest[i].value);
    }
  }

  try {
    uploadedFiles.forEach((dataset) => {
      targets.forEach((target) => {
        pandodb[target].put(dataset);
        window.electron.send(
          "console-logs",
          "Dataset " +
            dataset.name +
            " loaded into " +
            JSON.stringify(target) +
            "."
        ); // Log action
      });
    });
  } catch (e) {
    window.electron.send("console-logs", e); // Log error
  } finally {
    //fluxButtonAction("load-local", true, "Uploaded", "");
  }
};

//========== datasetsSubdirList ==========
// List available directories for the user to upload the datasets in.
const datasetsSubdirList = (kind, dirListId) => {
  let datasetDirArray = [];

  if ((kind = "local")) {
    datasetDirArray = [
      "altmetric",
      "scopus",
      "csljson",
      "zotero",
      "twitter",
      "anthropotype",
      "chronotype",
      "geotype",
      "pharmacotype",
      "publicdebate",
      "gazouillotype",
    ];
  } else {
    datasetDirArray = kind;
  }

  var datasetDirList = ""; // Create the list as a string
  for (var i = 0; i < datasetDirArray.length; ++i) {
    // For each element of the array
    datasetDirList = datasetDirList + datasetDirArray[i]; // Add it to the string
  }
  document.getElementById(dirListId).innerHTML = datasetDirList; // The string is a <ul> list
};

const localUpload = () => {
  window.electron.send("coreSignal", "importing local dataset"); // Sending notification to console
  window.electron.send("pulsar", false);

  var datasetPath = document.getElementById("localUploadPath").files[0].path;

  fs.readFile(datasetPath, "utf8", (err, data) => {
    var data = JSON.parse(data, reviver);

    var capList = ["Content", "Id", "Date", "Name"];

    capList.forEach((d) => {
      if (data.hasOwnProperty(d)) {
        let prop = d.toLocaleLowerCase();
        data[prop] = data[d];
        delete data[d];
      }
    });

    pandodb.open();
    pandodb.system
      .add(data)
      .then(() => {
        window.electron.send("coreSignal", "imported local dataset"); // Sending notification to console
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "Imported local dataset " + data.id
        ); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const downloadData = () => {
  var id = document.getElementById("system-dataset-preview").name;

  pandodb.source.toArray().then((datasets) => {
    var data;

    datasets.forEach((d) => (d.id === id ? (data = d) : false));

    window.electron.invoke(
      "saveDataset",
      { defaultPath: id + ".json" },
      JSON.stringify(data, replacer)
    );
  });
};

// ===== CORPUS DISPLAY =====
// This is a bit like dataset display, except that the datasets
// are not from the internal PANDORAE database but from an external
// API such as the Zotero API or the Hyphe API.
//
// This is called a "corpus" list but it doesn't have to be a collection
// of documents.

const displayCorpusList = (
  corpora,
  displayDiv,
  detailDiv,
  corpusType,
  multiple
) => {
  const searchField = Inputs.search(corpora, {
    placeholder: "Look for a dataset…",
    label: "",
    spellcheck: false,
  });

  searchField.style = "padding:5px;";

  searchField.children[0].children[0].style = "margin-right:10px";

  const displayTable = document.createElement("div");

  const updateTable = () => {
    displayTable.innerHTML = "";

    const searchTable = Inputs.table(searchField.value, {
      columns: Object.keys(corpora[0]),
      width: "100%",
      multiple,
      layout: "fixed",
      maxHeight:"100%"
    });

    searchTable.addEventListener("input", () => {
      if (searchTable.value) {
        corpusDetail(corpusType, detailDiv, searchTable.value);
      } else {
        datasetDetail.style.display = "none";
        detailDiv.innerHTML = "";
      }
    });

    displayTable.append(searchTable);
  };

  searchField.addEventListener("input", updateTable);

  updateTable();

  displayDiv.append(searchField, displayTable);
};

const corpusDetail = (corpusType, detailDiv, selected) => {
  console.log(selected);

  detailDiv.innerHTML = "";
  //detailDiv.innerHTML = JSON.stringify(selected);

  detailDiv.style.display = "block";

const importButton = document.createElement("button");
        importButton.className = "flux-button";
        importButton.type = "submit";

  switch (corpusType) {
    case "zotero":
 const importDiv = document.createElement("div");

       
        
        importDiv.style.padding = "1rem";
     const importName = document.createElement("input");
        importName.className = "fluxInput";
        importName.spellcheck = false;
        importName.type = "text";
        importName.placeholder = "Enter import name";
        importName.id = "zoteroImportName";

        
        importButton.innerText = "Import selected collections into system";

        importButton.addEventListener("click", () => {
          powerValveArgs.importName = importName.value.replace(/\s/g, "");
          console.log(selected)
         // powerValveArgs.collections[colID] = { key, name };

          /*
          powerValve("zoteroItemsRetriever", {
            name: "Zotero Collection Retriever",
            powerValveArgs,
          });
          */
        });

        importDiv.append(importName, importButton);
detailDiv.append(importDiv)
      break;

    case "hyphe":
      detailDiv.innerHTML = `<strong>${selected.Name}</strong><br>
      ${selected["Web Entities IN"]} web entities classified as within the corpus.<br>
      This corpus was last active on ${selected["Last Activity"]}.<br>`;
      const passwordInput = document.createElement("input");
      passwordInput.className = "fluxInput";
      passwordInput.spellcheck = false;
      passwordInput.type = "password";
      passwordInput.style.width = "220px";

    
      importButton.innerText = "Import Hyphe corpus";
      importButton.addEventListener("click", () =>
        loadHyphe(selected.Name, passwordInput.value)
      );

      if (selected.Password) {
        detailDiv.append(passwordInput);
      }
      detailDiv.append(importButton);

      break;

    default:
      break;
  }
};

export { datasetDisplay, localUpload, downloadData, displayCorpusList };
