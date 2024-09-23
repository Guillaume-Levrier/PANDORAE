const genDate = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (explorers, name, id) => {
  window.electron.send("database", {
    operation: "datasetTransfer",
    parameters: {
      origin: { table: "standard" },
      destination: { table: "type" },
      id,
      name,
      explorers,
    },
  });
};

//========== dataWriter ==========
const dataWriter = (table, dataset) =>
  window.electron.send("database", {
    operation: "addDataset",
    parameters: { table, dataset },
  });

export { sysExport, dataWriter, genDate };
