// text
//const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path

var CM = CMT["EN"];

const populateTutorial = () => {
  for (let sect in CM.tutorial.sections) {
    let section = document.createElement("SECTION");
    section.id = sect;
    section.className += "step";
    section.innerHTML = CM.tutorial.sections[sect];

    document.getElementById("slideSections").appendChild(section);
  }

  let links = document.getElementById("slideSections").querySelectorAll("A");

  for (let link of links) {
    link.addEventListener("click", (e) => {
      switch (link.dataset.action) {
        case "scroll":
          smoothScrollTo(link.dataset.target);
          break;

        case "tuto":
          tuto(link.dataset.target);
          break;

        case "openEx":
          ipcRenderer.invoke("openEx", link.dataset.target);
          break;

        case "lastScroll()":
          lastScroll();
          break;
      }
    });
  }
};

window.addEventListener("load", (e) => {
  populateTutorial();
  const svg = d3.select("svg");
  drawFlux(svg, traces, false, true);

  // =========== LANGUAGE SELECTION ===========

  const fs = require("fs");
  const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path

  fs.readFileSync(
    userDataPath + "/PANDORAE-DATA/userID/user-id.json",
    "utf8", // Check if the user uses another one
    (err, data) => {
      data = JSON.parse(data);
      CM = CMT[data.locale];
      populateTutorial();
      const svg = d3.select("svg");
      drawFlux(svg, traces, false, true);
    }
  );

  document.getElementById("lang").childNodes.forEach((lg) => {
    lg.addEventListener("click", (e) => {
      CM = CMT[lg.innerText];
      populateTutorial();
      const svg = d3.select("svg");
      drawFlux(svg, traces, false, true);
      fs.readFile(
        userDataPath + "/PANDORAE-DATA/userID/user-id.json",
        "utf8",
        (err, data) => {
          data = JSON.parse(data);
          data.locale = lg.innerText;
          data = JSON.stringify(data);
          fs.writeFile(
            userDataPath + "/PANDORAE-DATA/userID/user-id.json",
            data,
            "utf8",
            (err) => {
              if (err) throw err;
            }
          );
        }
      );
    });
  });
});
