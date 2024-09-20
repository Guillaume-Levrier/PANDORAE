import { pandodb } from "../db";
import { CMT } from "../locales/locales";
import { typeSwitch } from "../type/typeswitch";
import { mainDisplay } from "./console";
import {
  purgeMenuItems,
  toggledMenu,
  toggleMenu,
  toggleSecondaryMenu,
} from "./menu";
import { pulse } from "./pulse";

var typeSelector;

var currentType;

const CM = CMT.EN;

const setTypeSelector = (n) => (typeSelector = n);

const typeSelect = () => {
  toggleMenu();
  typeSelector = true;
  categoryLoader("type");
};

const resetCategoryStyle = () => {
  // reset neutral style for other TYPE category tabs
  const typeContainers = document.getElementsByClassName("typeContainer");
  for (let i = 0; i < typeContainers.length; i++) {
    typeContainers[i].style =
      "display:flex;border-bottom:1px solid rgba(192,192,192,0.3)";
  }
};

let notLoadingMenu = true;

const categoryLoader = (cat) => {
  if (notLoadingMenu) {
    purgeMenuItems("secMenContent");

    notLoadingMenu = false;

    let blocks;

    switch (cat) {
      case "type":
        window.electron.send("console-logs", "Displaying available types");

        const typeDatasetMap = {};

        pandodb.type.toArray().then((datasets) => {
          datasets.forEach((dataset) => {
            if (!typeDatasetMap.hasOwnProperty(dataset.datasetType)) {
              typeDatasetMap[dataset.datasetType] = [];
            }
            typeDatasetMap[dataset.datasetType].push(dataset);
          });

          let loadingCount = 0;

          Object.keys(typeDatasetMap).forEach((datasetType) => {
            const typeContainer = document.createElement("div");
            typeContainer.style =
              "display:flex;border-bottom:1px solid rgba(192,192,192,0.3)";

            typeContainer.id = datasetType;
            typeContainer.className += "tabs menu-item typeContainer";

            typeContainer.innerText =
              CMT.EN.types.names[datasetType].toLowerCase();

            typeContainer.addEventListener("click", (e) => {
              resetCategoryStyle();

              // only load if opening a new/different tab

              // add selected style for the one selected tab
              typeContainer.style.color = "white";
              typeContainer.style.backgroundColor = "rgb(20,20,20)";

              // trigger main display
              mainDisplay(typeDatasetMap[datasetType], datasetType);
            });

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
  }
  toggleSecondaryMenu();
  resetCategoryStyle();
  field.value = ``;
};

const listTableDatasets = (datasets, type) => {
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

const selectOption = (type, dataset) => {
  if (typeSelector) {
    let order =
      "[actionType:" +
      JSON.stringify(type) +
      "," +
      JSON.stringify(dataset.id) +
      "/actionType]";
    let editor = document.getElementsByClassName("ql-editor")[0];
    editor.innerHTML = editor.innerHTML + order;

    setTypeSelector(false);
    toggleMenu();
  } else {
    if (toggledMenu) {
      toggleMenu();
    }

    //document.getElementById("menu-icon").onclick = "";
    document.getElementById("menu-icon").addEventListener(
      "click",
      () => {
        location.reload();
      },
      { once: true }
    );
    field.value = CM.global.field.starting + " " + type;
    currentType = { type: type, id: dataset.id };
    //types.typeSwitch(type, id);

    // Give time to the menu to get closed
    setTimeout(() => typeSwitch(type, dataset), 400);

    window.electron.send("audio-channel", "button2");
    pulse(1, 1, 10);

    window.electron.send(
      "console-logs",
      CM.console.starting[0] +
        type +
        CM.console.starting[1] +
        JSON.stringify(dataset.id)
    );
  }
};

export {
  categoryLoader,
  listTableDatasets,
  setTypeSelector,
  typeSelector,
  currentType,
  resetCategoryStyle,
};
