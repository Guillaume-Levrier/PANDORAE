import bottleneck from "bottleneck";

import { dataWriter, genDate } from "../chaeros-to-system";

const solrMetaExplorer = (data) => {
  const limiter = new bottleneck({
    maxConcurrent: 3,
    minTime: 1500,
  });

  //req, meta, dateFrom, dateTo, targetCollections

  const url = (req, start, end) =>
    "http://" +
    data.query.url +
    "/solr/" +
    data.query.selectedCollection +
    "/" +
    "select?" +
    "fl=title,description,content_type_norm,content_language,host,wayback_date,author,url,links,crawl_date,id,collections" +
    "&facet.field=crawl_year&facet=on" +
    "&fq=collections:(" +
    data.query.targetfacets +
    ")&fq=crawl_date:[" +
    data.query.dateFrom +
    "T00:00:00Z" +
    "%20TO%20" +
    data.query.dateTo +
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

  if (data.query.count > 200) {
    for (let i = 0; i < data.query.count / 200 + 1; i++) {
      urlArray.push(url(data.query.query, i * 200, (i + 1) * 200));
    }
  } else {
    urlArray.push(url(data.query.query, 0, 200));

    window.electron.send(
      "console-logs",
      `First request: ${url(data.query.query, 0, 200)}`
    );
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
          totalResponse.forEach(
            (d) => (d.solrCollection = data.query.selectedCollection)
          );

          const date = genDate();

          const dataset = {
            id: data.query.query + "-" + date,
            source: "web archive",
            date,
            name: data.query.query,
            data: totalResponse,
          };

          dataWriter("flux", dataset);

          window.electron.send("chaeros-notification", `Data retrieved`);

          setTimeout(() => {
            window.electron.send("win-destroy", winId);
          }, 1000);
        }
      });
  });
};

export { solrMetaExplorer };
