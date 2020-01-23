
const userDataPath = remote.app.getPath("userData"); // Find userData folder Path


var CM = CMT["EN"];

var divs = document.querySelectorAll("section")

const populateTutorial = divs => {
    divs.forEach(div=>{
        div.innerHTML=CM.tutorial.sections[div.id]
    })
}

// =========== LANGUAGE SELECTION ===========

fs.readFile(userDataPath + "/userID/user-id.json", "utf8",     // Check if the user uses another one
      (err, data) => {
        data = JSON.parse(data);
        CM = CMT[data.locale];
        populateTutorial(divs);
        const svg = d3.select("svg");
        drawFlux(svg, traces, false, true);
      })

document.getElementById("lang").childNodes.forEach(lg=>{
  lg.addEventListener("click",e=>{
    CM=CMT[lg.innerText];
    populateTutorial(divs);
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
