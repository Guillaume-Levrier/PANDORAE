//========== datasetDisplay ==========

import { CM } from "../locales/locales";
import { powerValve } from "./powervalve";

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
        args.parameters.detail
      );
      break;

    case "dataset":
      break;

    default:
      break;
  }
});

const displayDatasetList = (datasets, displayid, detailid) => {
  const displayDiv = document.getElementById(displayid);
  const detailDiv = document.getElementById(detailid);

  const list = document.createElement("ul");

  datasets.forEach((dataset) => {
    let line = document.createElement("LI");
    line.id = dataset.id;

    let button = document.createElement("SPAN");

    if (detailDiv) {
      line.addEventListener("click", (e) => datasetDetail(detailDiv, dataset));
    }

    button.innerText = `${dataset.name} - ${dataset.date}`;

    let download = document.createElement("i");
    download.className = "fluxDelDataset material-icons";

    download.addEventListener("click", (e) => {
      const name = dataset.name + ".json";

      window.electron.send("saveDataset", {
        target: name,
        data: JSON.stringify(dataset, replacer),
      });
    });

    download.innerText = "download";

    let remove = document.createElement("i");
    remove.className = "fluxDelDataset material-icons";
    remove.addEventListener("click", (e) => {
      datasetRemove(kind, dataset.id);
    });
    remove.innerText = "close";

    line.appendChild(button);
    line.appendChild(remove);
    line.appendChild(download);

    list.appendChild(line);
  });

  if (datasets.length === 0) {
    displayDiv.innerHTML = "No dataset available in the system";
  } else {
    displayDiv.innerHTML = "";
    displayDiv.appendChild(list);
  }
};

const datasetDisplay = (data) =>
  window.electron.send("database", {
    operation: "getDatasetList",
    parameters: data,
  });

const datasetRemove = (kind, id) => {
  pandodb.flux.toArray().then((datasets) => {
    var dataset;

    datasets.forEach((d) => (d.id === id ? (dataset = d) : false));

    if (dataset.content.hasOwnProperty("path")) {
      fs.unlink(dataset.content.path, (err) => {
        if (err) throw err;
      });
    }

    pandodb.flux.delete(id);

    document
      .getElementById(id)
      .parentNode.removeChild(document.getElementById(id));
    window.electron.send(
      "console-logs",
      "Removed " + id + " from database: " + kind
    );
  });
};

//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).

