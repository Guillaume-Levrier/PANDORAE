import { pandodb } from "../db";

const date =
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (destination, importName, id) => {
  pandodb.open();

  pandodb.system.get(id).then((dataset) => {
    dataWriter(destination, importName, dataset.content);
  });
};

//========== dataWriter ==========
const dataWriter = (destination, importName, content, datasetType) => {
  pandodb.open();
  destination
    .forEach((d) => {
      let table = pandodb[d];

      let id = importName + date;
      table
        .add({
          id: id,
          date: date,
          name: importName,
          datasetType,
          content: content,
        })
        .then(() => {
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
    })
    .catch((e) => console.log(e));
};

const getPasswordFromChaeros = (service, user) =>
  window.electron.sendSync("keyManager", {
    user: user,
    service: service,
    type: "getPassword",
  });

export { sysExport, dataWriter, getPasswordFromChaeros, date };
