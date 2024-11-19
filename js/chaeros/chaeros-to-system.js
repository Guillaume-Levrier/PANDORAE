const genDate = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== sysExport ==========
const sysExport = (data) =>
  window.electron.send("database", {
    operation: "datasetTransfer",
    parameters: {
      origin: { table: "standard" },
      destination: { table: "type" },
      id: data.id,
      name: data.name,
      explorers: data.explorers,
    },
  });

//========== dataWriter ==========
const dataWriter = (table, dataset) =>
  window.electron.send("database", {
    operation: "addDataset",
    parameters: { table, dataset },
  });

export { sysExport, dataWriter, genDate };
