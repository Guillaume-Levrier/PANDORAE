//========== CHÆEROS ==========
//When Flux actions are too heavy to be quasi-instantaneous, powerValve sends a message to the main process. This
//message is both the function to be executed, and an object containing its arguments. Once recieved, the main process
//creates a new invisible (never shown) window which calls the chaeros module, and executes one of the functions below,
//depending on what has been called by powerValve and transmitted by the main process. While executing, the chaeros
//module sends messages to the main process informing of the state of the function's execution, which is in turn
//redispatched to the index's "coreCanvas" and "field" (the main field), which subsequently impacts the core animation
//and the field's value.

const { ipcRenderer } = require("electron"); // Load ipc to communicate with main process
const userDataPath = window.electron.sendSync("remote", "userDataPath"); // Find userData folder Path
const appPath = window.electron.sendSync("remote", "appPath");
const bottleneck = require("bottleneck"); // Load bottleneck to manage API request limits
const fs = require("fs"); // Load filesystem to manage flatfiles
const MultiSet = require("mnemonist/multi-set"); // Load Mnemonist to manage other data structures
const d3 = require("d3");
const csv = require("csv-parser");
const { promises } = require("dns");
const date =
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
var winId = 0;
var currentDoc = {};

var geolocationActive = false;
var altmetricActive = false;

const getPassword = (service, user) =>
  window.electron.sendSync("keyManager", {
    user: user,
    service: service,
    type: "getPassword",
  });

//========== scopusConverter ==========
//scopusConverter converts a scopus JSON dataset into a Zotero CSL-JSON dataset.

