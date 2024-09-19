import { pandodb } from "../db";

const date =
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (destinations, importName, id) => {
  pandodb.open();
  pandodb.flux.toArray().then((datasets) => {
    datasets.forEach((dataset) => {
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

    table
      .add(dataToInsert)
      .catch((e) => console.log(e))
      .then((res) => {
        table.toArray().then((r) => console.log(r));
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

const getPasswordFromChaeros = (service, user) =>
  window.electron.sendSync("keyManager", {
    user: user,
    service: service,
    type: "getPassword",
  });

export { sysExport, dataWriter, getPasswordFromChaeros, date };
