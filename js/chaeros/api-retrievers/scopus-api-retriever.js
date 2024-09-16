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

export { scopusRetriever };
