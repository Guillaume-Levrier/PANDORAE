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

export { solrMetaExplorer };
