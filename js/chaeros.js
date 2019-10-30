//========== CHÆEROS ==========
//When Flux actions are too heavy to be quasi-instantaneous, powerValve sends a message to the main process. This
//message is both the function to be executed, and an object containing its arguments. Once recieved, the main process
//creates a new invisible (never shown) window which calls the chaeros module, and executes one of the functions below,
//depending on what has been called by powerValve and transmitted by the main process. While executing, the chaeros
//module sends messages to the main process informing of the state of the function's execution, which is in turn
//redispatched to the index's "coreCanvas" and "field" (the main field), which subsequently impacts the core animation
//and the field's value.

const { remote, ipcRenderer } = require("electron"); // Load ipc to communicate with main process
const userDataPath = remote.app.getPath("userData"); // Find userData folder Path
const appPath = remote.app.getAppPath();
const keytar = require("keytar"); // Load keytar to manage user API keys
const rpn = require("request-promise-native"); // Load RPN to manage promises
const bottleneck = require("bottleneck"); // Load bottleneck to manage API request limits
const fs = require("fs"); // Load filesystem to manage flatfiles
const MultiSet = require("mnemonist/multi-set"); // Load Mnemonist to manage other data structures
const date = new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();


var currentDoc = {};

var geolocationActive = false;
var altmetricActive = false;

//========== scopusConverter ==========
//scopusConverter converts a scopus JSON dataset into a Zotero CSL-JSON dataset.

const scopusConverter = dataset => {
  // [dataset] is the file to be converted
  ipcRenderer.send("console-logs", "Starting scopusConverter on " + dataset); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb.enriched.get(dataset).then(doc => {
    // Open the database in which the scopus dataset is stored
    try {
      // If the file is valid, do the following:
      let articles = doc.content.entries; // Select the array filled with the targeted articles

      for (var i = 0; i < articles.length; ++i) {
        // For each article of the array, change the name of the properties
        let pushedArticle = {
          itemType: "journalArticle",
          title: "",
          creators: [{ creatorType: "author", firstName: "", lastName: "" }],
          abstractNote: "",
          publicationTitle: "",
          volume: "",
          issue: "",
          pages: "",
          date: "",
          series: "",
          seriesTitle: "",
          seriesText: "",
          journalAbbreviation: "",
          language: "",
          DOI: "",
          ISSN: "",
          shortTitle: "",
          url: "",
          accessDate: "",
          archive: "",
          archiveLocation: "",
          libraryCatalog: "",
          callNumber: "",
          rights: "",
          extra: "",
          tags: [],
          collections: [],
          relations: {}
        };

        // Then Fill the article with the relevant properties
        pushedArticle.itemType = "journalArticle";
        pushedArticle.title = articles[i]["dc:title"];
        pushedArticle.url = articles[i]["url"];
        pushedArticle.creators[0].lastName = articles[i]["dc:creator"];
        pushedArticle.date = articles[i]["prism:coverDate"];
        pushedArticle.DOI = articles[i]["prism:doi"];
        pushedArticle.publicationTitle = articles[i]["prism:publicationName"];

        let enrichment = {
          affiliations: articles[i].affiliation,
          OA: articles[i].openaccessFlag
        };

        if (articles[i].hasOwnProperty("altmetricData")) {
          enrichment.altmetric = JSON.stringify(articles[i].altmetricData);
        }

        pushedArticle.shortTitle = JSON.stringify(enrichment);
        convertedDataset.push(pushedArticle); // Then push the article in the array of converted articles
      }
    } catch (err) {
      ipcRenderer.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      ipcRenderer.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      pandodb.open();
      let id = dataset;
      pandodb.csljson.add({
        id: id,
        date: date,
        name: dataset,
        content: convertedDataset
      }); // Save array in local database
    }
  });

  ipcRenderer.send("chaeros-notification", "Dataset converted"); // Send a success message
  ipcRenderer.send(
    "console-logs",
    "scopusConverter successfully converted " + dataset
  ); // Log success
  setTimeout(() => {
    win.close();
  }, 500);
};

