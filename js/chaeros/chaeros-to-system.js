const genDate = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (explorers, name, id) => {
  window.electron.send("database", {
    operation: "datasetTransfer",
    parameters: {
      origin: { table: "flux" },
      destination: { table: "type" },
      id,
      name,
      explorers,
    },
  });
};

//

/* {
  pandodb.open();
  pandodb.flux.toArray().then((datasets) => {
    // using every allow for breaking the statement by returning "false" when found
    datasets.every((dataset) => {
      if (dataset.id === id) {
        destinations.forEach((dests) =>
          dataWriter(["type"], importName, dataset.content, dests)
        );
        return false;
      }

      return true;
    });
  });
}; */

//========== dataWriter ==========
const dataWriter = (table, dataset) =>
  window.electron.send("database", {
    operation: "addDataset",
    parameters: { table, dataset },
  });

/* {
  pandodb.open();

  //(destination, importName, content, datasetType)

  // {
  //   destinations:["flux"],
  //   target_types:["istex","csljson"],
  //   source:"istex",
  //   content:{…}
  //   datasetType:"raw_API_extraction"
  //   name:"myistexquery"
  // }

  

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
}; */
export { sysExport, dataWriter, genDate };
