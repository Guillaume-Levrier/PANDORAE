import { pandodb } from "../db";
import { CMT } from "../locales/locales";
import { mainDisplay } from "./console";
import { purgeMenuItems, toggleMenu, toggleSecondaryMenu } from "./menu";
import { selectOption } from "./slide-interface";

var typeSelector;

const setTypeSelector = (n) => (typeSelector = n);

const typeSelect = () => {
  toggleMenu();
  typeSelector = true;
  categoryLoader("type");
};

let notLoadingMenu = true;

const categoryLoader = (cat) => {
  if (notLoadingMenu) {
    purgeMenuItems("secMenContent");

    notLoadingMenu = false;

    let blocks;

    switch (cat) {
      case "type":
        /* const typeList = [
          "timeline",
          "geolocator",
          "network",
          "webArchive",
          "clinicalTrials",
          "socialMedia",
          "hyphe",
          "parliament",
        ];

         */
        window.electron.send("console-logs", "Displaying available types");

        const typeDatasetMap = {};

        pandodb.type.toArray().then((datasets) => {
          console.log(datasets);
          datasets.forEach((dataset) => {
            if (!typeDatasetMap.hasOwnProperty(dataset.datasetType)) {
              typeDatasetMap[dataset.datasetType] = [];
            }
            typeDatasetMap[dataset.datasetType].push(dataset);
          });

          let loadingCount = 0;

          console.log(Object.keys(typeDatasetMap));
          Object.keys(typeDatasetMap).forEach((datasetType) => {
            console.log(datasetType);
            let typeContainer = document.createElement("div");
            typeContainer.style.display = "flex";
            typeContainer.style.borderBottom =
              "1px solid rgba(192,192,192,0.3)";
            typeContainer.id = datasetType;
            typeContainer.className += "tabs menu-item";

            typeContainer.innerText =
              CMT.EN.types.names[datasetType].toLowerCase();

            typeContainer.addEventListener("click", (e) =>
              mainDisplay(typeDatasetMap[datasetType], datasetType)
            );

            document.getElementById("secMenContent").append(typeContainer);
            loadingCount += 1;
            /* if (loadingCount === blocks.length) {
              notLoadingMenu = false;
            } else {
              notLoadingMenu = true;
            } */
          });
        });

        /* blocks.forEach((block) => {
          pandodb[block].count().then((thisBlock) => {
           
          });
        }); */
        break;
      case "slide":
        blocks = ["load", "edit", "create"];

        blocks.forEach((thisBlock) => {
          let typeContainer = document.createElement("div");
          typeContainer.style.display = "flex";
          typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
          typeContainer.id = thisBlock;
          typeContainer.className += "tabs menu-item";
          typeContainer.innerText = thisBlock;
          typeContainer.addEventListener("click", (e) => {
            slideDisp(thisBlock);
          });
          document.getElementById("secMenContent").append(typeContainer);
        });
        notLoadingMenu = true;
        break;
      case "export":
        blocks = ["svg", "png", "description", "json"];
        window.electron.send(
          "console-logs",
          "Displaying available export formats"
        );
        blocks.forEach((thisBlock) => {
          let typeContainer = document.createElement("div");
          typeContainer.style.display = "flex";
          typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
          typeContainer.id = thisBlock;
          typeContainer.className += "tabs menu-item";
          typeContainer.innerText = thisBlock;
          typeContainer.addEventListener("click", (e) => saveAs(thisBlock));
          document.getElementById("secMenContent").append(typeContainer);
        });
        notLoadingMenu = true;
        break;
    }
    toggleSecondaryMenu();
  }
};

const listTableDatasets = (datasets, type) => {
  console.log(datasets);
  datasets.forEach((d) => {
    // datasetContainer
    let datasetContainer = document.createElement("div");
    datasetContainer.style.display = "flex";
    datasetContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
    document.getElementById("thirdMenuContent").appendChild(datasetContainer);

    // Dataset
    let dataset = document.createElement("div");
    dataset.className = "secContentTabs";
    dataset.id = d.id;
    dataset.innerHTML =
      "<span><strong>" + d.name + "</strong><br>" + d.date + "</span>";

    dataset.addEventListener("click", () => selectOption(type, d));
    //  dataset.onclick = function () {
    //selectOption(table, d.id);
    //};

    datasetContainer.appendChild(dataset);

    // Remove dataset
    let removeDataset = document.createElement("div");
    removeDataset.className = "secContentDel";
    removeDataset.id = "del" + d.id;
    removeDataset.innerHTML =
      "<span><strong><i class='material-icons'>delete_forever</i></strong><br></span>";

    removeDataset.onclick = () => {
      pandodb.type.delete(d.id);
      document.getElementById("thirdMenuContent").removeChild(datasetContainer);
      field.value = "dataset removed from type";
      window.electron.send("console-logs", "Removed " + d.id + " from type");
    };

    datasetContainer.appendChild(removeDataset);
  });
};

export { categoryLoader, listTableDatasets, setTypeSelector, typeSelector };
