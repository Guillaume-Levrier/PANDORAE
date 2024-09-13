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
  "You can then enter the coordinates of your Zotero group library.<br><br>" +
  "This id is in the URL of the group <span style='font-family:monospace;'>https://www.zotero.org/groups/<strong>GROUP_ID</strong>/my-great-library</span><br><br>" +
  "Press 'Update User Crendentials', and then enter the group's read/write API key.<br><br>" +
  "Press the Update <i class='material-icons'>cached</i> button.<br><br>" +
  "The Zotero Tab should now display the library's collections if there are any.<br><br>" +
  "Click <a data-target='Zotero2'>here</a> to go back to the tutorial.";

/* let chronotype =
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
 */
let istexRequest = `<br><br>Let's now learn how to send a request to ISTEX.<br><br>
  Go back to FLUX, but this time select the ISTEX tab.<br><br>
  For the sake of this exercise, we will use a smaller request, though a larger one may work.<br><br>
  Type <span style='font-family:monospace;'>"Phengaris arion"</span> (quotes included) and click "retrieve basic info".<br><br>
  This request should yield between 15 and 20 documents.<br><br>
  If this is indeed the case, click "Submit ISTEX Query".<br><br>
  When the main screen shows the data has been retrieved, 
  click <a data-target='Zotero3'>here</a> to go back to the tutorial.
  `;

let sendToZotero = `Let's now learn how to send our retrieved data to our Zotero library.<br><br>
This really is two steps: first convert to CSL-JSON, a format Zotero understands, and then proceed with the shipping.<br><br>
Open once again FLUX and go to the <strong>CSL-JSON tab</strong>. <br><br> 
Click on your "Phengaris arion" dataset, and click on the "Convert to CSL" button.<br><br> 
Once the "Dataset converted" message appears again, open Flux again.<br><br>
Go to the <strong>Zotero tab</strong> and click on the "Display available csljson files" button.<br><br> 
Click on your "Phengaris arion" dataset, <strong>add a collection name</strong>, and click "Create a new Zotero Collection".<br><br> 
Now go on your Zotero account and check that the collection appears in your library. 
Click <a data-target='Chapter2'>here</a> to go back to the tutorial and learn how to reimport this data in PANDORÆ.<br><br> 
`;

let reImportToSystem = `<br><br>Let's now learn how to re-import data from our Zotero library.<br><br>
Go back to FLUX, select the Zotero tab, and click on "Display online library collections".<br><br>
This will show your available collections. If you imported data in Chapter 1, select the Phengaris dataset.
Else, choose one of your collections. For the sake of this tutorial, please keep it small (lower than 200 items).<br><br>
Click "import selected collections into system", and then click <a data-target='typeSelect'>here</a> to go back to the tutorial.
<br><br>

`;

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
    case "istexRequest":
      content.innerHTML = istexRequest;
      break;

    case "sendToZotero":
      content.innerHTML = sendToZotero;
      break;

    case "reImportToSystem":
      content.innerHTML = reImportToSystem;
      break;
    /* 
    case "chronotype":
      content.innerHTML = chronotype;
      break;
    case "geotype":
      content.innerHTML = geotype;
      break;

    case "anthropotype":
      content.innerHTML = anthropotype;
      break; */
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