//========== scopusGeolocate ==========
// scopusGeolocate gets cities/countries geographical coordinates from affiliations.

const scopusGeolocate = dataset => {
  geolocationActive = true;
  ipcRenderer.send("chaeros-notification", "Geolocating affiliations");
  ipcRenderer.send("console-logs", "Started scopusGeolocate on " + dataset);

  pandodb.enriched.get(dataset).then(doc => {
    fs.readFile(
      appPath + "/json/cities.json", // Read the dataset passed as option
      "utf8",
      (err, locatedCities) => {
        // It should be encoded as UTF-8

        var coordinates = JSON.parse(locatedCities);

        let article = doc.content.entries; // Find relevant objects in the parsed dataset
        let totalCityArray = []; // Prepare an empty array

        for (var i = 0; i < article.length - 1; i++) {
          // For loop to generate list of cities to be requested
          if (
            article[i].hasOwnProperty("affiliation") &&
            article[i].affiliation.length > 0
          ) {
            // If item has at least an affiliation
            for (let j = 0; j < article[i].affiliation.length; j++) {
              // Iterate on item's available affiliation
              if (
                article[i].affiliation[j].hasOwnProperty("affiliation-country")
              ) {
                // If affiliation has a city
                let location = {};
                location.country =
                  article[i].affiliation[j]["affiliation-country"];
                location.city = article[i].affiliation[j]["affiliation-city"]; // Extract city name
                totalCityArray.push(JSON.stringify(location));
              }
            }
          }
        }
        let cityRequests = MultiSet.from(totalCityArray); // Create a multiset from city Array to prevent duplicate requests

        let cityIndex = [];

        cityRequests.forEachMultiplicity((count, key) => {
          cityIndex.push(JSON.parse(key));
        });

        cityIndex.forEach(d => {
          for (let l = 0; l < coordinates.length; l++) {
            if (d.country === coordinates[l].country) {
              if (d.city === coordinates[l].name) {
                d.lon = coordinates[l].lon;
                d.lat = coordinates[l].lat;
              }
            }
          }
        });

        article.forEach(d => {
          for (let l = 0; l < cityIndex.length; l++) {
            if (d.hasOwnProperty("affiliation")) {
              for (var k = 0; k < d.affiliation.length; k++) {
                // Loop on available item's affiliations

                let city = d.affiliation[k]["affiliation-city"]; // Extract affiliation city
                let country = d.affiliation[k]["affiliation-country"]; // Extract affiliation city

                if (typeof city === "object") {
                  city = JSON.stringify(city);
                } // Stringify to allow for comparison
                if (typeof country === "object") {
                  country = JSON.stringify(country);
                } // Stringify to allow for comparison

                if (country === cityIndex[l].country) {
                  if (city === cityIndex[l].city) {
                    ipcRenderer.send(
                      "chaeros-notification",
                      "Located " + d.affiliation[k]["affilname"] + " in " + city
                    );
                    d.affiliation[k].lon = cityIndex[l].lon;
                    d.affiliation[k].lat = cityIndex[l].lat;
                  }
                }
              }
            }
          }
        });

        let unlocatedCities = [];

        article.forEach(d => {
          if (d.hasOwnProperty("affiliation")) {
            for (let i = 0; i < d.affiliation.length; i++) {
              if (d.affiliation[i].lon === undefined) {
                unlocatedCities.push(d.affiliation[i]);
              }
            }
          }
        });

        ipcRenderer.send(
          "console-logs",
          "Unable to locale the following cities " +
            JSON.stringify(unlocatedCities)
        );
        doc.content.articleGeoloc = true; // Mark file as geolocated
        pandodb.enriched.put(doc);

        ipcRenderer.send("chaeros-notification", "Affiliations geolocated"); //Send success message to main process
        ipcRenderer.send(
          "console-logs",
          "scopusGeolocate successfully added geolocations on " + dataset
        );

        setTimeout(() => {
          win.close();
        }, 2000);
      }
    );
  });
};

