//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

import bottleneck from "bottleneck";
import { dataWriter, getPasswordFromChaeros } from "./chaeros-to-system";
import { pandodb } from "../db";

const zoteroItemsRetriever = (collections, zoteroUser, importName) => {
  window.electron.send(
    "console-logs",
    "Started retrieving collections " +
      collections +
      "for user " +
      zoteroUser +
      " under the import name " +
      importName +
      " into SYSTEM."
  );

  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 500, // Every 500 milliseconds
  });

  const zoteroPromises = [];

  const zoteroApiKey = getPasswordFromChaeros("Zotero", zoteroUser);

  for (let j = 0; j < collections.length; j++) {
    // Loop on collections

    // URL Building blocks
    let rootUrl = "https://api.zotero.org/groups/";
    let urlBase = "/collections/" + collections[j].key;
    let collectionComp = "&v=3&key=";

    let zoteroCollectionRequest =
      rootUrl + zoteroUser + urlBase + "?" + collectionComp + zoteroApiKey; // Build the url

    zoteroPromises.push(zoteroCollectionRequest); // Push promise in the relevant array
  }

  var zoteroCollectionResponse = [];

  let responseTarget = 0;
  let responseAmount = 0;

  zoteroPromises.forEach((d) => {
    limiter
      .schedule(() => fetch(d))
      .then((res) => res.json())
      .then((result) => {
        zoteroCollectionResponse.push(result);

        if (zoteroCollectionResponse.length === zoteroPromises.length) {
          zoteroCollectionResponse.forEach((f) => {
            var thisCollectionAmount = parseInt(f.meta.numItems);
            responseTarget = responseTarget + thisCollectionAmount;

            f.name = f.data.name;
            f.items = [];

            let itemRequests = [];

            for (var i = 0; i < f.meta.numItems; i += 100) {
              let rootUrl = "https://api.zotero.org/groups/";
              let urlBase = "/collections/" + f.data.key;
              var zoteroVersion =
                "/items/top?&v=3&format=csljson&start=" + i + "&limit=100&key=";
              let zoteroItemsRequest =
                rootUrl + zoteroUser + urlBase + zoteroVersion + zoteroApiKey;

              itemRequests.push(zoteroItemsRequest);
            }

            itemRequests.forEach((d) => {
              limiter
                .schedule(() => fetch(d))
                .then((res) => res.json())
                .then((response) => {
                  response.items.forEach((d) => {
                    if (d.hasOwnProperty("shortTitle")) {
                      //var enrichment = ;
                      if (d.shortTitle[0] === "{") {
                        d.enrichment = JSON.parse(d.shortTitle);
                      }
                      //if (d.enrichment.hasOwnProperty("altmetric")) {
                      //  d.enrichment.altmetric = JSON.parse(d.enrichment.altmetric);
                      //}
                    }
                    f.items.push(d);

                    responseAmount++;
                    window.electron.send(
                      "chaeros-notification",
                      "Loading " +
                        responseAmount +
                        " of " +
                        responseTarget +
                        " documents."
                    );

                    if (responseAmount === responseTarget) {
                      dataWriter(
                        ["system"],
                        importName,
                        zoteroCollectionResponse
                      );
                    }
                  });
                });
            });
          });
        }
      });
  });
};

//========== zoteroCollectionBuilder ==========
// zoteroCollectionBuilder creates a new collection from a CSL-JSON dataset.

const zoteroCollectionBuilder = (collectionName, zoteroUser, id) => {
  window.electron.send(
    "console-logs",
    "Building collection" +
      collectionName +
      " for user " +
      zoteroUser +
      " in path " +
      id
  );

  window.electron.send(
    "chaeros-notification",
    "Creating collection " + collectionName
  ); // Send message to main Display

  const colName = collectionName;

  pandodb.csljson.get(id).then((data) => {
    var file = data.content;

    try {
      // If the file is valid, do the following:

      let zoteroApiKey = getPassword("Zotero", zoteroUser);

      // URL Building blocks
      var rootUrl = "https://api.zotero.org/groups/";
      var collectionCreationUrl =
        rootUrl + zoteroUser + "/collections?&v=3&key=" + zoteroApiKey;

      var collectionItem = [{ name: "", parentCollection: "" }]; // Create the Collection item to be sent
      collectionItem[0].name = collectionName;

      let collectionCode = { code: "" };

      fetch(collectionCreationUrl, {
        method: "POST",
        body: JSON.stringify(collectionItem),
      })
        .then((res) => res.json())
        .then((collectionName) => {
          collectionCode.code = collectionName.success["0"]; // Retrieve name from the response

          let fileArrays = []; // Create empty array

          file.forEach((d) => {
            // For each file object
            d.collections = []; // Create a "collections" property
            d.collections.push(collectionCode.code); // Push the collection code attributed by Zotero
          });

          for (let i = 0; i < file.length; i += 50) {
            // Only 50 items can be sent per request
            let subArray = { items: [] }; // Create subArray item
            let limit = i + 50; // The upper limit is start + 50 items
            for (let j = i; j < limit; j++) {
              // Iterate on items to be sent
              if (file[j]) {
                subArray.items.push(file[j]); // Push files in subarray
              }
            }
            fileArrays.push(subArray); // Push subArray in fileArrays
          }

          let fetchTargets = [];

          fileArrays.forEach((d) => {
            fetchTargets.push({
              uri: rootUrl + zoteroUser + "/items?&v=3&key=" + zoteroApiKey,
              body: d.items,
            });
          });

          const limiter = new bottleneck({
            // Create a bottleneck to prevent hitting API rate limits
            maxConcurrent: 1, // Only one request at once
            minTime: 200, // Every 200 milliseconds
          });

          let resultList = [];

          let count = 0;

          fetchTargets.forEach((d) => {
            limiter
              .schedule(() =>
                fetch(d.uri, {
                  method: "POST",
                  body: JSON.stringify(d.body),
                })
              )
              .then((res) => res.json())
              .then((result) => {
                resultList.push(result);

                count++;

                window.electron.send(
                  "chaeros-notification",
                  `Uploading ${colName} - (${count}/${fileArrays.length})`
                );
                if (resultList.length === fileArrays.length) {
                  setTimeout(() => {
                    window.electron.send(
                      "chaeros-notification",
                      "Collection created"
                    ); // Send success message to main Display
                    window.electron.send("pulsar", true);
                    window.electron.send("win-destroy", winId);
                  }, 2000);
                } // If all responses have been recieved, delay then close chaeros
              })
              .catch((e) => window.electron.send("console-logs", e));
            window.electron.send(
              "console-logs",
              "Collection " + JSON.stringify(collectionName) + " built."
            ); // Send success message to console
          });
        });
    } catch (e) {
      window.electron.send("console-logs", e);
    }
  });
};

export { zoteroItemsRetriever, zoteroCollectionBuilder };
