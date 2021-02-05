const { ipcRenderer } = require("electron");

const goBack = (slide) => {
  ipcRenderer.send("window-manager", "closeWindow", "flux");
  ipcRenderer.send("mainWindowReload", "reload");
  ipcRenderer.send("window-manager", "openModal", "tutorial", slide);
  ipcRenderer.send("window-manager", "closeWindow", "tutorialHelper");
};

let fluxContent =
  "<br><br>You can now use the menu.<br><br>" +
  " Click on the blinking menu button to do so.<br><br>" +
  "Select the 'Flux' tab to open Flux.<br><br> You can explore the different options by clicking on the available tabs.<br><br>" +
  "Once you are done exploring, click <a data-target='flux'>here</a> to go back to the tutorial and learn more about the Flux features and options.";

let zoteroImport =
  "<br><br>Let's now import sample data from Zotero to PANDORÆ.<br><br>" +
  "Go back to Flux, and go to the USER tab. <br><br>" +
  "You can then enter the coordinates of the following library.<br><br>" +
  "<i>Zotero group id:</i> <span style='font-family:monospace;'>2301232</span><br><br>" +
  "Press 'Update User Crendentials', and then enter the API key.<br><br>" +
  "<i>Zotero API key:</i> <span style='font-family:monospace;'>cyEn5eKACVuNTABpwtAp4V4C</span>.<br><br>" +
  "Press the Update <i class='material-icons'>cached</i> button.<br><br>" +
  "The Zotero Tab should now display three sample collections.<br><br>" +
  "Import each in the system, then go to the System Tab.<br><br>" +
  "Import the 'intersection' dataset in 'geotype'. Name it like you want.<br><br>" +
  "Import the 'Controversy' dataset in 'anthropotype'. Name it like you want.<br><br>" +
  "Now Import the other two datasets <strong>at once</strong> in 'chronotype'.<br><br>" +
  "Click <a data-target='Zotero2'>here</a> to go back to the tutorial.";

let chronotype =
  "<br><br>Open the menu again.<br><br>" +
  "Click on 'Type -> Chronotype' to display available datasets <br><br>" +
  "Click on the sample dataset you previously imported in there from Zotero through Flux.<br><br>" +
  "Click <a data-target='chronotype'>here</a> to go back to the tutorial.";

let geotype =
  "<br><br>Open the menu once again.<br><br>" +
  "Click on 'Type -> Geotype' to display available datasets <br><br>" +
  "Click on the sample dataset you previously imported in there from Zotero through Flux.<br><br>" +
  "Click <a data-target='geotype'>here</a> to go back to the tutorial.";

let anthropotype =
  "<br><br>Open the menu once again.<br><br>" +
  "Click on 'Type -> Anthropotype' to display available datasets <br><br>" +
  "Click on the sample dataset you previously imported in there from Zotero through Flux.<br><br>" +
  "Click <a data-target='anthropotype'>here</a> to go back to the tutorial.";

ipcRenderer.on("tutorial-types", (event, message) => {
  let content = document.createElement("div");
  content.style.padding = "10px";

  switch (message) {
    case "flux":
      content.innerHTML = fluxContent;
      break;
    case "zoteroImport":
      content.innerHTML = zoteroImport;
      break;
    case "chronotype":
      content.innerHTML = chronotype;
      break;
    case "geotype":
      content.innerHTML = geotype;
      break;

    case "anthropotype":
      content.innerHTML = anthropotype;
      break;
  }

  document.body.appendChild(content);
});

window.addEventListener("load", (e) => {
  setTimeout(() => {
    let links = document.body.querySelectorAll("A");

    for (let link of links) {
      link.addEventListener("click", (e) => {
        goBack(link.dataset.target);
      });
    }
  }, 600);
});
