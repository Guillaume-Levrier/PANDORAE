const twitterCat = () => {
  window.electron.send("coreSignal", "importing categorized tweets"); // Sending notification to console
  window.electron.send("pulsar", false);

  var datasetName = document.getElementById("twitterCatName").value;
  var datasetPath = document.getElementById("twitterCatPathInput").files[0]
    .path;

  fs.readFile(datasetPath, "utf8", (err, data) => {
    var classifiedData = JSON.parse(data);

    pandodb.open();
    let id = datasetName + date();
    pandodb.doxatype
      .add({
        id: id,
        date: date(),
        name: datasetName,
        content: classifiedData,
      })
      .then(() => {
        window.electron.send("coreSignal", "imported categorized tweets"); // Sending notification to console
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "Imported categorized tweets " + datasetName
        ); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      });
  });
};

const twitterThread = () => {
  window.electron.send("coreSignal", "importing thread"); // Sending notification to console
  window.electron.send("pulsar", false);

  var datasetName = document.getElementById("twitterThreadName").value;
  var datasetPath = document.getElementById("twitterThread").files[0].path;
  var thread = [];
  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(datasetPath),
  });

  lineReader.on("line", (line) => {
    thread.push(JSON.parse(line));
  });

  lineReader.on("close", () => {
    let id = datasetName + date();

    pandodb.filotype
      .add({
        id: id,
        date: date(),
        name: datasetName,
        content: thread,
      })
      .then(() => {
        window.electron.send("coreSignal", "imported thread"); // Sending notification to console
        window.electron.send("pulsar", true);
        window.electron.send("console-logs", "Imported thread" + datasetName); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      });
  });
};
