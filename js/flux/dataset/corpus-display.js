import * as Inputs from "@observablehq/inputs";

// ===== CORPUS DISPLAY =====
// This is a bit like dataset display, except that the datasets
// are not from the internal PANDORAE database but from an external
// API such as the Zotero API or the Hyphe API.
//
// This is called a "corpus" list but it doesn't have to be a collection
// of documents.

const displayCorpusList = (
  corpora,
  displayDiv,
  detailDiv,
  corpusOptions,
  multiple
) => {
  const searchField = Inputs.search(corpora, {
    placeholder: "Look for a dataset…",
    label: "",
    spellcheck: false,
  });

  searchField.style = "padding:5px;margin: 0.5rem;";

  searchField.children[0].children[0].style = "margin-right:10px";

  const displayTable = document.createElement("div");
  displayTable.style = "max-height:350px;overflow-y:scroll";
  const updateTable = () => {
    displayTable.innerHTML = "";

    const searchTable = Inputs.table(searchField.value, {
      columns: Object.keys(corpora[0]),
      width: "100%",
      multiple,
      layout: "fixed",
      rows: Infinity,
      maxHeight: "350px",
    });

    searchTable.addEventListener("input", () => {
      if (searchTable.value) {
        corpusDetail(corpusOptions, detailDiv, searchTable.value);
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

const corpusDetail = (corpusOptions, detailDiv, selected) => {
  detailDiv.innerHTML = "";
  //detailDiv.innerHTML = JSON.stringify(selected);

  detailDiv.style.display = "block";

  const importButton = document.createElement("button");
  importButton.className = "flux-button";
  importButton.type = "submit";

  switch (corpusOptions.type) {
    case "zotero":
      const importName = document.createElement("input");
      importName.className = "fluxInput";
      importName.spellcheck = false;
      importName.type = "text";
      importName.placeholder = "Enter import name";
      importName.value = "";

      if (selected.length === 1) {
        importName.value = selected[0].name;
      } else if (selected.length > 1) {
        let importCollectionName = "";
        selected.forEach((d) => (importCollectionName += d.name + "-"));
        importName.value = importCollectionName.slice(0, -1);
      }

      importButton.innerText = "Import selected collections into system";

      importButton.addEventListener("click", () => {
        const powerValveArgs = {
          importName: importName.value.replace(/\s/g, ""),
          libraryID: corpusOptions.libraryID,
          collections: {},
        };

        selected.forEach((s) => (powerValveArgs.collections[s.key] = s));

        powerValve("zoteroItemsRetriever", powerValveArgs);
      });

      detailDiv.append(importName, importButton);

      break;

    case "hyphe":
      detailDiv.innerHTML = `<strong>${selected.Name}</strong><br>
        ${selected["Web Entities IN"]} web entities classified as within the corpus.<br>
        This corpus was last active on ${selected["Last Activity"]}.<br>`;
      const passwordInput = document.createElement("input");
      passwordInput.className = "fluxInput";
      passwordInput.spellcheck = false;
      passwordInput.type = "password";
      passwordInput.style.width = "220px";

      importButton.innerText = "Import Hyphe corpus";
      importButton.addEventListener("click", () =>
        loadHyphe(selected.Name, passwordInput.value)
      );

      if (selected.Password) {
        detailDiv.append(passwordInput);
      }
      detailDiv.append(importButton);

      break;

    default:
      break;
  }
};
export { displayCorpusList };
