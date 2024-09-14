//========== datasetDisplay ==========
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

const datasetDisplay = (divId, kind, altkind) => {
  try {
    // Try the following block

    // The altkind thing is a hack. Normally, 1 flux tab equals to 1 db.
    // With manual, we find ourselves editing/updating csl-json data.
    // Might walk this one back in the future, seems the lesser of two
    // evils right now.

    if (!altkind) {
      altkind = kind;
    }

    let list = document.createElement("UL");

    pandodb[kind].toArray((files) => {
      files.forEach((file) => {
        let line = document.createElement("LI");
        line.id = file.id;

        let button = document.createElement("SPAN");
        line.addEventListener("click", (e) => {
          datasetDetail(
            altkind + "-dataset-preview",
            kind,
            file.id,
            altkind + "-dataset-buttons"
          );
        });
        button.innerText = file.name;

        let download = document.createElement("i");
        download.className = "fluxDelDataset material-icons";
        download.addEventListener("click", (e) => {
          let name = file.name + ".json";
          window.electron.invoke(
            "saveDataset",
            { defaultPath: name },
            JSON.stringify(file, replacer)
          );
        });

        download.innerText = "download";

        let remove = document.createElement("i");
        remove.className = "fluxDelDataset material-icons";
        remove.addEventListener("click", (e) => {
          datasetRemove(kind, file.id);
        });
        remove.innerText = "close";

        line.appendChild(button);
        line.appendChild(remove);
        line.appendChild(download);

        list.appendChild(line);
      });

      if (files.length === 0) {
        document.getElementById(divId).innerHTML =
          "No dataset available in the system";
      } else {
        document.getElementById(divId).innerHTML = "";
        document.getElementById(divId).appendChild(list);
      }
    });
  } catch (err) {
    console.log(err);
    document.getElementById(divId).innerHTML = err; // Display error in the result div
  }
};

const datasetRemove = (kind, id) => {
  pandodb[kind].get(id).then((dataset) => {
    if (dataset.content.hasOwnProperty("path")) {
      fs.unlink(dataset.content.path, (err) => {
        if (err) throw err;
      });
    }

    pandodb[kind].delete(id);

    document
      .getElementById(id)
      .parentNode.removeChild(document.getElementById(id));
    window.electron.send(
      "console-logs",
      "Removed " + id + " from database: " + kind
    );
    datasetDetail(null, kind, null, null);
  });
};

//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).