//========== scopusRetriever ==========
// Once a basic scopus query has been made on an expression, the user can choose to perform the actual query.
// This retrieves all the documents corresponding to the same query (basic query only loads one in order to get the
// the total amount of documents). This is sent to chaeros via powerValve because it can be heavy, depending on the
// size of the sample and the power/broadband available on the user's system.

const scopusRetriever = (user, query, bottleRate) => {
  // user argument is passed to get keytar pass

  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 1 / parseInt(bottleRate) // Every 500 milliseconds
  });

  ipcRenderer.send(
    "console-logs",
    "Started scopusRetriever on " + query + " for user " + user
  ); // Log the process

  let scopusQuery = query; // query argument is the actual query

  var content = {
    type: "Scopus-dataset",
    query: scopusQuery,
    queryDate: date,
    altmetricEnriched: false,
    articleGeoloc: false,
    entries: []
  };

  keytar.getPassword("Scopus", user).then(scopusApiKey => {
    // Get the password through keytar

    // URL Building blocks
    let rootUrl = "https://api.elsevier.com/content/search/scopus?query=";
    let apiProm = "&apiKey=";
    let urlCount = "&count=";
    let urlStart = "&start=";
    let docAmount = 0;

    let optionsRequest = {
      // Prepare options for the Request-Promise-Native Package
      uri:
        rootUrl +
        scopusQuery +
        apiProm +
        scopusApiKey +
        urlCount +
        1 +
        urlStart +
        0,
      headers: { "User-Agent": "Request-Promise" }, // User agent to access is Request-promise
      json: true // Automatically parses the JSON string in the response
    };

    rpn(optionsRequest) // RPN stands for Request-promise-native (Request + Promise)
      .then(function(firstResponse) {
        // Once you get the response

        let docAmount =
          firstResponse["search-results"]["opensearch:totalResults"]; // Get the total amount of docs

        var dataPromises = []; // Create empty array for the promises to come

        for (let countStart = 0; countStart <= docAmount; countStart += 200) {
          // For each page of 200 documents

          // Create a specific promise
          let scopusTotalRequest =
            rootUrl +
            scopusQuery +
            apiProm +
            scopusApiKey +
            urlCount +
            200 +
            urlStart +
            countStart;

          let optionsTotalRequest = {
            // Prepare options for the Request-Promise-Native Package
            uri: scopusTotalRequest, // URI to be accessed
            headers: { "User-Agent": "Request-Promise" }, // User agent to access is Request-promise
            json: true // Answer should be parsed as JSON
          };
          dataPromises.push(rpn(optionsTotalRequest)); // Push promise in the relevant array
        }

        limiter
          .schedule(() => Promise.all(dataPromises))
          .then(scopusResponse => {
            for (let i = 0; i < scopusResponse.length; i++) {
              // For each page of (max 200) results
              let retrievedDocuments =
                scopusResponse[i]["search-results"]["entry"]; // Select the docs it contains

              if (retrievedDocuments != undefined) {
                for (let j = 0; j < retrievedDocuments.length; j++) {
                  // For each document
                  content.entries.push(retrievedDocuments[j]); // Write it in the "entries" array
                }
              }
            }
            return;
          })
          .then(() => {
            // Once all entries/documents have been written

            pandodb.open();
            let id = query + date;
            pandodb.scopus
              .add({ id: id, date: date, name: query, content: content })
              .then(res1 => {
                pandodb.enriched
                  .add({ id: id, date: date, name: query, content: content })
                  .then(res2 => {
                    ipcRenderer.send(
                      "chaeros-notification",
                      "Scopus API data retrieved"
                    ); // signal success to main process
                    ipcRenderer.send(
                      "console-logs",
                      "Scopus dataset on " +
                        query +
                        " for user " +
                        user +
                        " have been successfully retrieved."
                    );
                    setTimeout(() => {
                      win.close();
                    }, 500); // Close Chaeros
                  });
              });
          });
      })
      .catch(e => {
        ipcRenderer.send("chaeros-failure", e); // Send error to main process
      });
  });
};

