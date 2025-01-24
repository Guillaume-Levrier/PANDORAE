//========== zoteroCollectionRetriever ==========
// Retrieve collections from a Zotero user code. To be noted that a user code can be something else than a user: it can
// also be a group library ID, allowing for group or even public work on a same Zotero/PANDORÆ corpus.

import { CM } from "../locales/locales";
import { displayCorpusList } from "./dataset/corpus-display";

import { checkKey, getPassword, userData } from "./userdata";

const zoteroCollectionRetriever = (options) => {
  // Get the config file with the library IDs and API key

  const config = options.config;

  // prepare the result div by purging it of its potential content
  const userCollectionsDiv = options.resultDiv;
  userCollectionsDiv.style.display = "block";
  userCollectionsDiv.innerHTML = `${CM.flux.tabs.zotero.disclaimers.jointImport}<br><br>`;

  config.library.forEach((libraryID) => {
    window.electron.send("console-logs", `Retrieving library ${libraryID}`); // Log collection request

    const url = `https://api.zotero.org/groups/${libraryID}/collections?v=3&key=${config.apikey}`;
    fetch(url)
      .then((r) => r.json())
      .then((r) => {
        const zoteroColResponse = r;

        console.log(zoteroColResponse);

        // create import buttons

        const importDiv = document.createElement("div");
        importDiv.style.padding = "1rem";

        if (config.library.length > 1) {
          userCollectionsDiv.append(document.createElement("hr"));
        }

        const libTitle = document.createElement("div");
        libTitle.style =
          "font-weight:bold;font-size:13px;margin-bottom:1rem;margin-top:1rem;";
        libTitle.innerText = r[0].library.name;

        userCollectionsDiv.append(libTitle);

        // add list

        const collection = [];

        for (let i = 0; i < zoteroColResponse.length; i++) {
          const key = zoteroColResponse[i].data.key;
          const name = zoteroColResponse[i].data.name;

          collection.push({ key, name });
        }
        userCollectionsDiv.append(importDiv);

        const corpusOptions = {
          type: "zotero",
          libraryID,
        };

        displayCorpusList(
          collection,
          userCollectionsDiv,
          importDiv,
          corpusOptions,
          true
        );

        userCollectionsDiv.style.display = "block";
      })
      .catch((e) => {
        console.log(e);
      });
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
