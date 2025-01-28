//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

import bottleneck from "bottleneck";
import { dataWriter, genDate } from "./chaeros-to-system";

import { userData } from "./chaeros-userdata";
//===== Zotero Items Retrievers =====
// Items here are documents but not only.
// The idea is to take an array of collections (often one, sometimes more)
// and retrieve not only all the document metadata but also the notes (which
// can contain non-CSL metadata but also potentially the partial or full content)
// of the documents.
//
// This is tricky because of the "potentially several" collections and the
// "not only metadata but also notes" parts that can build onto one another and
// end up sending a lot of async API calls to Zotero and make it unfriendly.
//

/*
 *   THE SOLUTION HERE IS TO LOOK FOR ALL NON-ATTACHMENTS AND
 *   THEN ALL THE ATTACHMENTS.
 *
 */

const zoteroItemsRetriever = (data) => {
  // find which collections to call
  const collections = Object.values(data.collections);

  // find the name of the result dataset
  const importName = data.importName;

  // signal that the chaeros heavy lifting is starting
  window.electron.send("console-logs", "Started retrieving collections ");

  // Create a bottleneck to prevent API rate limit
  const limiter = new bottleneck({
    maxConcurrent: 1, // Only one request at once
    minTime: 500, // Every 500 milliseconds
  });

  const zoteroPromises = [];

  // Find the relevant zotero API key.
  var zoteroApiKey;

  // The trick here is that even if the user is targetting several
  // collections, they have to belong the same (group) library.
  userData.distantServices.forEach((service) => {
    if (service.serviceType === "zotero") {
      service.serviceConfig.library.forEach((lib) => {
        if (lib === data.libraryID) {
          zoteroApiKey = service.serviceConfig.apikey;
        }
      });
    }
  });

  // At this point we have the collections and the API key
  // Now we iterate on the collections to create the requests
  // and find what's inside the collections
  for (let j = 0; j < collections.length; j++) {
    // This format yields the metadata  of a zotero collection
    const collectionMetaRequest = `https://api.zotero.org/groups/${data.libraryID}/collections/${collections[j].key}?&v=3&key=${zoteroApiKey}`;
    // Push promise in the relevant array
    zoteroPromises.push(collectionMetaRequest);
  }

  var zoteroCollectionResponse = [];

  let responseTarget = 0;
  let responseAmount = 0;

  // For each collection (again, part of a single library) that
  // we are looking for

  zoteroPromises.forEach((d) => {
    limiter
      .schedule(() => fetch(d))
      .then((res) => res.json())
      .then((collectionMetadata) => {
        // Add the collection metadata to the array
        zoteroCollectionResponse.push(collectionMetadata);

        // If we have answers for all the collections we're looking for
        if (zoteroCollectionResponse.length === zoteroPromises.length) {
          // We proceed by iterating over each collection metadata
          zoteroCollectionResponse.forEach((colMeta) => {
            // We first find how many documents this particular collection has
            var thisCollectionAmount = parseInt(colMeta.meta.numItems);

            // We add this number to the total responseTarget, which counts
            // all the documents we're looking for among the (potentially several)
            // collections that we are looking for.
            responseTarget = responseTarget + thisCollectionAmount;

            // Find the name of the collection
            colMeta.name = colMeta.data.name;

            // Create an array to fill
            colMeta.items = [];

            // Create one request per hundred documents, since document metadata
            // can come in pages of 100 items.
            let itemRequests = [];

            // URL creator
            const itemRequestCreator = (start) =>
              `https://api.zotero.org/groups/${data.libraryID}/collections/${colMeta.key}/items/?v=3&format=csljson&start=${start}&limit=100&itemType=-note&key=${zoteroApiKey}`;

            for (var i = 0; i < colMeta.meta.numItems; i += 100) {
              itemRequests.push(itemRequestCreator(i));
            }

            // Now that we have the pages to request for this particular collection
            // Send them to the Zotero API

            itemRequests.forEach((d) => {
              limiter
                .schedule(() => fetch(d))
                .then((res) => res.json())
                .then((documentPage) => {
                  // A document page is a page of up to 100 documents from a
                  // given collection.

                  // For each document
                  documentPage.items.forEach((d) => {
                    // Add it to the array of results of this particular collection
                    colMeta.items.push(d);

                    // Add 1 to the number of TOTAL document responses we had (ie
                    // throughout all collections requested)
                    responseAmount++;

                    // Signal our kind user that we have received another document
                    // and that soon they shall bask in the light of their newly
                    // accessible corpus.
                    const updateMessage = `Loading ${responseAmount}/${responseTarget}`;

                    window.electron.send("chaeros-notification", updateMessage);

                    // If all the documents throughout all the collections have
                    // been retrieved.
                    if (responseAmount === responseTarget) {
                      // Now retrieve the potential notes that might exist

                      // First, map the responses.
                      const documentMap = {};

                      colMeta.items.forEach((doc) => {
                        const doc_id = doc.id.substring(
                          doc.id.indexOf("/") + 1
                        );
                        documentMap[doc_id] = doc;
                      });

                      const noteRequests = [];

                      const noteRequestCreator = (start) =>
                        `https://api.zotero.org/groups/${data.libraryID}/collections/${colMeta.key}/items/?&v=3&start=${start}&limit=100&itemType=note&key=${zoteroApiKey}`;

                      for (var i = 0; i < colMeta.meta.numItems; i += 100) {
                        noteRequests.push(noteRequestCreator(i));
                      }

                      window.electron.send(
                        "chaeros-notification",
                        "Retrieving notes…"
                      );

                      var resCount = 0;

                      noteRequests.forEach((d) => {
                        limiter
                          .schedule(() => fetch(d))
                          .then((res) => res.json())
                          .then((noteList) => {
                            noteList.forEach((note) => {
                              if (note.data.itemType === "note") {
                                const noteContent = JSON.parse(note.data.note);
                                const parent_id = note.data.parentItem;
                                documentMap[parent_id].note = noteContent;
                              }
                            });

                            resCount++;

                            if (resCount === noteRequests.length) {
                              const dataset = Object.values(documentMap);
                              saveDataset(dataset);
                            }
                          });
                      });

                      const saveDataset = (data) => {
                        const date = genDate();
                        const name = importName;
                        const id = `${name}-${date}`;

                        const dataset = {
                          id,
                          source: "zotero",
                          date,
                          name,
                          data,
                        };

                        // send dataset to be saved
                        dataWriter(["standard"], dataset);

                        // stop pulsar
                        window.electron.send("pulsar", true);
                        // destroy this chaeros window

                        window.electron.send(
                          "chaeros-notification",
                          "Collection retrieved"
                        );

                        setTimeout(
                          () => window.electron.send("win-destroy", true),
                          1000
                        );
                      };

                      //saveDataset()
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
  const colName = dataset.name;

  var zoteroApiKey;

  userData.distantServices.forEach((service) => {
    if (service.serviceType === "zotero") {
      service.serviceConfig.library.forEach((lib) => {
        if (lib === dataset.id) {
          zoteroApiKey = service.serviceConfig.apikey;
        }
      });
    }
  });

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

                  fetch(url)
                    .then((r) => r.json())
                    .then((r) => {
                      const id = r.data.shortTitle;
                      if (noteMap.hasOwnProperty(id)) {
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
                      }
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
