
const userDataPath = remote.app.getPath("userData"); // Find userData folder Path


var CM = CMT["EN"];

const populateTutorial = () => {

  for (let sect in CM.tutorial.sections) {
    let section = document.createElement("SECTION");
        section.id = sect;
        section.className += "step";
        section.innerHTML=CM.tutorial.sections[sect];

    document.getElementById("slideSections").appendChild(section);
  }
}

// =========== LANGUAGE SELECTION ===========

populateTutorial();
const svg = d3.select("svg");
drawFlux(svg, traces, false, true);

fs.readFileSync(userDataPath + "/userID/user-id.json", "utf8",     // Check if the user uses another one
      (err, data) => {
        data = JSON.parse(data);
        CM = CMT[data.locale];
        populateTutorial();
        const svg = d3.select("svg");
        drawFlux(svg, traces, false, true);
      })

document.getElementById("lang").childNodes.forEach(lg=>{
  lg.addEventListener("click",e=>{
    CM=CMT[lg.innerText];
    populateTutorial();
    const svg = d3.select("svg");
        drawFlux(svg, traces, false, true);
    fs.readFile(userDataPath + "/userID/user-id.json", "utf8",
      (err, data) => {
        data = JSON.parse(data);
        data.locale=lg.innerText;
        data = JSON.stringify(data);
        fs.writeFile(userDataPath + "/userID/user-id.json", data, "utf8", err => {
          if (err) throw err;
        });
      })
  })
})
