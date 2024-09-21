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

  window.electron.biorxivRetrieve((event, message) => {
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

export { biorxivRetriever };
