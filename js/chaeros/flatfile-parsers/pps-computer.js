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
export { computePPS };
