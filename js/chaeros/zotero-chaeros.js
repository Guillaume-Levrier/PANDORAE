//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

import bottleneck from "bottleneck";
import { dataWriter, genDate } from "./chaeros-to-system";

import { userData } from "./chaeros-userdata";

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

  const zoteroApiKey = userData.distantServices.zotero.apikey;

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

                    const updateMessage = `Loading ${responseAmount}/${responseTarget}`;

                    window.electron.send("chaeros-notification", updateMessage);

                    if (responseAmount === responseTarget) {
                      const date = genDate();
                      const name = importName;
                      const id = `${name}-${date}`;

                      const dataset = {
                        id,
                        source: "zotero",
                        date,
                        name,
                        data: zoteroCollectionResponse,
                      };

                      // send dataset to be saved
                      dataWriter(["standard"], dataset);

                      // stop pulsar
                      window.electron.send("pulsar", true);

                      // destroy this chaeros window
                      window.electron.send("win-destroy", true);
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

const zoteroCollectionBuilder = (dataset) => {
  console.log("=== STARTING COLLECTION BUILDER ===");

  console.log(dataset);

  const colName = dataset.name;

  const zoteroApiKey = userData.distantServices.zotero.apikey;

  window.electron.send("console-logs", "Building collection" + colName);

  window.electron.send(
    "chaeros-notification",
    "Creating collection " + colName
  ); // Send message to main Display

  var file = dataset.dataset.data;

  try {
    const collectionCreationUrl = `https://api.zotero.org/groups/${dataset.id}/collections?&v=3&key=${zoteroApiKey}`;

    var collectionItem = [{ name: colName, parentCollection: "" }]; // Create the Collection item to be sent

    let collectionCode = { code: "" };

    const noteMap = {};

    fetch(collectionCreationUrl, {
      method: "POST",
      body: JSON.stringify(collectionItem),
    })
      .then((res) => res.json())
      .then((collectionName) => {
        console.log("===  COLLECTION CREATED ===");
        console.log(collectionName);

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
              const thisfile = file[j];
              const note = thisfile.note;
              noteMap[thisfile.shortTitle] = note;
              delete thisfile.note;
              subArray.items.push(thisfile); // Push files in subarray
            }
          }
          fileArrays.push(subArray); // Push subArray in fileArrays
        }

        let fetchTargets = [];

        fileArrays.forEach((d) => {
          fetchTargets.push({
            uri: `https://api.zotero.org/groups/${dataset.id}/items?&v=3&key=${zoteroApiKey}`,
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

        console.log("=== PACKAGES ===");
        console.log(fetchTargets);

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
              const idList = Object.values(result.success);

              //result.forEach((d) => resultList.push(...d.body));

              resultList.push(...idList);

              count++;

              console.log(resultList);

              console.log(file);

              if (resultList.length === file.length) {
                // NEW PART
                // UPLOAD A NOTE
                // INSTEAD OF HACKING
                // SHORTTITLE

                // get documents page by page
                // and add the note.

                let notecount = 0;

                const addNoteToDoc = (itemID) => {
                  const url = `https://api.zotero.org/groups/${dataset.id}/items/${itemID}?&v=3&key=${zoteroApiKey}`;

                  console.log(itemID);
                  console.log(url);

                  fetch(url)
                    .then((r) => r.json())
                    .then((r) => {
                      const id = r.data.shortTitle;
                      const note = noteMap[id];
                      note.parentItem = r.key;

                      limiter.schedule(() =>
                        fetch(
                          `https://api.zotero.org/groups/${dataset.id}/items?&v=3&key=${zoteroApiKey}`,
                          {
                            method: "POST",
                            body: JSON.stringify([note]),
                          }
                        )
                          .then((r) => r.json())
                          .then((r) => {
                            notecount++;
                            window.electron.send(
                              "chaeros-notification",
                              `Uploading note (${notecount}/${resultList.length})`
                            );

                            if (notecount === resultList.length) {
                              setTimeout(() => {
                                window.electron.send(
                                  "chaeros-notification",
                                  "Collection created"
                                ); // Send success message to main Display
                                window.electron.send("pulsar", true);
                              }, 2000);
                            }
                          })
                      );
                    });
                };
                resultList.forEach((d) => addNoteToDoc(d, noteMap));
              } // If all responses have been received, delay then close chaeros
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
};

export { zoteroItemsRetriever, zoteroCollectionBuilder };
