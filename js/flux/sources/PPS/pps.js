//========== PROBLEMATIC PAPER SCREENER ==========

const updatePPSDate = (date) => {
  if (date > 0) {
    document.getElementById(
      "pps-last-updated"
    ).innerText = `The PPS list available to your instance of PANDORÆ was downloaded on ${new Date(
      date
    ).toLocaleString()}.`;
  } else {
    document.getElementById("pps-last-updated").innerText =
      "No PPS list found. Please click below to download the list.";

    document.getElementById("forceUpdatePPS").innerText = "Download PPS list";
  }
};
const forceUpdatePPS = () => {
  window.electron.send("forceUpdatePPS", true);

  document.getElementById("pps-last-updated").innerText =
    "You have just triggered a forced update. Please wait until the update is finished.";

  window.electron.send("windowManager", "closeWindow", "flux");
};

window.electron.forcedPPSupdateFinished(() => {
  document.getElementById("pps-last-updated").innerText =
    "Update finished. The PPS list available to your PANDORÆ instance was updated just now.";
});

const checkPPS = () => {
  const id = document.getElementById("system-dataset-preview").name;

  const button = document.getElementById("checkPPS");
  button.innerText = "Loading";
  const PPSdata = [];
  const dois = [];

  var count = 0;

  pandodb.system
    .get(id)
    .then((data) => {
      data.content.forEach((d) => {
        d.items.forEach((item) => {
          if (item.hasOwnProperty("DOI")) {
            dois.push(item.DOI);
          }
        });
      });
    })
    .then(() =>
      window.electron.invoke("getPPS", true).then((ppsFile) => {
        fs.createReadStream(ppsFile) // Read the flatfile dataset provided by the user
          .pipe(csv()) // pipe buffers to csv parser
          .on("data", (data) => {
            count++;
            if (count % 7) {
              button.innerText = "Loading " + count;
            }
            PPSdata.push(data);
          })
          .on("end", () => {
            const targets = [];
            PPSdata.forEach((pps) => {
              if (dois.some((t) => t === pps.Doi)) {
                targets.push(pps);
              }
            });

            const problematics = document.getElementById("problematics");
            problematics.style.display = "flex";

            if (targets.length === 0) {
              problematics.innerText = "No problematic paper found.";
            } else {
              targets.forEach((t) => {
                const container = document.createElement("div");
                container.style =
                  "display:inline-flex;margin-top:3px;justify-content: space-around;border-top:1px dashed gray;text-align: center;";

                problematics.append(container);

                const detectors = document.createElement("div");
                detectors.style = "color:red;padding:2px;width:20%;";
                detectors.innerText = t.Detectors;

                const title = document.createElement("div");
                title.style =
                  "padding:2px; width:60%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;";
                title.innerText = t.Title;

                const linkcontainer = document.createElement("div");
                linkcontainer.style =
                  "padding:2px;width:20%;word-break: break-all;";

                const anchor = document.createElement("a");
                linkcontainer.append(anchor);
                anchor.style = "text-decoration:underline";
                anchor.innerText = t.Doi;
                anchor.addEventListener("click", () =>
                  window.electron.invoke(
                    "openEx",
                    `https://dbrech.irit.fr/pls/apex/f?p=9999:3::::RIR:IREQ_DOI:${t.Doi}`
                  )
                );

                container.append(detectors, title, linkcontainer);
              });
            }

            button.innerText = "Check PPS";
          })
          .catch((e) => console.log(e));
      })
    );
};

export { checkPPS, forceUpdatePPS, updatePPSDate };