//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

const zoteroItemsRetriever = (collections, zoteroUser, importName) => {
  ipcRenderer.send(
    "console-logs",
    "Started retrieving collections " +
      collections +
      "for user " +
      zoteroUser +
      " under the import name " +
      importName +
      " into SYSTEM."
  );

  let zoteroPromises = [];

  let zoteroItemsResponse;

  keytar.getPassword("Zotero", zoteroUser).then(zoteroApiKey => {
    // Open keytar

    for (let j = 0; j < collections.length; j++) {
      // Loop on collections

      // URL Building blocks
      let rootUrl = "https://api.zotero.org/groups/";
      let urlBase = "/collections/" + collections[j].key;
      let collectionComp = "&v=3&key=";

      let zoteroCollectionRequest =
        rootUrl + zoteroUser + urlBase + "?" + collectionComp + zoteroApiKey; // Build the url

      var optionsCollecsRequest = {
        // Prepare options for the Request-Promise-Native Package
        uri: zoteroCollectionRequest, // URI to be accessed
        headers: { "User-Agent": "Request-Promise" }, // User agent to access is Request-promise
        json: true // Automatically parses the JSON string in the response
      };
      zoteroPromises.push(rpn(optionsCollecsRequest)); // Push promise in the relevant array
    }

    Promise.all(zoteroPromises).then(res => {
      zoteroItemsResponse = res;

      ResponseAmount = 0;
      ResponseTarget = 0;

      zoteroItemsResponse.forEach(f => {
        ResponseTarget = ResponseTarget + parseInt(f.meta.numItems);
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

          var optionsItemsRequest = {
            uri: zoteroItemsRequest,
            headers: { "User-Agent": "Request-Promise" },
            json: true
          };

          itemRequests.push(rpn(optionsItemsRequest));
        }
        Promise.all(itemRequests).then(response => {
          for (var i = 0; i < response.length; i++) {
            response[i].items.forEach(d => {
              if (d.hasOwnProperty("shortTitle")) {
                var enrichment = JSON.parse(d.shortTitle);
                d.enrichment = enrichment;
                if (d.enrichment.hasOwnProperty("altmetric")) {
                  d.enrichment.altmetric = JSON.parse(d.enrichment.altmetric);
                }
              }
              f.items.push(d);
              ResponseAmount = ResponseAmount + 1;
              if (ResponseAmount === ResponseTarget) {
                dataWriter(["system"], importName, zoteroItemsResponse);
              }
            });
          }
        });
      });
    });
  });
};

//========== sysExport ==========
const sysExport = (destination, importName, id) => {
  pandodb.open();

  pandodb.system.get(id).then(dataset => {
    dataWriter(destination, importName, dataset.content);
  });
};

//========== dataWriter ==========
const dataWriter = (destination, importName, content) => {
  pandodb.open();
  destination.forEach(d => {
    let table = pandodb[d];
    let id = importName + date;
    table.add({ id: id, date: date, name: importName, content: content });
    ipcRenderer.send(
      "console-logs",
      "Retrieval successful. " + importName + " was imported in " + d
    );
  });
  ipcRenderer.send(
    "chaeros-notification",
    "dataset loaded into " + destination
  );
  setTimeout(() => {
    win.close();
  }, 1000);
};

//========== zoteroCollectionBuilder ==========
// zoteroCollectionBuilder creates a new collection from a CSL-JSON dataset.

