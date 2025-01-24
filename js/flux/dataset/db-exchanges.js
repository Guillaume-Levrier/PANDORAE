import { datasetDetail } from "./dataset-details";
import * as Inputs from "@observablehq/inputs";

window.electron.databaseReply((args) => {
  switch (args.reply_type) {
    case "datasetList":
      displayDatasetList(
        args.r,
        args.parameters.display,
        args.parameters.detail,
        args.parameters.table
      );
      break;

    case "dataset":
      break;

    default:
      break;
  }
});

const displayDatasetList = (datasets, displayid, detailid, table) => {
  const displayDiv = document.getElementById(displayid);
  const detailDiv = document.getElementById(detailid);

  const searchField = Inputs.search(datasets, {
    placeholder: "Look for a dataset…",
    label: "Search this data table",
    spellcheck: false,
  });

  searchField.style = "padding:5px;";

  const displayTable = document.createElement("div");

  const updateTable = () => {
    displayTable.innerHTML = "";

    const searchTable = Inputs.table(searchField.value, {
      columns: ["name", "date", "source"],
      width: "100%",
      multiple: false,
    });

    searchTable.style =
      "margin:5px;padding:5px;border:1px solid rgb(220,220,220)";

    searchTable.addEventListener("input", () => {
      if (searchTable.value) {
        datasetDetail(detailDiv, searchTable.value, table);
      } else {
        datasetDetail.style.display = "none";
        detailDiv.innerHTML = "";
      }
    });

    displayTable.append(searchTable);
  };

  searchField.addEventListener("input", updateTable);

  updateTable();

  displayDiv.append(searchField, displayTable);
};

const datasetDisplay = (data) =>
  window.electron.send("database", {
    operation: "getDatasetList",
    parameters: data,
  });

const datasetRemove = (table, id) =>
  window.electron.send("database", {
    operation: "removeDataset",
    parameters: { table, id },
  });

export { datasetDisplay, datasetRemove, displayDatasetList };
