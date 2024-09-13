const typeSelect = () => {
  toggleMenu();
  typeSelector = true;
  categoryLoader("type");
};

var menuIcon, consoleIcon;

let notLoadingMenu = true;

const categoryLoader = (cat) => {
  if (notLoadingMenu) {
    purgeMenuItems("secMenContent");

    notLoadingMenu = false;

    let blocks;

    switch (cat) {
      case "type":
        blocks = [
          "regards",
          "chronotype",
          "geotype",
          "anthropotype",
          "archotype",
          "gazouillotype",
          "hyphotype",
          "doxatype",
          "filotype",
          "pharmacotype",
          "fieldotype",
        ];
        let loadingCount = 0;
        window.electron.send("console-logs", "Displaying available types");
        blocks.forEach((block) => {
          pandodb[block].count().then((thisBlock) => {
            if (thisBlock > 0) {
              let typeContainer = document.createElement("div");
              typeContainer.style.display = "flex";
              typeContainer.style.borderBottom =
                "1px solid rgba(192,192,192,0.3)";
              typeContainer.id = block;
              typeContainer.className += "tabs menu-item";
              typeContainer.innerText = block;
              typeContainer.addEventListener("click", (e) => {
                mainDisplay(block);
              });
              document
                .getElementById("secMenContent")
                .appendChild(typeContainer);
              loadingCount += 1;
              if (loadingCount === blocks.length) {
                notLoadingMenu = false;
              } else {
                notLoadingMenu = true;
              }
            }
          });
        });
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

const listTableDatasets = (table) => {
  let targetType = pandodb[table];

  targetType.toArray().then((e) => {
    if (e.length === 0) {
      pulse(10, 1, 1, true);
      field.value = "no dataset in " + table;
      window.electron.send("console-logs", "No dataset in " + table);
    } else {
      e.forEach((d) => {
        // datasetContainer
        let datasetContainer = document.createElement("div");
        datasetContainer.style.display = "flex";
        datasetContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
        document
          .getElementById("thirdMenuContent")
          .appendChild(datasetContainer);

        // Dataset
        let dataset = document.createElement("div");
        dataset.className = "secContentTabs";
        dataset.id = d.id;
        dataset.innerHTML =
          "<span><strong>" + d.name + "</strong><br>" + d.date + "</span>";
        if (table === "slider") {
          dataset.onclick = function () {
            populateSlides(d.id);
            toggleMenu();
          };
        } else {
          dataset.onclick = function () {
            selectOption(table, d.id);
          };
        }

        datasetContainer.appendChild(dataset);

        // Remove dataset
        let removeDataset = document.createElement("div");
        removeDataset.className = "secContentDel";
        removeDataset.id = "del" + d.id;
        removeDataset.innerHTML =
          "<span><strong><i class='material-icons'>delete_forever</i></strong><br></span>";
        if (table === "slider") {
          removeDataset.onclick = () => {
            pandodb.slider.delete(d.id);
            document
              .getElementById("thirdMenuContent")
              .removeChild(datasetContainer);
            field.value = "dataset removed from slider";
            window.electron.send(
              "console-logs",
              "Removed " + d.id + " from slider database"
            );
          };
        } else {
          removeDataset.onclick = () => {
            pandodb[table].delete(d.id);
            document
              .getElementById("thirdMenuContent")
              .removeChild(datasetContainer);
            field.value = "dataset removed from " + table;
            window.electron.send(
              "console-logs",
              "Removed " + d.id + " from database: " + table
            );
          };
        }
        datasetContainer.appendChild(removeDataset);
      });
    }
  });
};
