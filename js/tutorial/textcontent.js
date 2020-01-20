
const userDataPath = remote.app.getPath("userData"); // Find userData folder Path


var CM = CMT["EN"];

var divs = ['s1','s2','s3']

const populateTutorial = divs => {
    divs.forEach(div=>{
        document.getElementById(div).innerHTML=CM.tutorial.sections[div]
    })
}

/* document.getElementById("s1").innerHTML = CM.tutorial.sections.s1;
document.getElementById("s2").innerHTML = CM.tutorial.sections.s2;
document.getElementById("s3").innerHTML = CM.tutorial.sections.s3;
 */
// =========== LANGUAGE SELECTION ===========

fs.readFile(userDataPath + "/userID/user-id.json", "utf8",     // Check if the user uses another one
      (err, data) => {
        data = JSON.parse(data);
        CM = CMT[data.locale];
        populateTutorial(divs);
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
