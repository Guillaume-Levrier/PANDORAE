var dataExport;

const dataDownload = (data) => {
  var source = document.getElementById("source");

  console.log(data);

  var datasetName = "";

  if (data.hasOwnProperty("id")) {
    datasetName = data.id;
    datasetName = datasetName.replace(/\//gi, "_");
    datasetName = datasetName.replace(/:/gi, "+");
  }

  source.style.cursor = "pointer";

  const triggerDownload = () =>
    window.electron.send("saveDataset", {
      target: datasetName + ".json",
      data: JSON.stringify(data),
    });

  dataExport = triggerDownload;

  source.textContent = datasetName;
  source.addEventListener("click", triggerDownload);
};

// Not sure this has an actual purpose anymore
const localDownload = (data) => {
  //same but for exports

  setTimeout(() => {
    var source = document.getElementById("source");

    var datasetName = "";

    if (data.hasOwnProperty("id")) {
      datasetName = data.id;
      datasetName = datasetName.replace(/\//gi, "_");
      datasetName = datasetName.replace(/:/gi, "+");
    }

    source.style.cursor = "pointer";

    var a = document.createElement("a");

    var json = JSON.stringify(data);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = datasetName + ".json";
    a.textContent = source.innerText;
    source.innerText = "";
    source.appendChild(a);
  }, 300);
};

export { dataDownload, localDownload, dataExport };