const zoteroCollectionBuilder = (collectionName, zoteroUser, id) => {
  ipcRenderer.send(
    "console-logs",
    "Building collection" +
      collectionName +
      " for user " +
      zoteroUser +
      " in path " +
      id
  );

  ipcRenderer.send(
    "chaeros-notification",
    "Creating collection " + collectionName
  ); // Send message to main Display

  pandodb.csljson.get(id).then(data => {
    let timer = 2000;

    var file = data.content;

    try {
      // If the file is valid, do the following:
      const limiter = new bottleneck({
        // Create a bottleneck to prevent API rate limit
        maxConcurrent: 1, // Only one request at once
        minTime: 500 // Every 150 milliseconds
      });

      keytar.getPassword("Zotero", zoteroUser).then(zoteroApiKey => {
        // Retrieve password through keytar

        // URL Building blocks
        var rootUrl = "https://api.zotero.org/groups/";
        var collectionCreationUrl =
          rootUrl + zoteroUser + "/collections?&v=3&key=" + zoteroApiKey;

        var collectionItem = [{ name: "", parentCollection: "" }]; // Create the Collection item to be sent
        collectionItem[0].name = collectionName;

        var optionsCollectionCreation = {
          // Prepare options for the Request-Promise-Native Package
          method: "POST", // Use POST method
          uri: collectionCreationUrl, // URI to be accessed
          headers: { "User-Agent": "Request-Promise" }, // Headers (some options can be added here)
          body: collectionItem, // Bundle the Collection Item with the request
          json: true // Automatically parses the JSON string in the response
        };

        let collectionCode = { code: "" };

        rpn(optionsCollectionCreation).then(collectionName => {
          // Send the request through RPN

          collectionCode.code = collectionName.success["0"]; // Retrieve name from the response

          let fileArrays = []; // Create empty array

          file.forEach(d => {
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
              subArray.items.push(file[j]); // Push files in subarray
            }
            fileArrays.push(subArray); // Push subArray in fileArrays
            timer = timer + 1000;
          }

          let resCount = 0;

          Promise.all(
            fileArrays.map(d => {
              // Send all requests as promises (bottlenecked)

              let subArrayUpload = {
                // Designing promises
                method: "POST",
                uri: rootUrl + zoteroUser + "/items?&v=3&key=" + zoteroApiKey,
                headers: { "User-Agent": "Request-Promise" },
                body: d.items,
                json: true
              };

              return limiter.schedule(rpn, subArrayUpload).then(res => {
                // Enforce bottleneck
                resCount = resCount + 1; // Count the amount of responses
                if (resCount === fileArrays.length) {
                  setTimeout(() => {
                    ipcRenderer.send(
                      "chaeros-notification",
                      "Collection created"
                    ); // Send success message to main Display
                    win.close();
                  }, 2000);
                } // If all responses have been recieved, delay then close chaeros
              });
            })
          );
          ipcRenderer.send(
            "console-logs",
            "Collection " + JSON.stringify(collectionName) + " built."
          ); // Send success message to console
        }); //end of keytar
      });
    } catch (e) {
      ipcRenderer.send("console-logs", e);
    } finally {
    }
  });
};

//========== altmetricRetriever ==========
// Get altmetric data through the Altmetric API.

const altmetricRetriever = (id, user) => {
  altmetricActive = true;
  ipcRenderer.send("chaeros-notification", "Starting Altmetric enrichment"); // Send message to main Display

  pandodb.enriched.get(id).then(doc => {
    keytar.getPassword("altmetric", user).then(altmetricAPIkey => {
      // Retrieve password through keytar

      var timer = 500;

      try {
        const limiter = new bottleneck({
          // Create a bottleneck to prevent API rate limit
          maxConcurrent: 10, // Only one request at once
          minTime: 100 // Every 150 milliseconds
        });

        var count = 0;
        var DOIs = [];
        var files = doc.content.entries;

        files.forEach(f => {
          if (f.hasOwnProperty("prism:doi")) {
            DOIs.push(f["prism:doi"]);
            timer = timer + 200;
          }
        });

        Promise.all(
          DOIs.map(d => {
            var altmetricRequestOptions = {
              // Prepare options for the Request-Promise-Native Package
              uri:
                "https://api.altmetric.com/v1/doi/" +
                d +
                "?key=" +
                altmetricAPIkey,
              headers: { "User-Agent": "Request-Promise" }, // Headers (some options can be added here)
              json: true // Automatically parses the JSON string in the response
            };

            return limiter.schedule(rpn, altmetricRequestOptions).then(res => {
              // Enforce bottleneck
              files.forEach(file => {
                if (res.doi === file["prism:doi"]) {
                  count = count + 1;
                  ipcRenderer.send(
                    "chaeros-notification",
                    count + " Altmetric references added"
                  );
                  file.altmetricData = res;
                }
              });
            });
          })
        );
      } catch (error) {
        ipcRenderer.send("console-logs", error);
      } finally {
        doc.content.altmetricEnriched = true;

        setTimeout(() => {
          pandodb.enriched.put(doc);
          ipcRenderer.send(
            "chaeros-notification",
            "Altmetric enrichment successful"
          ); // Send success message to main Display
          ipcRenderer.send(
            "console-logs",
            "Altmetric enrichment of " + id + " successful."
          );
          setTimeout(() => {
            win.close();
          }, 2000);
        }, timer);
      }
    }); // End of Keytar
  }); // End of pandodb request
}; // End of altmetricRetriever function

