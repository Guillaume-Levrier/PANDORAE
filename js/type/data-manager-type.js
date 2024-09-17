const dataDownload = (data) => {
  var source = document.getElementById("source");

  var datasetName = "";

  if (data.hasOwnProperty("id")) {
    datasetName = data.id;
    datasetName = datasetName.replace(/\//gi, "_");
    datasetName = datasetName.replace(/:/gi, "+");
  }

  source.style.cursor = "pointer";

  const triggerDownload = () =>
    window.electron.invoke(
      "saveDataset",
      { defaultPath: datasetName + ".json" },
      JSON.stringify(data)
    );

  dataExport = triggerDownload;
  source.addEventListener("click", triggerDownload);
};

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

export { dataDownload, localDownload };
