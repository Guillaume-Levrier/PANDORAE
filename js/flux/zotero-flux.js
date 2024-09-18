//========== zoteroCollectionRetriever ==========
// Retrieve collections from a Zotero user code. To be noted that a user code can be something else than a user: it can
// also be a group library ID, allowing for group or even public work on a same Zotero/PANDORÆ corpus.

import { fluxButtonAction } from "./actionbuttons";
import { powerValve } from "./powervalve";
import { checkKey, getPassword } from "./userdata";

const zoteroCollectionRetriever = (options) => {
  let zoteroUser = document.getElementById("zoterouserinput").value; // Get the Zotero user code to request

  // hide the validator icon
  const icon = document.getElementById("zoteroAPIValidation");
  icon.innerText = "hourglass_empty";

  window.electron.send(
    "console-logs",
    "Retrieving collections for Zotero id " + zoteroUser
  ); // Log collection request

  let zoteroApiKey = getPassword("Zotero", zoteroUser);
  // URL Building blocks
  let rootUrl = "https://api.zotero.org/groups/";
  let urlCollections = "/collections";
  var zoteroVersion = "v=3&key=";

  //build the url
  let zoteroCollectionRequest =
    rootUrl + zoteroUser + urlCollections + "?" + zoteroVersion + zoteroApiKey;

  // select container div
  const userCollections = options.resultDiv;

  // purge it of content
  userCollections.innerHTML = "";

  fetch(zoteroCollectionRequest)
    .then((res) => res.json())
    .then((zoteroColResponse) => {
      // With the response

      // create import buttons
      const importDiv = document.createElement("div");
      importDiv.style.padding = "1rem";

      const importName = document.createElement("input");
      importName.className = "fluxInput";
      importName.spellcheck = false;
      importName.type = "text";
      importName.placeholder = "Enter import name";
      importName.id = "zoteroImportName";

      const importButton = document.createElement("button");
      importButton.className = "flux-button";
      importButton.type = "submit";
      importButton.innerText = "Import selected collections into system";

      importButton.addEventListener("click", () => {
        powerValve("zoteroItemsRetriever", {
          name: "Zotero Collection Retriever",
        });
      });

      importDiv.append(importName, importButton);

      // add list
      const collectionList = document.createElement("form");
      collectionList.style = "line-height:1.5";

      userCollections.append(collectionList);

      for (let i = 0; i < zoteroColResponse.length; i++) {
        const checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.className = "zotColCheck";
        checkInput.value = zoteroColResponse[i].data.key;
        checkInput.name = zoteroColResponse[i].data.name;

        const checkLabel = document.createElement("label");
        checkLabel.style.paddingLeft = "5px";
        checkLabel.innerText =
          zoteroColResponse[i].data.key +
          " - " +
          zoteroColResponse[i].data.name;

        checkInput.addEventListener("change", () => {
          if (checkInput.checked) {
            importName.value += zoteroColResponse[i].data.name;
          } else {
            importName.value = importName.value.replace(
              zoteroColResponse[i].data.name,
              ""
            );
          }
        });

        collectionList.append(
          checkInput,
          checkLabel,
          document.createElement("br")
        );
      }

      userCollections.append(importDiv);

      userCollections.style.display = "block";

      checkKey("zoteroAPIValidation", true);
    })
    .catch(function (err) {
      console.log(err);
      userCollections.innerHTML = "Failed retrieving data from Zotero";
      userCollections.style.display = "block";
      checkKey("zoteroAPIValidation", false);
      fluxButtonAction(
        "zotcolret",
        false,
        "Failed at retrieving Zotero collections",
        err
      );
      window.electron.send(
        "console-logs",
        "Error in retrieving collections for Zotero id " +
          zoteroUser +
          " : " +
          err
      ); // Log error
    });
};

//========== zoteroLocalRetriever ==========
// This would need a custom zotero plugin - post v 1.0
// more info here https://www.zotero.org/support/dev/client_coding/connector_http_server
// and here https://github.com/zotero/zotero-connectors

const zoteroLocalRetriever = () => {
  window.electron.send("console-logs", "Retrieving local Zotero collections."); // Log collection request

  let zoteroApiKey = getPassword("Zotero", zoteroUser);

  // URL Building blocks
  let rootUrl = "http://127.0.0.1:23119/";

  //build the url
  let zoteroCollectionRequest = rootUrl;

  fetch(zoteroCollectionRequest)
    .then((res) => res.json())
    .then((zoteroColResponse) => {
      // With the response

      let collections = []; // Create empty 'collections' array

      for (let i = 0; i < zoteroColResponse.length; i++) {
        // Loop on the response
        let coll = {}; // Create an empty object
        coll.key = zoteroColResponse[i].data.key; // Fill it with this collection's key
        coll.name = zoteroColResponse[i].data.name; // Fill it with this collection's name
        collections.push(
          // Push a string (HTML input list) in the collections array
          "<input class='zotColCheck' value='" +
            coll.key +
            "' name='" +
            coll.name +
            "' type='checkbox'/><label> " +
            coll.key +
            " - " +
            coll.name +
            "</label><br> "
        );
      }

      var collectionList = ""; // Create the list as a string
      for (var k = 0; k < collections.length; ++k) {
        // For each element of the array
        collectionList = collectionList + collections[k]; // Add it to the string
      }

      // Display full list in div
      document.getElementById("userZoteroCollections").innerHTML =
        "<form style='line-height:1.5'>" + collectionList + "</form>";

      // Show success on button
      fluxButtonAction(
        "zotcolret",
        true,
        "Zotero Collections Successfully Retrieved",
        "errorPhrase"
      );

      // Preparing and showing additional options
      document.getElementById("zotitret").style.display = "inline-flex";
      document.getElementById("zoteroResults").style.display = "flex";
      document.getElementById("zoteroImportName").style.display = "inline-flex";
      document.getElementById("zoteroImportInstruction").style.display =
        "inline-flex";

      checkKey("zoteroAPIValidation", true);
    })
    .catch((err) => {
      console.log(err);
      /*   fluxButtonAction ("zotcolret",false,"Zotero Collections Successfully Retrieved",err);
          window.electron.send('console-logs',"Error in retrieving collections for Zotero id "+ zoteroUser + " : "+err); //  */
    });
};

export { zoteroCollectionRetriever, zoteroLocalRetriever };
