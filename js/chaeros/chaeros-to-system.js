import { pandodb } from "../db";

const date =
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (destinations, importName, id) => {
  pandodb.open();
  pandodb.flux.toArray().then((datasets) => {
    console.log(datasets);
    datasets.forEach((dataset) => {
      console.log("=====");
      console.log(dataset);
      console.log(dataset.id);
      console.log(id);
      if (dataset.id === id) {
        console.log("got there");
        destinations.forEach((dests) =>
          dataWriter(["type"], importName, dataset.content, dests)
        );
      }
    });
  });
};

//========== dataWriter ==========
const dataWriter = (destination, importName, content, datasetType) => {
  pandodb.open();

  console.log(destination, importName, content, datasetType);

  destination.forEach((d) => {
    const table = pandodb[d];

    const id = importName + date;

    const dataToInsert = {
      id,
      date,
      name: importName,
      datasetType,
      content,
    };

    const t1 = performance.now();

    table
      .add(dataToInsert)
      .catch((e) => console.log(e))
      .then((res) => {
        const t2 = performance.now();

        console.log(`Saved in ${t2 - t1}`);

        window.electron.send(
          "console-logs",
          "Retrieval successful. " + importName + " was imported in " + d
        );
      });
    window.electron.send(
      "chaeros-notification",
      "dataset loaded into " + destination
    );
    window.electron.send("pulsar", true);
    window.electron.send("win-destroy", true);
  });
};
export { sysExport, dataWriter, date };
