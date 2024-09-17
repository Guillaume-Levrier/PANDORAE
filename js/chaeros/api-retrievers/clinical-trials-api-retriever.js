//========== Clinical trials retriever ==========
// Once a basic scopus query has been made on an expression, the user can choose to perform the actual query.
// This retrieves all the documents corresponding to the same query (basic query only loads one in order to get the
// the total amount of documents). This is sent to chaeros via powerValve because it can be heavy, depending on the
// size of the sample and the power/broadband available on the user's system.

import { pandodb } from "../../db";

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

export { clinTriRetriever };