const datasetDetail = (detailDiv, dataset) => {
  // This function provides info on a specific dataset

  let dataPreview = ""; // Created dataPreview variable

  detailDiv.innerHTML = "";

  console.log(dataset);

  try {
    switch (dataset.source) {
      case "istex":
        dataPreview = `<strong> ${dataset.name} </strong>
                <br>Origin: ${dataset.content.type}
                <br>Total results: ${dataset.content.entries.length} 
                <br>Upload date: ${dataset.date}`;

        document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
        // document.getElementById(buttonId).style.display = "block";

        convertButton.dataset.corpusType = dataset.content.type;
        break;
      case "dimensions":
        dataPreview = `<strong> ${dataset.name} </strong>
                <br>Origin: ${dataset.content.type}
                <br>Total results: ${dataset.content.entries.length} 
                <br>Upload date: ${dataset.date}`;

        document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
        // document.getElementById(buttonId).style.display = "block";

        convertButton.dataset.corpusType = dataset.content.type;
        break;
      case "webofscience":
        dataPreview = `<strong> ${dataset.name} </strong>
                <br>Origin: ${dataset.content.type}
                <br>Query: ${dataset.content.query} 
                <br>Total results: ${dataset.content.entries.length} 
                <br>Query date: ${dataset.date}`;

        document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
        // document.getElementById(buttonId).style.display = "block";
        document.getElementById("webofscienceGeolocate").style.display =
          "block";
        document.getElementById("webofscienceGeolocate").name = dataset.id;
        //document.getElementById("altmetricRetriever").name = dataset.id;
        convertButton.dataset.corpusType = dataset.content.type;
        break;
      case "scopus":
        dataPreview =
          "<strong>" +
          dataset.name +
          "</strong>" + // dataPreview is the displayed information in the div
          "<br>Origin: Scopus" +
          "<br>Query: " +
          dataset.content.query +
          "<br>Total results: " +
          dataset.content.entries.length +
          "<br>Query date: " +
          dataset.date;

        document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
        //document.getElementById(buttonId).style.display = "block";
        document.getElementById("scopusGeolocate").style.display = "block";
        document.getElementById("scopusGeolocate").name = dataset.id;
        //document.getElementById("altmetricRetriever").name = dataset.id;
        convertButton.dataset.corpusType = dataset.content.type;
        break;

      case "enriched":
        dataPreview = `<strong>${dataset.name} </strong>
                <br>Origin: ${dataset.content.type}
                <br>Query: ${dataset.content.query}
                <br>Total results: ${dataset.content.entries.length}
                <br>Query date: ${dataset.date}
                <br>Affiliations geolocated:${dataset.content.articleGeoloc}
                <br>Altmetric metadata retrieved: ${dataset.content.altmetricEnriched}`;

        document.getElementById(prevId).innerHTML = dataPreview;
        document.getElementById(buttonId).style.display = "block";
        const convertButton = document.getElementById("convert-csl");
        convertButton.style.display = "inline-flex";
        convertButton.name = dataset.id;
        convertButton.dataset.corpusType = dataset.content.type;
        break;

      case "manual":
      case "csljson":
        dataPreview =
          "<strong>" +
          dataset.name +
          "</strong><br>Item amount : " +
          dataset.content.length;
        document.getElementById(prevId).innerHTML = dataPreview;
        document.getElementById(prevId).name = dataset.id;
        document.getElementById(buttonId).style.display = "inline-flex";
        break;

      case "zotero":
        //refer to explorer-explainer.md
        /* const typeList = [
          "timeline",
          "geolocator",
          "network",
          "webArchive",
          "clinicalTrials",
          "socialMedia",
          "hyphe",
          "parliament",
        ]; */

        const typeList = Object.keys(CM.types.names);

        let subArrayContent = "";

        if (dataset.data.isArray) {
          dataset.data.forEach((d) => {
            let subContent =
              "<tr><td>" +
              d.name +
              "</td><td>" +
              d.items.length +
              " </td><td>" +
              d.library.name +
              "</td></tr>";
            subArrayContent += subContent;
          });
          dataPreview =
            "<br><strong>" +
            dataset.name +
            "</strong><br>" +
            "Dataset date: " +
            dataset.date +
            "<br><br>Arrays contained in the dataset" +
            "<br><table style='border-collapse: collapse;'><thead><tr style='border:1px solid #141414;'><th>Name</th><th>#</th><th>Origin</th></tr></thead>" +
            "<tbody>" +
            subArrayContent +
            "</tbody></table>";
        } else {
          dataPreview =
            "<br><strong>" +
            dataset.name +
            "</strong><br>" +
            "Dataset date: " +
            dataset.date +
            "<br>";
          "Dataset type: " + dataset.data.type + "<br>";
        }

        const dataPreviewDiv = document.createElement("div");
        dataPreviewDiv.style.padding = "5%";
        dataPreviewDiv.style.width = "40%";
        dataPreviewDiv.innerHTML = dataPreview;

        const optionList = document.createElement("div");
        optionList.style.padding = "5%";

        detailDiv.style.display = "flex";

        detailDiv.append(dataPreviewDiv, optionList);

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

        //document.getElementById(prevId).name = dataset.id;
        //document.getElementById(buttonId).style.display = "unset";
        //document.getElementById(buttonId).style.flex = "auto";
        //document.getElementById("systemToType").value = dataset.id;
        //const problematics = document.getElementById("problematics");
        //problematics.innerHTML = "";
        //problematics.style.display = "none";

        break;
    }
  } catch (error) {
    // If it fails at one point
    detailDiv.innerHTML = error; // Display error message
    window.electron.send("console-logs", error); // Log error
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

export { datasetDisplay, localUpload, downloadData };
