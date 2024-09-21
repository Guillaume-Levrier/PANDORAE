import bottleneck from "bottleneck";

import { dataWriter, date } from "../chaeros-to-system";

// ========= ISTEX RETRIEVER ==========

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

  pandodb.flux
    .add({
      id,
      datasetType: "istex",
      date,
      name: query,
      content,
    })
    /* .then(() => {
      pandodb.enriched
        .add({
          id,
          date,
          name: query,
          content,
        }) */
    .then(() => {
      window.electron.send("chaeros-notification", "ISTEX API data retrieved"); // signal success to main process
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
  //   });
}

const istexRetriever = (query) => {
  const limiter = new bottleneck({
    // Create a bottleneck to prevent API rate limit
    maxConcurrent: 1, // Only one request at once
    minTime: 1500, // Every 500 milliseconds
  });

  const target = `https://api.istex.fr/document/?q=${query}&size=1&output=*`;

  fetch(target)
    .then((res) => res.json())
    .then((r) => {
      const totalQueries = 1 + Math.floor(r.total / 5000);

      const requestList = [];

      var entries = [];

      for (let i = 0; i < totalQueries; i++) {
        requestList.push(
          `https://api.istex.fr/document/?q=${query}&size=5000&output=*&from=${
            i * 5000
          }`
        );
      }

      console.log(requestList);

      requestList.forEach((d) => {
        limiter
          .schedule(() => fetch(d))
          .then((res) => res.json())
          .then((result) => {
            entries = [...entries, ...result.hits];
            if (entries.length === result.total) {
            }
          });
      });

      /* 
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
      } */
    });
};

export { istexRetriever };
