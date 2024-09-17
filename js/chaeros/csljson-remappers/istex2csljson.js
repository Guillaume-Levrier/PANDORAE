// ====== ISTEX CONVERTER ======

import { pandodb } from "../../db";

const istexCSLconverter = (dataset, source, normalize, email) => {
  const istexToZoteroCSL = (item) => {
    const article = {
      itemType: "journalArticle",
      creators: [],
      pages: "",
      series: "",
      seriesTitle: "",
      seriesText: "",
      journalAbbreviation: "",
      language: "",
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

    article.title = item.title;
    article.abstractNote = item.abstract;
    article.publicationTitle = item.host.title;
    article.volume = item.host.volume;
    article.issue = item.host.issue;
    article.date = item.publicationDate;

    //try {
    if (item.hasOwnProperty("doi")) {
      if (item.doi.length > 0) {
        article.DOI = item.doi[0];
      }
    }

    //} catch (error) {
    //console.log("no doi");
    //}
    if (item.hasOwnProperty("host")) {
      if (item.host.hasOwnProperty("issn")) {
        if (item.host.issn.length > 0) {
          article.ISSN = item.host.issn[0];
        }
      }
    }

    item.author.forEach((auth) => {
      const names = auth.name.split(" ");
      const firstName = names[0];
      var lastName = "";
      for (let i = 1; i < names.length; ++i) {
        lastName += names[i];
      }
      article.creators.push({ creatorType: "author", firstName, lastName });
    });

    article.shortTitle = JSON.stringify(item);

    return article;
  };

  window.electron.send("console-logs", "Starting istexConverter on " + dataset); // Notify console conversion started
  let convertedDataset = []; // Create an array

  pandodb[source].get(dataset).then((doc) => {
    // Open the database in which the dataset is stored
    try {
      // If the file is valid, do the following:
      const articles = doc.content.entries; // Select the array filled with the targeted articles

      for (let i = 0; i < articles.length; i++) {
        const converted = istexToZoteroCSL(articles[i]);

        window.electron.send(
          "chaeros-notification",
          `Converting ${i + 1}/${articles.length}`
        );

        convertedDataset.push(converted);
      }
    } catch (err) {
      window.electron.send("chaeros-failure", JSON.stringify(err)); // On failure, send error notification to main process
      window.electron.send("pulsar", true);
      window.electron.send("console-logs", JSON.stringify(err)); // On failure, send error to console
    } finally {
      const id = dataset + "-converted";
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
            id,
            date,
            name: dataset,
            content: convertedDataset,
          })
          .then(() => {
            window.electron.send("chaeros-notification", "Dataset converted"); // Send a success message
            window.electron.send("pulsar", true);
            window.electron.send(
              "console-logs",
              "istexConverter successfully converted " + dataset
            ); // Log success
            setTimeout(() => {
              window.electron.send("win-destroy", winId);
            }, 500);
          });
      }
    }
  });
};

export { istexCSLconverter };