const datasetDetail = (prevId, kind, id, buttonId) => {
  // This function provides info on a specific dataset

  //var datasetDetail = {}; // Create the dataDetail object
  let dataPreview = ""; // Created dataPreview variable

  const altID = prevId.split("-")[0];

  if (prevId === null) {
    document.getElementById(kind + "-dataset-preview").innerText =
      "Dataset deleted";
    document.getElementById(kind + "-dataset-buttons").style.display = "none";
  } else if (kind === "hyphe") {
    hypheCorpusList(id, prevId);
  } else {
    try {
      pandodb[kind].get(id).then((doc) => {
        if (altID === "sciento") {
          document.getElementById("sciento-dataset-buttons").style.display =
            "block";
          document.getElementById("sciento-source").innerText = kind;
          document.getElementById("sciento-corpusType").innerText = kind;
          document.getElementById("sciento-dataset").innerText = doc.id;
        }
        switch (kind) {
          case "istex":
            dataPreview = `<strong> ${doc.name} </strong>
                <br>Origin: ${doc.content.type}
                <br>Total results: ${doc.content.entries.length} 
                <br>Upload date: ${doc.date}`;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            // document.getElementById(buttonId).style.display = "block";

            convertButton.dataset.corpusType = doc.content.type;
            break;
          case "dimensions":
            dataPreview = `<strong> ${doc.name} </strong>
                <br>Origin: ${doc.content.type}
                <br>Total results: ${doc.content.entries.length} 
                <br>Upload date: ${doc.date}`;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            // document.getElementById(buttonId).style.display = "block";

            convertButton.dataset.corpusType = doc.content.type;
            break;
          case "webofscience":
            dataPreview = `<strong> ${doc.name} </strong>
                <br>Origin: ${doc.content.type}
                <br>Query: ${doc.content.query} 
                <br>Total results: ${doc.content.entries.length} 
                <br>Query date: ${doc.date}`;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            // document.getElementById(buttonId).style.display = "block";
            document.getElementById("webofscienceGeolocate").style.display =
              "block";
            document.getElementById("webofscienceGeolocate").name = doc.id;
            //document.getElementById("altmetricRetriever").name = doc.id;
            convertButton.dataset.corpusType = doc.content.type;
            break;
          case "scopus":
            dataPreview =
              "<strong>" +
              doc.name +
              "</strong>" + // dataPreview is the displayed information in the div
              "<br>Origin: Scopus" +
              "<br>Query: " +
              doc.content.query +
              "<br>Total results: " +
              doc.content.entries.length +
              "<br>Query date: " +
              doc.date;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            //document.getElementById(buttonId).style.display = "block";
            document.getElementById("scopusGeolocate").style.display = "block";
            document.getElementById("scopusGeolocate").name = doc.id;
            //document.getElementById("altmetricRetriever").name = doc.id;
            convertButton.dataset.corpusType = doc.content.type;
            break;

          case "enriched":
            dataPreview = `<strong>${doc.name} </strong>
                <br>Origin: ${doc.content.type}
                <br>Query: ${doc.content.query}
                <br>Total results: ${doc.content.entries.length}
                <br>Query date: ${doc.date}
                <br>Affiliations geolocated:${doc.content.articleGeoloc}
                <br>Altmetric metadata retrieved: ${doc.content.altmetricEnriched}`;

            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(buttonId).style.display = "block";
            const convertButton = document.getElementById("convert-csl");
            convertButton.style.display = "inline-flex";
            convertButton.name = doc.id;
            convertButton.dataset.corpusType = doc.content.type;
            break;

          case "manual":
          case "csljson":
            dataPreview =
              "<strong>" +
              doc.name +
              "</strong><br>Item amount : " +
              doc.content.length;
            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(prevId).name = doc.id;
            document.getElementById(buttonId).style.display = "inline-flex";
            break;

          case "system":
            let subArrayContent = "";
            if (doc.content.isArray) {
              doc.content.forEach((d) => {
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
                doc.name +
                "</strong><br>" +
                "Dataset date: " +
                doc.date +
                "<br><br>Arrays contained in the dataset" +
                "<br><table style='border-collapse: collapse;'><thead><tr style='border:1px solid #141414;'><th>Name</th><th>#</th><th>Origin</th></tr></thead>" +
                "<tbody>" +
                subArrayContent +
                "</tbody></table>";
            } else {
              dataPreview =
                "<br><strong>" +
                doc.name +
                "</strong><br>" +
                "Dataset date: " +
                doc.date +
                "<br>";
              "Dataset type: " + doc.content.type + "<br>";
            }
            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(prevId).name = doc.id;
            document.getElementById(buttonId).style.display = "unset";
            document.getElementById(buttonId).style.flex = "auto";
            document.getElementById("systemToType").value = doc.id;
            const problematics = document.getElementById("problematics");
            problematics.innerHTML = "";
            problematics.style.display = "none";

            break;
        }
      });
    } catch (error) {
      // If it fails at one point
      document.getElementById(prevId).innerHTML = error; // Display error message
      window.electron.send("console-logs", error); // Log error
    }
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
    fluxButtonAction("load-local", true, "Uploaded", "");
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

  pandodb.system.get(id).then((data) => {
    window.electron.invoke(
      "saveDataset",
      { defaultPath: id + ".json" },
      JSON.stringify(data, replacer)
    );
  });
};

export { datasetDisplay, localUpload, downloadData };