const scopusConverter = (dataset, source, normalize, email) => {
  // [dataset] is the file to be converted
  window.electron.send(
    "console-logs",
    "Starting scopusConverter on " + dataset
  ); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
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
          relations: {},
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
          OA: articles[i].openaccessFlag,
        };

        if (articles[i].hasOwnProperty("altmetricData")) {
          enrichment.altmetric = JSON.stringify(articles[i].altmetricData);
        }

        pushedArticle.shortTitle = JSON.stringify(enrichment);
        convertedDataset.push(pushedArticle); // Then push the article in the array of converted articles
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset;
      if (normalize) {
        const converted = {
          id: id,
          date: date,
          name: dataset,
          content: convertedDataset,
        };
        crossRefEnricher(converted, email);
      } else {
        pandodb.open();

        pandodb.csljson
          .add({
            id: id,
            date: date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "scopusConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

//========== webofscienceConverter ==========
//webofscienceConverter converts a scopus JSON dataset into a Zotero CSL-JSON dataset.

const webofscienceConverter = (dataset, source, normalize, mail) => {
  // [dataset] is the file to be converted
  window.electron.send(
    "console-logs",
    "Starting webofscienceConverter on " + dataset
  ); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the scopus dataset is stored

    try {
      // If the file is valid, do the following:
      let articles = doc.content.entries; // Select the array filled with the targeted articles

      for (var i = 0; i < articles.length; ++i) {
        // For each article of the array, change the name of the properties
        let pushedArticle = {
          itemType: "journalArticle",
          title: "",
          creators: [],
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
          relations: {},
        };

        // Then fill the article with the relevant properties

        const art = articles[i];

        const item = art.static_data.item;

        art.static_data.summary.names.name.forEach((individual) => {
          // the field "role" gives other things than author in wos datasets
          // but we would need to build a compatibility table with CSL-JSON

          pushedArticle.creators.push({
            creatorType: "author",
            firstName: individual.first_name,
            lastName: individual.last_name,
          });
        });

        art.static_data.summary.titles.title.forEach((title) => {
          if (title.type === "item") {
            pushedArticle.title = title.content;
          }
        });

        pushedArticle.publicationTitle =
          art.static_data.summary.publishers.publisher.names.name.unified_name;

        if (
          art.static_data.fullrecord_metadata.abstracts.hasOwnProperty(
            "abstract"
          )
        ) {
          var abstract = "";

          const abssource =
            art.static_data.fullrecord_metadata.abstracts.abstract.abstract_text
              .p;

          if (typeof abssource === "string") {
            abstract = abssource;
          } else {
            abssource.forEach((p) => (abstract += p + "\n"));
          }

          pushedArticle.abstract = abstract;
        }

        pushedArticle.date = art.static_data.summary.pub_info.sortdate;

        //pushedArticle.url = articles[i]["url"];
        //pushedArticle.creators[0].lastName = articles[i]["dc:creator"];
        //
        //pushedArticle.DOI = articles[i]["prism:doi"];
        /*
        let enrichment = {
          affiliations: articles[i].affiliation,
          OA: articles[i].openaccessFlag,
        };

        if (articles[i].hasOwnProperty("altmetricData")) {
          enrichment.altmetric = JSON.stringify(articles[i].altmetricData);
        }
*/
        //      pushedArticle.shortTitle = JSON.stringify(enrichment);
        convertedDataset.push(pushedArticle); // Then push the article in the array of converted articles
      }
    } catch (err) {
      console.log(err);
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset;
      if (normalize) {
        const converted = {
          id: id,
          date: date,
          name: dataset,
          content: convertedDataset,
        };
        crossRefEnricher(converted, email);
      } else {
        pandodb.open();

        pandodb.csljson
          .add({
            id: id,
            date: date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "webofscienceConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

//========== GEOLOCATION ==========
// Several strategies are applicable. One is to take data from most populated cities,
// another is to ask a services such as geocode.earth.

// It now makes more sense to first uniformize the document and then enrich it.

const geolocateAffiliations = (dataset) => {
  const geocode_api_key = "";
  pandodb.enriched.get(dataset).then((data) => {
    const documents = doc.content.entries;

    // map affiliations

    /* fetch(
      `https://api.geocode.earth/v1/search?api_key=${geocode_api_key}&text=${affiliation}`
    ).then((response) => response.json()); 
    */
  });
};

//========== scopusGeolocate ==========
// scopusGeolocate gets cities/countries geographical coordinates from affiliations.

const scopusGeolocate = (dataset) => {
  geolocationActive = true;
  window.electron.send("chaeros-notification", "Geolocating affiliations");
  window.electron.send("console-logs", "Started scopusGeolocate on " + dataset);

  pandodb.enriched.get(dataset).then((doc) => {
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

        cityIndex.forEach((d) => {
          for (let l = 0; l < coordinates.length; l++) {
            if (d.country === coordinates[l].country) {
              if (d.city === coordinates[l].name) {
                d.lon = coordinates[l].lon;
                d.lat = coordinates[l].lat;
              }
            }
          }
        });

        article.forEach((d) => {
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
                    window.electron.send(
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

        article.forEach((d) => {
          if (d.hasOwnProperty("affiliation")) {
            for (let i = 0; i < d.affiliation.length; i++) {
              if (d.affiliation[i].lon === undefined) {
                unlocatedCities.push(
                  d.affiliation[i]["affiliation-city"] +
                    ", " +
                    d.affiliation[i]["affiliation-country"]
                );
              }
            }
          }
        });

        window.electron.send(
          "console-logs",
          "Unable to locale the " +
            unlocatedCities.length +
            " following cities " +
            JSON.stringify(unlocatedCities)
        );
        doc.content.articleGeoloc = true; // Mark file as geolocated
        pandodb.enriched.put(doc);

        window.electron.send("chaeros-notification", "Affiliations geolocated"); //Send success message to main process
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "scopusGeolocate successfully added geolocations on " + dataset
        );

        setTimeout(() => {
          window.electron.send("win-destroy", winId);
        }, 2000);
      }
    );
  });
};

//========== webofscienceGeolocate ==========
// webofscienceGeolocate gets cities/countries geographical coordinates from affiliations.

const webofscienceGeolocate = (dataset) => {
  geolocationActive = true;
  window.electron.send("chaeros-notification", "Geolocating affiliations");
  window.electron.send(
    "console-logs",
    "Started webofscienceGeolocate on " + dataset
  );

  pandodb.enriched.get(dataset).then((doc) => {
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

        cityIndex.forEach((d) => {
          for (let l = 0; l < coordinates.length; l++) {
            if (d.country === coordinates[l].country) {
              if (d.city === coordinates[l].name) {
                d.lon = coordinates[l].lon;
                d.lat = coordinates[l].lat;
              }
            }
          }
        });

        article.forEach((d) => {
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
                    window.electron.send(
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

        article.forEach((d) => {
          if (d.hasOwnProperty("affiliation")) {
            for (let i = 0; i < d.affiliation.length; i++) {
              if (d.affiliation[i].lon === undefined) {
                unlocatedCities.push(d.affiliation[i]);
              }
            }
          }
        });

        window.electron.send(
          "console-logs",
          "Unable to locale the following cities " +
            JSON.stringify(unlocatedCities)
        );
        doc.content.articleGeoloc = true; // Mark file as geolocated
        pandodb.enriched.put(doc);

        window.electron.send("chaeros-notification", "Affiliations geolocated"); //Send success message to main process
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "scopusGeolocate successfully added geolocations on " + dataset
        );

        setTimeout(() => {
          window.electron.send("win-destroy", winId);
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
  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 1000,
  });

  window.electron.send(
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
    entries: [],
  };

  let scopusApiKey = getPassword("Scopus", user);

  // URL Building blocks
  let rootUrl = "https://api.elsevier.com/content/search/scopus?query=";
  let apiProm = "&apiKey=";
  let urlCount = "&count=";
  let urlStart = "&start=";
  let docAmount = 0;

  fetch(
    rootUrl + scopusQuery + apiProm + scopusApiKey + urlCount + 1 + urlStart + 0
  )
    .then((res) => res.json())
    .then((firstResponse) => {
      // Once you get the response

      let docAmount =
        firstResponse["search-results"]["opensearch:totalResults"]; // Get the total amount of docs

      var dataPromises = []; // Create empty array for the promises to come

      if (docAmount > 4800) {
        docAmount = 4800;
      }

      for (let countStart = 0; countStart <= docAmount; countStart += 200) {
        // For each page of 200 documents

        // Create a specific promise url
        let scopusTotalRequest =
          rootUrl +
          scopusQuery +
          apiProm +
          scopusApiKey +
          urlCount +
          200 +
          urlStart +
          countStart;

        dataPromises.push(scopusTotalRequest); // Push promise in the relevant array
      }

      let scopusResponse = [];

      dataPromises.forEach((d) => {
        limiter
          .schedule(() => fetch(d))
          .then((res) => res.json())
          .then((result) => {
            scopusResponse.push(result);
            if (scopusResponse.length === dataPromises.length) {
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

              pandodb.open();
              let id = query + date;
              pandodb.scopus
                .add({
                  id,
                  date,
                  name: query,
                  content,
                })
                .then(() => {
                  pandodb.enriched
                    .add({
                      id,
                      date,
                      name: query,
                      content,
                    })
                    .then(() => {
                      window.electron.send(
                        "chaeros-notification",
                        "Scopus API data retrieved"
                      ); // signal success to main process
                      window.electron.send("pulsar", true);
                      window.electron.send(
                        "console-logs",
                        "Scopus dataset on " +
                          query +
                          " for user " +
                          user +
                          " have been successfully retrieved."
                      );
                      setTimeout(() => {
                        window.electron.send("win-destroy", winId);
                      }, 500); // Close Chaeros
                    });
                });
              //});
            }
          })
          .catch((e) => {
            console.log(e);
            window.electron.send("chaeros-failure", e); // Send error to main process
            window.electron.send("pulsar", true);
          });
      });
    })

    .catch((e) => {
      console.log(e);
      window.electron.send("chaeros-failure", e); // Send error to main process
      window.electron.send("pulsar", true);
    });
};

//========== biorxivRetriever ==========
const biorxivRetriever = (query) => {
  let amount = query.amount;
  let totalrequests = Math.ceil(amount / 75);
  let doiBuffer = [];

  let terms = query.terms,
    doi = query.doi,
    author = query.author,
    jcode = query.jcode,
    from = query.from,
    to = query.to;

  let baseUrl = "https://www.biorxiv.org/search/" + terms;

  if (doi.length > 0) {
    baseUrl =
      baseUrl + "%20doi%3A" + document.getElementById("biorxiv-doi").value;
  }
  if (author.length > 0) {
    baseUrl =
      baseUrl +
      "%20author1%3A" +
      document.getElementById("biorxiv-author").value;
  }

  baseUrl =
    baseUrl +
    "%20jcode%3A" +
    jcode +
    "%20limit_from%3A" +
    from +
    "%20limit_to%3A" +
    to +
    "%20numresults%3A75%20sort%3Apublication-date%20direction%3Adescending%20format_result%3Acondensed";

  let requestArray = [];

  requestArray.push(baseUrl + "?page=0");

  for (let i = 1; i < totalrequests; i++) {
    requestArray.push(baseUrl + "?page=" + i);
  }

  var scrapeTimerCount = 0;

  requestArray.forEach((req) => {
    scrapeTimerCount++;
    let requestContent = {
      type: "request",
      model: "biorxiv-content-retriever",
      count: parseInt(req.slice(-1)) + 1,
      address: req,
      winId: winId,
    };

    setTimeout(
      () => window.electron.send("biorxivRetrieve", requestContent),
      scrapeTimerCount * 6000 + Math.random() * 6000
    );
  });

  let count = 0;

  ipcRenderer.on("biorxivRetrieve", (event, message) => {
    message.content.forEach((d) =>
      doiBuffer.push(d.replace("doi: https://doi.org/", "").replace(" ", ""))
    );
    count++;
    window.electron.send(
      "chaeros-notification",
      "scraping page " + count + " of " + totalrequests
    );
    if (count === totalrequests) {
      retrievedDocs(doiBuffer);
    }
  });

  const retrievedDocs = (dois) => {
    const limiter = new bottleneck({
      maxConcurrent: 3,
      minTime: 400,
    });

    window.electron.send("chaeros-notification", "hydrating via bioRxiv api");
    window.electron.send(
      "console-logs",
      "biorxivRetriever has retrieved DOIs and will now interrogate bioRxiv database"
    ); // Log the process

    bioRxivPromises = [];

    dois.forEach((d) =>
      bioRxivPromises.push("https://api.biorxiv.org/details/biorxiv/" + d)
    );

    limiter
      .schedule(() => Promise.all(bioRxivPromises.map((d) => fetch(d))))
      .then((res) => Promise.all(res.map((d) => d.json())))
      .then((res) => {
        var articles = [];

        res.forEach((d) => articles.push(d.collection[0]));

        var cslArticles = [];

        articles.forEach((d) => {
          if (d) {
            let e = {
              itemType: "journalArticle",
              title: "",
              creators: [],
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
              relations: {},
            };

            if (d.hasOwnProperty("doi")) {
              e.DOI = d.doi;
            }

            if (d.hasOwnProperty("title")) {
              e.title = d.title;
            }

            if (d.hasOwnProperty("date")) {
              e.date = d.date;
            }

            if (d.hasOwnProperty("abstract")) {
              e.abstractNote = d.abstract;
            }

            if (d.hasOwnProperty("author_corresponding_institution")) {
              e.shortTitle = d.author_corresponding_institution;
            }

            let pos = 0;

            e.creators.push({
              creatorType: "author",
              firstName: d.author_corresponding.substring(
                0,
                d.author_corresponding.indexOf(" ")
              ),
              lastName: d.author_corresponding.substring(
                d.author_corresponding.indexOf(" ") + 1,
                d.author_corresponding.length - 1
              ),
            });
            while (pos !== -1) {
              if (pos === 0) {
              } else {
                pos = pos + 2;
              }
              let endpos = d.authors.indexOf(";", pos);
              if (endpos === -1) {
                endpos = d.authors.length;
              }
              let auth = {
                creatorType: "author",
                lastName: d.authors.substring(pos, d.authors.indexOf(",", pos)),
                firstName: d.authors.substring(
                  d.authors.indexOf(",", pos) + 1,
                  endpos
                ),
              };
              e.creators.push(auth);
              pos = d.authors.indexOf(";", pos);
            }

            cslArticles.push(e);
          }
        });

        pandodb.open();

        let id = query.terms + date;

        pandodb.csljson.add({
          id: id,
          date: date,
          name: query.terms,
          content: cslArticles,
        }); // Save array in local database

        window.electron.send(
          "chaeros-notification",
          "bioRxiv results poured in csl-json"
        ); // Send a success message
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "bioRxiv results successfully poured in CSL-JSON database"
        ); // Log success
        setTimeout(() => {
          //window.electron.send("win-destroy", winId);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

//========== Clinical trials retriever ==========
// Once a basic scopus query has been made on an expression, the user can choose to perform the actual query.
// This retrieves all the documents corresponding to the same query (basic query only loads one in order to get the
// the total amount of documents). This is sent to chaeros via powerValve because it can be heavy, depending on the
// size of the sample and the power/broadband available on the user's system.

const clinTriRetriever = (query) => {
  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 500, // Every 500 milliseconds
  });

  window.electron.send(
    "console-logs",
    "Started retrieving clinical trials data for query: " + query
  ); // Log the process

  var content = {
    type: "clinical-trials",
    query: query,
    queryDate: date,
    entries: [],
  };

  // URL Building blocks
  let rootUrl = "https://clinicaltrials.gov/api/query/full_studies?";

  fetch(rootUrl + "expr=" + query + "&fmt=json")
    .then((res) => res.json())
    .then((firstResponse) => {
      // Once you get the response

      let totalResults = firstResponse.FullStudiesResponse.NStudiesFound;

      var dataPromises = []; // Create empty array for the promises to come

      for (let countStart = 1; countStart <= totalResults; countStart += 99) {
        // For each page of 100 documents

        // Create a specific promise
        let clintriTotalRequest =
          rootUrl +
          "expr=" +
          query +
          "&min_rnk=" + //&min_rnk=20&max_rnk=50&fmt=json
          countStart +
          "&max_rnk=" +
          parseInt(countStart + 99) +
          "&fmt=json";

        dataPromises.push(clintriTotalRequest);
      }

      limiter
        .schedule(() => Promise.all(dataPromises.map((d) => fetch(d))))
        .then((res) => Promise.all(res.map((d) => d.json())))
        .then((ctResponses) => {
          for (let i = 0; i < ctResponses.length; i++) {
            ctResponses[i].FullStudiesResponse.FullStudies.forEach((study) =>
              content.entries.push(study)
            );
          }

          let id = query + date;

          pandodb.pharmacotype
            .add({
              id: id,
              date: date,
              name: query,
              content: content,
            })
            .then(() => {
              setTimeout(() => {
                window.electron.send(
                  "chaeros-notification",
                  "clinical trials for " + query + " retrieved"
                );
                window.electron.send("pulsar", true);
                window.electron.send("win-destroy", winId);
              }, 500); // Close Chaeros
            });
        })
        .catch((e) => {
          console.log(e);
          window.electron.send("chaeros-failure", e); // Send error to main process
          window.electron.send("pulsar", true);
        });
    });
};

//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

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

  let zoteroPromises = [];
  var zoteroResponse = [];
  let zoteroApiKey = getPassword("Zotero", zoteroUser);

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
            thisCollectionAmount = parseInt(f.meta.numItems);
            responseTarget = responseTarget + thisCollectionAmount;

            f.name = f.data.name;
            f.items = [];

            console.log(
              "la collection " + f.name + " comporte " + thisCollectionAmount
            );

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

//========== sysExport ==========
const sysExport = (destination, importName, id) => {
  pandodb.open();

  pandodb.system.get(id).then((dataset) => {
    dataWriter(destination, importName, dataset.content);
  });
};

//========== dataWriter ==========
const dataWriter = (destination, importName, content) => {
  pandodb.open();
  destination.forEach((d) => {
    let table = pandodb[d];
    let id = importName + date;
    table.add({ id: id, date: date, name: importName, content: content });
    window.electron.send(
      "console-logs",
      "Retrieval successful. " + importName + " was imported in " + d
    );
  });
  window.electron.send(
    "chaeros-notification",
    "dataset loaded into " + destination
  );
  window.electron.send("pulsar", true);
  setTimeout(() => {
    window.electron.send("win-destroy", winId);
  }, 1000);
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

//========== tweetImporter ==========

const tweetImporter = (dataset, query, name) => {
  let content = { keywords: [], path: "" };

  let id = name + date;

  fs.readFile(query, "utf8", (err, queryKeywords) => {
    if (err) throw err;

    content.keywords = JSON.parse(queryKeywords);

    let path = userDataPath + "/flatDatasets/" + name + ".csv";
    content.path = path;
    fs.copyFileSync(dataset, path);
    dataWriter(["system"], name, content);
  });
};

// ===== reqISSN

const reqISSN = (user, scopid) => {
  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 500,
  });

  const issnList = new Set();

  pandodb.scopus.toArray((files) => {
    files.forEach((d) => {
      scopid.forEach((e) => {
        if (d.id === e) {
          d.content.entries.forEach((art) => {
            if (art.hasOwnProperty("prism:issn")) {
              issnList.add(art["prism:issn"]);
            }
          });
        }
      });
    });

    let ISSNPromises = [];

    let scopusApiKey = getPassword("Scopus", user);

    // URL Building blocks
    let rootUrl = "https://api.elsevier.com/content/serial/title/issn/";
    let apiProm = "?apiKey=";

    function pushPromise(val) {
      ISSNPromises.push(rootUrl + val + apiProm + scopusApiKey);
    }

    issnList.forEach(pushPromise);

    let scopusISSNResponse = [];

    ISSNPromises.forEach((d) => {
      limiter
        .schedule(() => fetch(d))
        .then((res) => res.json())
        .then((result) => {
          scopusISSNResponse.push(result);

          window.electron.send(
            "chaeros-notification",
            scopusISSNResponse.length +
              "/" +
              ISSNPromises.length +
              " journal profiles retrieved."
          ); // Sending notification to console

          if (scopusISSNResponse.length === ISSNPromises.length) {
            // if all responses have been recieved
            var data = {
              id: "ISSN-Retrieval_" + date,
              date: date,
              name: "ISSN-Retrieval" + date,
              content: scopusISSNResponse,
            };

            pandodb.open();
            pandodb.system.add(data).then(() => {
              window.electron.send(
                "chaeros-notification",
                "ISSN poured in SYSTEM"
              ); // Sending notification to console
              window.electron.send("pulsar", true);
              window.electron.send("console-logs", "ISSN poured in SYSTEM"); // Sending notification to console
              setTimeout(() => {
                window.electron.send("win-destroy", winId);
              }, 500);
            });
          }
        });
    });
  });
};

// Regards
// Cette fonction a pour but d'interroger l'API de nosdeputes.fr, un service maintenu
// par l'association Regards Citoyens. A partir d'une requête textuelle (un mot ou une)
// expression, chaeros va interroger cette API afin de reconstruire un jeu de données
// ordonné qui récupère tous les usages de cette expression.
// Cette fonction est encore en cours de construction

const regardsRetriever = (queryContent, legislature) => {
  // La première étape consiste à relancer la requête telle qu'obtenue dans le FLUX
  // Afin de disposer du nombre de pages de 500 éléments à demander à  l'API

  const query = `https://${legislature}.nosdeputes.fr/recherche/${encodeURI(
    queryContent
  )}?format=json`;

  // Déclaration d'un objet constant dont les propriétés renvoient à des
  // Maps par type de texte (ex. "amendements":Map(XX),"questionsecrites":Map(YY),etc)
  const regContent = {};

  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 600,
  });

  fetch(query)
    .then((r) => r.json())
    .then((res) => {
      let totalReq = parseInt(res.last_result / 500) + 1;

      let totalNum = parseInt(res.last_result);

      var pagesReq = [];

      for (let i = 1; i <= totalReq; i++) {
        pagesReq.push(
          `https://${legislature}.nosdeputes.fr/recherche/${encodeURI(
            queryContent
          )}?format=json&count=500&page=${i}`
        );
      }

      const docReq = [];
      const resPages = [];
      const resDocs = [];

      let pageN = 0;

      // Une fois ces pages récupérées, il faut ensuite soumettre ces requêtes tout
      // en respectant l'API rate limiting

      pagesReq.forEach((pageReq) => {
        limiter
          .schedule(() => fetch(pageReq))
          .then((res) => res.json())
          .then((resPage) => {
            pageN++;
            window.electron.send(
              "chaeros-notification",
              "Retrieving page " + pageN + " of " + pagesReq.length
            );
            resPages.push(resPage);

            if (resPages.length === pagesReq.length) {
              // Une fois toutes les réponses reçues
              // itérer sur toutes les pages
              resPages.forEach((page) => {
                // puis itérer sur chaque résultat de chaque page
                page.results.forEach((doc) => {
                  // normaliser le type de document, cf https://github.com/regardscitoyens/nosdeputes.fr/issues/176
                  let doctype = doc.document_type.toLowerCase();

                  // Si ce type de document existe déjà, ne rien faire
                  if (regContent.hasOwnProperty(doctype)) {
                  } else {
                    // sinon, créer une nouvelle Map correspondant à ce type de document
                    regContent[doctype] = new Map();
                  }
                  // ajouter un ensemble clé,valeur dans la map
                  // clé : ID du document tel que déclaré par l'API
                  // valeur : contenu du document
                  regContent[doctype].set(doc.document_id, doc);
                  // puis ajouter le lien du résultat dans un tableau afin d'aller chercher
                  // par la suite les ressources auxquelles il renvoie
                  docReq.push(
                    doc.document_url.replace(
                      "http://www.nosdeputes",
                      "https://www.nosdeputes"
                    )
                  );
                });
              });

              // Puis

              // envoyer des requêtes sur la base de tous les liens de résultats
              // récupérés précédemment

              let docN = 0;

              docReq.forEach((documentRequest) => {
                limiter
                  .schedule(() => fetch(documentRequest))
                  .then((res) => res.json())
                  .then((documentResponse) => {
                    docN++;
                    window.electron.send(
                      "chaeros-notification",
                      "Retrieving document " + docN + " of " + docReq.length
                    );

                    resDocs.push(documentResponse);
                    if (resDocs.length === docReq.length) {
                      // pour chaque document
                      resDocs.forEach((doc) => {
                        // récupérer le type de document (formatage étrange) cf https://github.com/regardscitoyens/nosdeputes.fr/issues/178
                        for (const doctype in doc) {
                          // mettre à jour le document dans la map avec le contenu des ressources obtenu
                          let docInMap = regContent[doctype].get(
                            doc[doctype].id
                          );
                          docInMap.content = doc[doctype];
                          regContent[doctype].set(doc[doctype].id, docInMap);
                        }
                      });

                      // Ré-enrichissement des interventions

                      // création d'une Map avec les séances hébergeant les interventions
                      const seances = new Map();
                      regContent.intervention.forEach((inter) => {
                        // both the seance id and legislature are needed
                        // the legislature currently has to be rebuilt, cf https://github.com/regardscitoyens/nosdeputes.fr/issues/179

                        let url = inter.content.url_nosdeputes;
                        let legislature = url.slice(
                          url.indexOf("nosdeputes.fr/") + 14,
                          url.indexOf("/seance/")
                        );
                        seances.set(inter.content.seance_id, legislature);
                      });

                      let seanceReqs = [];

                      seances.forEach((seance, leg) => {
                        seanceReqs.push(
                          "https://www.nosdeputes.fr/" +
                            seance +
                            "/seance/" +
                            leg +
                            "/json"
                        );
                      });

                      const resSeances = [];
                      let seanceN = 0;
                      seanceReqs.forEach((seanceReq) => {
                        limiter
                          .schedule(() => fetch(seanceReq))
                          .then((res) => res.json())
                          .then((resSeance) => {
                            seanceN++;
                            window.electron.send(
                              "chaeros-notification",
                              "Retrieving séance " +
                                seanceN +
                                " of " +
                                seanceReqs.length
                            );
                            resSeances.push(resSeance);
                            if (resSeances.length === seanceReqs.length) {
                              // verser les résultats dans la Map seances
                              resSeances.forEach((sc) => {
                                for (const typedoc in sc.seance[0]) {
                                  seances.set(
                                    sc.seance[0][typedoc].seance_id,
                                    sc.seance
                                  );
                                }
                              });

                              // ajouter les séances à la constante de résultats
                              regContent.seances = seances;

                              // enrichir les interventions précédemment obtenues avec les
                              // métadonnées contenues dans les séances

                              // pour chaque intervention contenant l'expression recherchée
                              regContent.intervention.forEach((inter) => {
                                // ouvrir la séance correspondance et itérer sur son contenu
                                seances
                                  .get(inter.content.seance_id)
                                  .forEach((d) => {
                                    // si l'ID de l'item de la séance est le même que l'id de l'intervention
                                    if (
                                      d.intervention.id === inter.document_id
                                    ) {
                                      // pour chaque propriété disponible dans l'objet trouvé
                                      for (const key in d.intervention) {
                                        // si elle est déjà disponible
                                        if (inter.content.hasOwnProperty(key)) {
                                          // ne rien faire
                                        } else {
                                          // sinon l'ajouter à l'intervention
                                          inter.content[key] =
                                            d.intervention[key];
                                        }
                                      }
                                    }
                                  });
                              });

                              fetch("https://www.nosdeputes.fr/deputes/json")
                                .then((dep) => dep.json())
                                .then((deps) => {
                                  depMap = new Map();
                                  deps.deputes.forEach((d) =>
                                    depMap.set(d.depute.id, d)
                                  );

                                  for (const key in regContent) {
                                    regContent[key].forEach((d) => {
                                      if (d.hasOwnProperty("content")) {
                                        if (
                                          d.content.hasOwnProperty(
                                            "parlementaire_id"
                                          )
                                        ) {
                                          d.content.aut = depMap.get(
                                            parseInt(d.content.parlementaire_id)
                                          );
                                        }
                                      }
                                    });
                                  }

                                  // vérification que les requêtes ont bien abouti à des retours
                                  var totalMap = 0;

                                  for (var itemType in regContent) {
                                    totalMap += regContent[itemType].size;
                                  }

                                  // Si c'est bien le cas, formatage puis sauvegarde
                                  if (totalMap >= totalNum) {
                                    dataWriter(
                                      ["system"],
                                      queryContent,
                                      regContent
                                    );
                                  } else {
                                    window.electron.send(
                                      "chaeros-notification",
                                      "Failure to retrieve data from Regards API"
                                    ); // Sending notification to console
                                    window.electron.send("pulsar", true);
                                    window.electron.send(
                                      "console-logs",
                                      "Failure to retrieve data from Regards API"
                                    ); // Sending notification to console

                                    setTimeout(() => {
                                      window.electron.send(
                                        "win-destroy",
                                        winId
                                      );
                                    }, 500);
                                  }
                                });
                            }
                          });
                      });
                    }
                  });
              });
            }
          });
      });
    });
};

const solrMetaExplorer = (req, meta, dateFrom, dateTo, targetCollections) => {
  const limiter = new bottleneck({
    maxConcurrent: 3,
    minTime: 1500,
  });

  const url = (req, start, end) =>
    "http://" +
    meta.but.args.url +
    ":" +
    meta.but.args.port +
    "/solr/" +
    meta.selectedCollection +
    "/" +
    "select?" +
    "fl=title,description,content_type_norm,content_language,host,wayback_date,author,url,links,crawl_date,id,collections" +
    "&facet.field=crawl_year&facet=on" +
    "&fq=collections:(" +
    targetCollections +
    ")&fq=crawl_date:[" +
    dateFrom +
    "T00:00:00Z" +
    "%20TO%20" +
    dateTo +
    "T00:00:00Z]&q=" +
    req +
    "&start=" +
    start +
    "&rows=" +
    (end - start) +
    "&sort=crawl_date%20desc" +
    "&group=true" +
    "&group.field=url" +
    "&group.limit=1" +
    "&group.sort=score+desc%2Ccrawl_date+desc" +
    "&start=0" +
    "&rows=0" +
    "&sort=score+desc";

  const urlArray = [];

  // make smaller packages (not necessary since supposed to be local)
  // but a good practice

  if (meta.count > 200) {
    for (let i = 0; i < meta.count / 200 + 1; i++) {
      urlArray.push(url(req, i * 200, (i + 1) * 200));
    }
  } else {
    urlArray.push(url(req, 0, 200));

    window.electron.send("console-logs", `First request: ${url(req, 0, 200)}`);
  }

  var totalResponse = [];
  let count = 0;

  urlArray.forEach((solrReq) => {
    limiter
      .schedule(() => fetch(solrReq).then((res) => res.json()))
      .then((res) => {
        count++;
        window.electron.send(
          "chaeros-notification",
          `Page ${count}/${urlArray.length}`
        );

        const docs = [];

        res.grouped.url.groups.forEach((g) => docs.push(g.doclist.docs[0]));

        totalResponse = [...totalResponse, ...docs];

        if (count === urlArray.length) {
          const importName = req + "-" + new Date();

          const cslData = [];

          totalResponse.forEach((d) =>
            cslData.push(bnfRemap(d, meta.selectedCollection))
          );

          const cslConvertedDataset = {
            id: importName,
            date: JSON.stringify(new Date()),
            name: importName,
            content: cslData,
          };

          pandodb.csljson
            .add(cslConvertedDataset)
            .then(() => {
              window.electron.send("chaeros-notification", "Dataset retrieved"); // Send a success message
              window.electron.send("pulsar", true);
              window.electron.send(
                "console-logs",
                "Solr data successfully converted"
              ); // Log success

              setTimeout(() => {
                window.electron.send("win-destroy", winId);
              }, 500);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
  });
};

// ===== Web of Science =====

const wosFullRetriever = (user, wosReq) => {
  const wosKey = getPassword("WebOfScience", user);

  const apiTarget = `https://wos-api.clarivate.com/api/wos/`;

  wosReq.count = 1;

  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 550,
  });

  // count must be 1 to 100;
  // firstRecord starts at 1;

  fetch(apiTarget, {
    method: "POST",
    body: JSON.stringify(wosReq),
    headers: { "Content-Type": "application/json", "X-ApiKey": wosKey },
  })
    .then((res) => res.json())
    .then((res) => {
      const num = res.QueryResult.RecordsFound;

      const reqnum = Math.ceil(num / 100);

      let count = 0;

      const promises = [];

      var resultCorpus = [];

      for (let i = 0; i < reqnum; i++) {
        var requestOptions = {};
        Object.assign(requestOptions, wosReq);

        requestOptions.count = 100;
        requestOptions.firstRecord = 1 + 100 * i;
        promises.push(requestOptions);
      }

      promises.forEach((d) => {
        limiter
          .schedule(() =>
            fetch(apiTarget, {
              method: "POST",
              body: JSON.stringify(d),
              headers: {
                "Content-Type": "application/json",
                "X-ApiKey": wosKey,
              },
            })
          )
          .then((res) => res.json())
          .then((result) => {
            resultCorpus = [
              ...resultCorpus,
              ...result.Data.Records.records.REC,
            ];
            count++;

            if (count === reqnum) {
              const id = wosReq.usrQuery + date;

              var content = {
                type: "WoS-dataset",
                fullquery: wosReq,
                query: wosReq.usrQuery,
                queryDate: date,
                altmetricEnriched: false,
                articleGeoloc: false,
                entries: resultCorpus,
              };

              pandodb.open();

              pandodb.webofscience
                .add({
                  id,
                  date,
                  name: wosReq.usrQuery,
                  content,
                })
                .then(() =>
                  pandodb.enriched.add({
                    id,
                    date,
                    name: wosReq.usrQuery,
                    content,
                  })
                )
                .then(() => {
                  window.electron.send(
                    "chaeros-notification",
                    "Web of Science API data retrieved"
                  ); // signal success to main process
                  window.electron.send("pulsar", true);
                  window.electron.send(
                    "console-logs",
                    "Web of Science dataset on " +
                      wosReq.usrQuery +
                      " for user " +
                      user +
                      " have been successfully retrieved."
                  );
                  setTimeout(() => {
                    window.electron.send("win-destroy", winId);
                  }, 500); // Close Chaeros
                });
            }
          });
      });
      //const documents = res.Data.Records.records.REC;
      //      console.log(JSON.stringify(documents[0]));
    });
};

// ========= PROBLEMATIC PAPER SCREENER ==========

// The compute function aims at:
// - taking a subsection of the PPS list, here the articles commented
//   by a (list of) PubPeer users.
// - retrieve all the problematic articles marked by these users on crossref
// - map by authors and journal, then count these
// - base on these counts, query articles written by most scored authors
//   and, if not marked as commented, show them as tentatively worth for inquiry.
//
// The purpose of this is not to target existing people publishing fake papers, but
// rather to find fake identities (authors that don't exist) used to credibilise fake
// papers (having a long author list, in some discipline, can be a mark of credibility).

const computePPS = (ppUserlist, mail) => {
  const userSpecificPPSdataMap = {};

  const totalPPS = {};

  const dataSuspect = {};

  const id = JSON.stringify(...ppUserlist);

  window.electron.invoke("getPPS", true).then((ppsFile) => {
    fs.createReadStream(ppsFile) // Read the flatfile dataset provided by the user
      .pipe(csv()) // pipe buffers to csv parser
      .on("data", (data) => {
        // add this doi to the list of papers
        totalPPS[data.Doi] = true;

        // add to the list of suspect but uncommented
        if (
          data.Detectors.indexOf("annulled") === -1 &&
          data.Pubpeerusers === "-"
        ) {
          dataSuspect[data.Doi] = true;
        }

        // then check if the pubPeer of this article
        // match the ones we're selecting from
        const users = data.Pubpeerusers.split(",");

        data.users = [];

        users.forEach((u) => data.users.push(u.trim()));

        data.users.forEach((dataUser) => {
          ppUserlist.forEach((listUser) => {
            if (dataUser === listUser) {
              userSpecificPPSdataMap[data.Doi] = data;
            }
          });
        });
      })
      .on("end", () =>
        crossRefPPS(id, userSpecificPPSdataMap, mail, totalPPS, dataSuspect)
      );
  });
};

// ======== CrossRef (+ Open Alex) PPS computation ========
// Get more info from the commented papers, most importantly their
// authors. Then, based on this information, find the 5 most present
// authors and check what they have last published.

const crossRefPPS = (
  id,
  userSpecificPPSdataMap,
  mail,
  totalPPS,
  dataSuspect
) => {
  var limiter, query;

  // Twice as fast if you're being a polite person and
  // are using a mail.
  if (mail) {
    limiter = new bottleneck({
      maxConcurrent: 4,
      minTime: 200,
    });
    query = (doi) => `https://api.crossref.org/works/${doi}?mailto=${mail}`;

    window.electron.send(
      "console-logs",
      "Request to CrossRef using email, the faster way."
    );
  } else {
    limiter = new bottleneck({
      maxConcurrent: 2,
      minTime: 500,
    });
    query = (doi) => `https://api.crossref.org/works/${doi}`;

    window.electron.send(
      "console-logs",
      "Request to CrossRef in slow mode, add email to go faster."
    );
  }

  function getAuthors(article) {
    const authors = [];
    article.author.forEach((a) =>
      authors.push({
        creatorType: "author",
        firstName: a.given,
        lastName: a.family.toUpperCase(),
      })
    );
    return authors;
  }

  const datafinish = [];

  const dataDOI = [];

  Object.keys(userSpecificPPSdataMap).forEach((d) => {
    if (d.Status != "Genuine") {
      dataDOI.push(d);
    }
  });

  if (1 && dataDOI.length > 0) {
    for (let i = 0; i < dataDOI.length; i++) {
      const DOI = dataDOI[i];

      limiter
        .schedule(() => {
          if (DOI) {
            return fetch(query(DOI));
          } else {
            return "{data:null}";
          }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((res) => {
          window.electron.send(
            "chaeros-notification",
            `CrossRef rehydration ${i + 1}/${dataDOI.length}`
          );
          if (res) {
            if (res.hasOwnProperty("message")) {
              if (res.message.hasOwnProperty("author")) {
                datafinish.push({
                  DOI,
                  creators: getAuthors(res.message),
                  article: res.message,
                });
              }
            }
          }

          if (i === dataDOI.length - 1) {
            window.electron.send("chaeros-notification", `Computing results…`);

            const authorMap = {};
            const ISSNMap = {};
            const ISBNMap = {};
            const PublisherMap = {};

            datafinish.forEach((doc) => {
              const article = doc.article;
              doc.creators.forEach((author) => {
                const authId = author.lastName + "-" + author.firstName;
                if (!authorMap.hasOwnProperty(authId)) {
                  authorMap[authId] = author;
                  authorMap[authId].count = 0;
                  authorMap[authId].ISSN = {};
                  authorMap[authId].ISBN = {};
                }
                authorMap[authId].count++;

                if (article.hasOwnProperty("ISSN")) {
                  article.ISSN.forEach((ISSN) => {
                    if (!ISSNMap.hasOwnProperty(ISSN)) {
                      ISSNMap[ISSN] = 0;
                    }
                    ISSNMap[ISSN]++;

                    if (!authorMap[authId].ISSN.hasOwnProperty(ISSN)) {
                      authorMap[authId].ISSN[ISSN] = 0;
                    }
                    authorMap[authId].ISSN[ISSN]++;
                  });
                }

                if (article.hasOwnProperty("ISBN")) {
                  article.ISBN.forEach((ISBN) => {
                    if (!ISBNMap.hasOwnProperty(ISBN)) {
                      ISBNMap[ISBN] = 0;
                    }
                    ISBNMap[ISBN]++;

                    if (!authorMap[authId].ISBN.hasOwnProperty(ISBN)) {
                      authorMap[authId].ISBN[ISBN] = 0;
                    }
                    authorMap[authId].ISBN[ISBN]++;
                  });
                }
              });

              if (!PublisherMap.hasOwnProperty(article.publisher)) {
                PublisherMap[article.publisher] = 0;
              }

              PublisherMap[article.publisher]++;
            });

            // order authors

            const authList = Object.values(authorMap).sort(
              (a, b) => b.count - a.count
            );

            // from this point onwards, check every five seconds if new papers
            // have been discovered. If that is not the case, wrap it up.

            var paperList = [];

            let previousListLength = 0;

            const timer = setInterval(() => {
              const currentLength = parseInt(paperList.length);

              if (currentLength > previousListLength) {
                previousListLength = currentLength;
              } else {
                //wrap it up

                const linkedDocuments = {};

                let probCount = 0;
                paperList.forEach((p) => {
                  if (totalPPS.hasOwnProperty(p.doi)) {
                    probCount++;
                    if (dataSuspect.hasOwnProperty(p.doi)) {
                      // if already suspect but untreated, add to the list
                      linkedDocuments[p.doi] = openAlextoCSLJSON(p);
                    }
                  } else {
                    linkedDocuments[p.doi] = openAlextoCSLJSON(p);
                  }
                });

                const finalData = Object.values(linkedDocuments);

                const date =
                  new Date().toLocaleDateString() +
                  "-" +
                  new Date().toLocaleTimeString();

                const cslDataset = {
                  id: id + date,
                  date,
                  name: "Problematic-Linked_" + id,
                  content: finalData,
                };

                pandodb.open();

                pandodb.csljson
                  .add(cslDataset)
                  .then(() => {
                    window.electron.send(
                      "chaeros-notification",
                      `Dataset retrieved`
                    );
                    window.electron.send("pulsar", true);
                    window.electron.send(
                      "console-logs",
                      "Successfully added " + id
                    ); // Log success
                    setTimeout(() => {
                      window.electron.send("win-destroy", winId);
                    }, 500);
                  })
                  .catch((err) => console.log(err));

                clearInterval(timer);
              }
            }, 5000);

            var openAlexlimiter = new bottleneck({
              maxConcurrent: 3,
              minTime: 350,
            });

            const probAuthorsLen = authList.length > 5 ? 5 : authList.length;

            let oApageCount = 0;

            for (let i = 0; i < probAuthorsLen; i++) {
              const auth = authList[i];

              // get authors with that name from OpenAlex
              openAlexlimiter
                .schedule(() =>
                  getOpenAlexAuthor(auth.firstName, auth.lastName, mail)
                )
                .then((r) => {
                  oApageCount++;
                  window.electron.send(
                    "chaeros-notification",
                    `OpenAlex Page ${oApageCount} received`
                  );

                  // for each, look up the first page of their work to see if there
                  // is a DOI match with the already found problematic papers
                  for (let j = 0; j < r.results.length; j++) {
                    const thisAuthor = r.results[j];
                    openAlexlimiter
                      .schedule(() => fetch(thisAuthor.works_api_url))
                      .then((w) => w.json())
                      .then((w) => {
                        let existsInPPS = 0;
                        w.results.forEach((art) => {
                          if (art.hasOwnProperty("doi")) {
                            if (art.doi) {
                              const doi = art.doi.replace(
                                "https://doi.org/",
                                ""
                              );

                              art.doi = doi;

                              if (totalPPS.hasOwnProperty(doi)) {
                                existsInPPS = 1;
                                if (!auth.hasOwnProperty("foundInOpenAlex")) {
                                  auth.foundInOpenAlex = [];
                                }
                                auth.foundInOpenAlex.push(doi);
                              }
                            }
                          }
                        });

                        if (existsInPPS) {
                          paperList = [...paperList, ...w.results];
                        }
                      });
                  }
                });
            }
          }
        });
    }
  } else {
    window.electron.send("chaeros-notification", `user not found`);
    window.electron.send("pulsar", true);
    setTimeout(() => {
      window.electron.send("win-destroy", winId);
    }, 500);
  }
};

// ========= OPEN ALEX ARTICLES-BY-AUTHOR ==========

const getOpenAlexAuthor = (firstName, lastName, mail) =>
  fetch(
    `https://api.openalex.org/authors?search=${firstName}%20${lastName}&mailto=${mail}`
  ).then((r) => r.json());

const openAlextoCSLJSON = (d) => {
  const article = {
    itemType: "journalArticle",
    title: d.title,
    creators: [],
    abstractNote: "",
    publicationTitle: "",
    volume: d.biblio.volume,
    issue: d.biblio.issue,
    pages: d.biblio.first_page,
    date: d.publication_date,
    series: "",
    seriesTitle: "",
    seriesText: "",
    journalAbbreviation: "",
    language: d.language,
    DOI: d.doi,
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
    relations: {},
  };

  if (d.hasOwnProperty("ISSN")) {
    article.ISSN = d.ISSN;
  }

  d.authorships.forEach((a) => {
    article.creators.push({
      creatorType: "author",
      firstName: "",
      lastName: a.raw_author_name,
    });
  });

  return article;
};

// ====== dimensions csl converter =====

const dimensionsCSLconverter = (dataset, source, normalize, email) => {
  const dimensionsToZoteroCSL = (item) => {
    const article = {
      itemType: "journalArticle",
      creators: [],
      pages: "",
      series: "",
      seriesTitle: "",
      seriesText: "",
      journalAbbreviation: "",
      language: "",
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
      relations: {},
    };

    article.title = item.Title;
    article.abstractNote = item.Abstract;
    article.publicationTitle = item["Source title"];
    article.volume = item.Volume;
    article.date = item["Publication date"];

    if (item.hasOwnProperty("DOI")) {
      article.DOI = item.DOI;
    }

    const authors = item.Authors.split("; ");

    authors.forEach((auth) => {
      const names = auth.split(", ");
      const firstName = names[0];
      var lastName = "";
      for (let i = 1; i < names.length; ++i) {
        lastName += names[i];
      }
      article.creators.push({ creatorType: "author", firstName, lastName });
    });

    article.shortTitle = JSON.stringify(item);

    return article;
  };

  window.electron.send("console-logs", "Starting istexConverter on " + dataset); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the scopus dataset is stored

    try {
      // If the file is valid, do the following:
      const articles = doc.content.entries; // Select the array filled with the targeted articles

      for (let i = 0; i < articles.length; i++) {
        const converted = dimensionsToZoteroCSL(articles[i]);

        window.electron.send(
          "chaeros-notification",
          `Converting ${i + 1}/${articles.length}`
        );

        convertedDataset.push(converted);
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset + "-converted";

      if (normalize) {
        const converted = {
          id: id,
          date: date,
          name: dataset,
          content: convertedDataset,
        };
        crossRefEnricher(converted, email);
      } else {
        pandodb.open();

        pandodb.csljson
          .add({
            id,
            date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "dimensionsConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

// ========= ISTEX RETRIEVER ==========

const istexRetriever = (query) => {
  const target = `https://api.istex.fr/document/?q=${query}&size=5000&output=*`;

  var entries = [];

  function saveContent() {
    const id = query + date;
    var content = {
      type: "ISTEX-dataset",
      fullquery: query,
      query: query,
      queryDate: date,
      altmetricEnriched: false,
      articleGeoloc: false,
      entries,
    };

    pandodb.open();

    pandodb.istex
      .add({
        id,
        date,
        name: query,
        content,
      })
      .then(() => {
        pandodb.enriched
          .add({
            id,
            date,
            name: query,
            content,
          })
          .then(() => {
            window.electron.send(
              "chaeros-notification",
              "ISTEX API data retrieved"
            ); // signal success to main process
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "ISTEX dataset on " +
                query +
                " for user " +
                user +
                " have been successfully retrieved."
            );
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500); // Close Chaeros
          });
      });
  }

  fetch(target)
    .then((res) => res.json())
    .then((r) => {
      entries = [...r.hits];

      if (entries.length < 5000) {
        saveContent();
      } else {
        const total = Math.floor(entries.length / 5000);
        for (let i = 1; i < total; i++) {
          // I'm fully aware promise chaining is a thing
          // This is a quick implementation prior to getting
          // more info on this endpoint's rate limiting.
          setTimeout(() => {
            const target = `https://api.istex.fr/document/?q=${query}&size=5000&output=*&from=${
              i * 5000
            }`;
            fetch(target)
              .then((res) => res.json())
              .then((r) => {
                entries = [...entries, ...r.hits];
                if (i === total - 1) {
                  setTimeout(saveContent, 2000);
                }
              });
          }, 2000 * i);
        }
      }
    });
};

// ====== ISTEX CONVERTER ======

const istexCSLconverter = (dataset, source, normalize, email) => {
  const istexToZoteroCSL = (item) => {
    const article = {
      itemType: "journalArticle",
      creators: [],
      pages: "",
      series: "",
      seriesTitle: "",
      seriesText: "",
      journalAbbreviation: "",
      language: "",
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
      relations: {},
    };

    article.title = item.title;
    article.abstractNote = item.abstract;
    article.publicationTitle = item.host.title;
    article.volume = item.host.volume;
    article.issue = item.host.issue;
    article.date = item.publicationDate;

    //try {
    if (item.hasOwnProperty("doi")) {
      if (item.doi.length > 0) {
        article.DOI = item.doi[0];
      }
    }

    //} catch (error) {
    //console.log("no doi");
    //}
    if (item.hasOwnProperty("host")) {
      if (item.host.hasOwnProperty("issn")) {
        if (item.host.issn.length > 0) {
          article.ISSN = item.host.issn[0];
        }
      }
    }

    item.author.forEach((auth) => {
      const names = auth.name.split(" ");
      const firstName = names[0];
      var lastName = "";
      for (let i = 1; i < names.length; ++i) {
        lastName += names[i];
      }
      article.creators.push({ creatorType: "author", firstName, lastName });
    });

    article.shortTitle = JSON.stringify(item);

    return article;
  };

  window.electron.send("console-logs", "Starting istexConverter on " + dataset); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the dataset is stored
    try {
      // If the file is valid, do the following:
      const articles = doc.content.entries; // Select the array filled with the targeted articles

      for (let i = 0; i < articles.length; i++) {
        const converted = istexToZoteroCSL(articles[i]);

        window.electron.send(
          "chaeros-notification",
          `Converting ${i + 1}/${articles.length}`
        );

        convertedDataset.push(converted);
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset + "-converted";
      if (normalize) {
        const converted = {
          id: id,
          date: date,
          name: dataset,
          content: convertedDataset,
        };
        crossRefEnricher(converted, email);
      } else {
        pandodb.open();

        pandodb.csljson
          .add({
            id,
            date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "istexConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

// ========= BnF Solr Remap ==========
// function to remap documents from BnF solr to Zotero compatible
// CSL - JSON format.

const bnfRemap = (doc, solrCollection) => {
  const remappedDocument = { itemType: "webpage" };

  const originalBnfFields = {
    title: "title",
    description: "abstractNote",
    content_type_norm: "websiteType",
    content_language: "language",
    host: "websiteTitle",
  };

  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      remappedDocument[originalBnfFields[key]] = doc[key];
    }
  }

  remappedDocument.URL =
    "http://archivesinternet.bnf.fr/" + doc.wayback_date + "/" + doc.url;

  remappedDocument.creators = [];

  if (doc.hasOwnProperty("author")) {
    if (typeof doc.author === "string") {
      remappedDocument.author = [{ lastName: doc.author }];
    } else {
      remappedDocument.author = [];
      doc.author.forEach((auth) => {
        remappedDocument.author.push({ lastName: auth });
      });
    }
  }

  remappedDocument.date = doc.crawl_date;

  delete remappedDocument.undefined;

  // Here, filter out all document links that contain "mailto"
  // The warc-indexers take all <a> elements, the mailto is potentially problematic
  // in terms of personal informations.

  const hyperlinks = [];

  if (doc.hasOwnProperty("links")) {
    doc.links.forEach((link) =>
      link.indexOf("mailto:") > -1 ? 0 : hyperlinks.push(link)
    );
  }

  remappedDocument.shortTitle = JSON.stringify({
    id: doc.id,
    collections: doc.collections,
    links: hyperlinks,
    solrCollection,
  });

  return remappedDocument;
};

// ======== GallicaFullQuery =====

const gallicaSRU2JSON = (xml) => {
  const parser = new DOMParser();
  const parseDoc = (xml) => parser.parseFromString(xml, "application/xml");
  const docToJSON = (element) => {
    const object = {};

    for (let i = 0; i < element.children.length; ++i) {
      const child = element.children[i];
      const key = child.tagName;
      if (!object.hasOwnProperty(key)) {
        object[key] = [];
      }
      object[key].push(child.textContent);
    }

    for (const key in object) {
      object[key] = object[key].toString();
    }

    return object;
  };

  const convertElements = (elementCollection) => {
    const result = [];
    for (let i = 0; i < elementCollection.length; ++i) {
      result.push(docToJSON(elementCollection[i]));
    }

    return result;
  };

  const doc = parseDoc(xml);
  return convertElements(doc.getElementsByTagName("oai_dc:dc"));
};

const dublinCore2csljson = (item) => {
  //article.creators.push({ creatorType: "author", firstName, lastName });

  const thisDoc = {
    itemType: "document",
    title: item["dc:title"],
    creators: [],
    extra: item["dc:subject"],
    abstractNote: item["dc:description"],
    publisher: item["dc:publisher"],

    date: item["dc:date"],

    libraryCatalog: item["dc:source"],
    language: item["dc:language"],
    rights: item["dc:rights"],
  };

  if (item["dc:creator"]) {
    thisDoc.creators.push({ creatorType: "author", name: item["dc:creator"] });
  }

  if (item["dc:contributor"]) {
    thisDoc.creators.push({
      creatorType: "contributor",
      name: item["dc:contributor"],
    });
  }

  const shortTitle = {
    type: item["dc:type"],
    format: item["dc:format"],
    identifier: item["dc:identifier"],
    relation: item["dc:relation"],
    coverage: item["dc:coverage"],
  };

  thisDoc.shortTitle = JSON.stringify(shortTitle);

  return thisDoc;
};

const GallicaFullQuery = (targetExpression) => {
  const limiter = new bottleneck({
    maxConcurrent: 4,
    minTime: 1000,
  });

  const max = 5000;

  const recordNum = (xml) => {
    const parser = new DOMParser(); // Gallica only yields XML, so prepare a parser
    const parseDoc = (xml) => parser.parseFromString(xml, "application/xml"); // function to parse the xml
    const doc = parseDoc(xml); // calling the function, its result is an HTML collection pointed to by the variable "doc"
    return parseInt(
      doc.getElementsByTagName("srw:numberOfRecords")[0].textContent //return the parsed content of the element containing the number of results
    );
  };

  const query = `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${targetExpression}&startRecord=1&maximumRecords=1`;

  const queryManufacture = (start) =>
    `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${targetExpression}&startRecord=${start}&maximumRecords=50`;

  fetch(query)
    .then((response) => response.text()) // parse the result as text, as the SRU only yields XML and not JSON
    .then((r) => {
      const results = recordNum(r);

      if (results < max) {
        const reqNum = Math.floor(results / 50);

        var content = [];

        for (let i = 0; i <= reqNum; i++) {
          limiter
            .schedule(() => fetch(queryManufacture(50 * i)))
            .then((res) => res.text())
            .catch((err) => console.log(err))
            .then((res) => {
              window.electron.send(
                "chaeros-notification",
                `Gallica page ${i}/${reqNum}`
              );

              content = [...content, ...gallicaSRU2JSON(res)];

              if (i === reqNum) {
                window.electron.send(
                  "chaeros-notification",
                  `Gallica retrieval complete`
                );

                const finalContent = [];

                content.forEach((doc) =>
                  finalContent.push(dublinCore2csljson(doc))
                );

                const normalized = {
                  id: targetExpression + date,
                  date: date,
                  name: targetExpression,
                  content: finalContent,
                };

                pandodb.open();
                pandodb.csljson
                  .add(normalized)
                  .then(() => {
                    window.electron.send(
                      "chaeros-notification",
                      "Gallica data retrieved"
                    ); // Send a success message
                    window.electron.send("pulsar", true);
                    window.electron.send(
                      "console-logs",
                      "Successfully converted " + targetExpression
                    ); // Log success
                    setTimeout(() => {
                      window.electron.send("win-destroy", winId);
                    }, 500);
                  })
                  .catch((err) => console.log(err));

                // - end
              }
            });
        }
      }
    });
};

// ======== CrossRef Enricher =====

const crossRefEnricher = (dataset, mail) => {
  const limiter = new bottleneck({
    maxConcurrent: 4,
    minTime: 100,
  });

  function getAuthors(article) {
    const authors = [];
    article.author.forEach((a) =>
      authors.push({
        creatorType: "author",
        firstName: a.given,
        lastName: a.family,
      })
    );
    return authors;
  }

  const query = (doi) => `https://api.crossref.org/works/${doi}?mailto=${mail}`;

  const datafinish = [];

  const data = dataset.content;

  if (1) {
    for (let i = 0; i < data.length; i++) {
      const DOI = data[i].DOI;

      limiter
        .schedule(() => {
          if (DOI) {
            return fetch(query(DOI));
          } else {
            return "{data:null}";
          }
        })
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((res) => {
          window.electron.send(
            "chaeros-notification",
            `CrossRef normalization ${i}/${data.length - 1}`
          );
          if (res) {
            if (res.hasOwnProperty("message")) {
              if (res.message.hasOwnProperty("author")) {
                datafinish.push({ DOI, creators: getAuthors(res.message) });
              }
            }
          }

          if (i === data.length - 1) {
            window.electron.send(
              "chaeros-notification",
              `CrossRef normalization successful`
            );

            data.forEach((d) => {
              datafinish.forEach((f) => {
                if (d.DOI === f.DOI) {
                  d.creators = f.creators;
                }
              });
            });

            pandodb.open();

            const normalized = {
              id: "[n]" + dataset.id + date,
              date: dataset.date,
              name: "[n]" + dataset.name,
              content: data,
            };

            pandodb.csljson
              .add(normalized)
              .then(() => {
                window.electron.send(
                  "chaeros-notification",
                  "Dataset converted"
                ); // Send a success message
                window.electron.send("pulsar", true);
                window.electron.send(
                  "console-logs",
                  "Successfully converted " + dataset
                ); // Log success
                setTimeout(() => {
                  window.electron.send("win-destroy", winId);
                }, 500);
              })
              .catch((err) => console.log(err));
          }
        });
    }
  }
};

//========== chaerosSwitch ==========
// Switch used to choose the function to execute in CHÆROS.

const chaerosSwitch = (fluxAction, fluxArgs) => {
  window.electron.send(
    "console-logs",
    "CHÆROS started a " +
      fluxAction +
      " process with the following arguments : " +
      JSON.stringify(fluxArgs)
  );

  switch (fluxAction) {
    case "computePPS":
      computePPS(fluxArgs.ppUserlist, fluxArgs.userMail);
      break;

    case "wosBuild":
      wosFullRetriever(fluxArgs.user, fluxArgs.wosquery);

      break;

    case "BNF-SOLR":
      solrMetaExplorer(
        fluxArgs.bnfsolrquery,
        fluxArgs.meta,
        fluxArgs.dateFrom,
        fluxArgs.dateTo,
        fluxArgs.targetCollections
      );
      break;

    case "regards":
      regardsRetriever(fluxArgs.regquery, fluxArgs.legislature);
      break;

    case "cslConverter":
      switch (fluxArgs.corpusType) {
        case "Scopus":
        case "Scopus-dataset":
          scopusConverter(
            fluxArgs.dataset,
            fluxArgs.source,
            fluxArgs.normalize,
            fluxArgs.userMail
          );
          break;

        case "WoS-dataset":
          webofscienceConverter(
            fluxArgs.dataset,
            fluxArgs.source,
            fluxArgs.normalize,
            fluxArgs.userMail
          );
          break;
        case "istex":
        case "ISTEX-dataset":
          istexCSLconverter(
            fluxArgs.dataset,
            fluxArgs.source,
            fluxArgs.normalize,
            fluxArgs.userMail
          );
          break;

        case "dimensions":
          dimensionsCSLconverter(
            fluxArgs.dataset,
            fluxArgs.source,
            fluxArgs.normalize,
            fluxArgs.userMail
          );
          break;

        case "ISTEX-dataset":

        default:
          break;
      }
      // end of switch in a switch
      break;

    case "scopusGeolocate":
      scopusGeolocate(fluxArgs.scopusGeolocate.dataset);
      break;

    case "GallicaFullQuery":
      GallicaFullQuery(fluxArgs.GallicaFullQuery.queryString);
      break;

    case "webofscienceGeolocate":
      webofscienceGeolocate(fluxArgs.webofscienceGeolocate.dataset);
      break;

    case "altmetricRetriever":
      altmetricRetriever(
        fluxArgs.altmetricRetriever.id,
        fluxArgs.altmetricRetriever.user
      );
      break;

    case "istexRetriever":
      istexRetriever(fluxArgs.istexQuery);
      break;

    case "scopusRetriever":
      scopusRetriever(
        fluxArgs.scopusRetriever.user,
        fluxArgs.scopusRetriever.query,
        fluxArgs.scopusRetriever.bottleneck
      );
      break;

    case "clinTriRetriever":
      clinTriRetriever(fluxArgs.clinTriRetriever.query);
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

    case "biorxivRetriever":
      biorxivRetriever(fluxArgs.biorxivRetriever.query);
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
      clinTriRetriever(fluxArgs.clinTriRetriever.query);
      break;

    case "reqISSN":
      reqISSN(fluxArgs.user, fluxArgs.reqISSN);
      break;
  }
};

//module.exports = { chaerosSwitch: chaerosSwitch }; // Export the switch as a module

ipcRenderer.on("id", (event, id) => {
  winId = id;
});

// POST MAIN WORLD CREATION
window.addEventListener("load", (event) => {
  ipcRenderer.on("chaeros-compute", (event, fluxAction, fluxArgs, message) => {
    let switchInterval = setInterval(() => {
      if (winId > 0) {
        // make sure that this chaeros process ID is known

        try {
          chaerosSwitch(fluxAction, fluxArgs);
        } catch (err) {
          window.electron.send("console-logs", err);
          window.electron.send("chaeros-failure", JSON.stringify(err));
        } finally {
          clearInterval(switchInterval);
        }
      }
    }, 50);
  });

  window.electron.send("chaeros-is-ready", "ready");
});
