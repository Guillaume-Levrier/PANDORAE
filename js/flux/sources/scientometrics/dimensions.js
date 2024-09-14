// ==== Dimensions ====

const dimensionsUpload = () => {
  //window.electron.send("coreSignal", "importing categorized tweets"); // Sending notification to console
  //window.electron.send("pulsar", false);

  const button = document.getElementById("dimensionsUploadName");
  const datasetName = button.value;
  const datasetPath = document.getElementById("dimensionsUploadPath").files[0]
    .path;

  const datadetail = document.getElementById("dimensions-dataset-detail");

  let count = 0;

  const content = { entries: [], type: "dimensions" };

  fs.createReadStream(datasetPath) // Read the flatfile dataset provided by the user
    .pipe(csv()) // pipe buffers to csv parser
    .on("data", (data) => {
      count++;
      if (count % 7) {
        button.innerText = "Loading " + count;
      }
      content.entries.push(data);
    })
    .on("end", () => {
      let id = datasetName + date();

      pandodb.open();

      pandodb.dimensions
        .add({
          id: id,
          date: date(),
          name: datasetName,
          content: content,
        })
        .then(() => {
          console.log("success");
          fluxButtonAction(
            "load-dimensions",
            true,
            `Dataset saved with ${count} items`,
            ""
          );
          window.electron.send(
            "console-logs",
            "Imported dimensions data " + datasetName
          ); // Sending notification to console
        });
    });
  //.catch((e) => console.log(e));
};
