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

export { wosFullRetriever };
