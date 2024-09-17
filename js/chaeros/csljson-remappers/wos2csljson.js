//========== webofscienceConverter ==========

import { pandodb } from "../../db";

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

export { webofscienceConverter };