//========== tweetImporter ==========

const tweetImporter = (dataset, query, name) => {
  let content = { keywords: [], path: "" };

  let id = name + date;

  fs.readFile(query, "utf8", (err, queryKeywords) => {
    if (err) throw err;
    queryKeywords = JSON.parse(queryKeywords);
    queryKeywords.keywords.forEach(d => content.keywords.push(d));
    let path = userDataPath + "/flatDatasets/" + name + ".csv";
    content.path = path;
    fs.copyFileSync(dataset, path);
    dataWriter(["system"], name, content);
  });
};

// clinTriRetriever(fluxArgs.clinTriRetriever.query)

const clinTriRetriever = (query) =>{
console.log(query)

}



//========== chaerosSwitch ==========
// Switch used to choose the function to execute in CHÆROS.

const chaerosSwitch = (fluxAction, fluxArgs) => {
  ipcRenderer.send(
    "console-logs",
    "CHÆROS started a " +
      fluxAction +
      " process with the following arguments : " +
      JSON.stringify(fluxArgs)
  );

  switch (fluxAction) {
    case "scopusConverter":
      scopusConverter(fluxArgs.scopusConverter.dataset);
      break;

    case "scopusGeolocate":
      scopusGeolocate(fluxArgs.scopusGeolocate.dataset);
      break;

    case "altmetricRetriever":
      altmetricRetriever(
        fluxArgs.altmetricRetriever.id,
        fluxArgs.altmetricRetriever.user
      );
      break;

    case "scopusRetriever":
      scopusRetriever(
        fluxArgs.scopusRetriever.user,
        fluxArgs.scopusRetriever.query,
        fluxArgs.scopusRetriever.bottleneck
      );
      break;

    case "zoteroItemsRetriever":
      zoteroItemsRetriever(
        fluxArgs.zoteroItemsRetriever.collections,
        fluxArgs.zoteroItemsRetriever.zoteroUser,
        fluxArgs.zoteroItemsRetriever.importName,
        fluxArgs.zoteroItemsRetriever.destination
      );
      break;

    case "zoteroCollectionBuilder":
      zoteroCollectionBuilder(
        fluxArgs.zoteroCollectionBuilder.collectionName,
        fluxArgs.zoteroCollectionBuilder.zoteroUser,
        fluxArgs.zoteroCollectionBuilder.id
      );
      break;

    case "sysExport":
      sysExport(
        fluxArgs.sysExport.dest,
        fluxArgs.sysExport.name,
        fluxArgs.sysExport.id
      );
      break;

    case "tweetImporter":
      tweetImporter(
        fluxArgs.tweetImporter.dataset,
        fluxArgs.tweetImporter.query,
        fluxArgs.tweetImporter.datasetName
      );
      break;

    case "clinTriRetriever":
        clinTriRetriever(fluxArgs.clinTriRetriever.query)
      break;
  }
};

module.exports = { chaerosSwitch: chaerosSwitch }; // Export the switch as a module
