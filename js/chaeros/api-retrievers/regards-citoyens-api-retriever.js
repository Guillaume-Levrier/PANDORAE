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

export { regardsRetriever };
