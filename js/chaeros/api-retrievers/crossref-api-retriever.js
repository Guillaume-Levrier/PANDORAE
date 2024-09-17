// ======== CrossRef Enricher =====

import { pandodb } from "../../db";

const crossRefEnricher = (dataset, mail) => {
  const limiter = new bottleneck({
    maxConcurrent: 4,
    minTime: 100,
  });

  function getAuthors(article) {
    const authors = [];
    article.author.forEach((a) =>
      authors.push({
        creatorType: "author",
        firstName: a.given,
        lastName: a.family,
      })
    );
    return authors;
  }

  const query = (doi) => `https://api.crossref.org/works/${doi}?mailto=${mail}`;

  const datafinish = [];

  const data = dataset.content;

  if (1) {
    for (let i = 0; i < data.length; i++) {
      const DOI = data[i].DOI;

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
            `CrossRef normalization ${i}/${data.length - 1}`
          );
          if (res) {
            if (res.hasOwnProperty("message")) {
              if (res.message.hasOwnProperty("author")) {
                datafinish.push({ DOI, creators: getAuthors(res.message) });
              }
            }
          }

          if (i === data.length - 1) {
            window.electron.send(
              "chaeros-notification",
              `CrossRef normalization successful`
            );

            data.forEach((d) => {
              datafinish.forEach((f) => {
                if (d.DOI === f.DOI) {
                  d.creators = f.creators;
                }
              });
            });

            pandodb.open();

            const normalized = {
              id: "[n]" + dataset.id + date,
              date: dataset.date,
              name: "[n]" + dataset.name,
              content: data,
            };

            pandodb.csljson
              .add(normalized)
              .then(() => {
                window.electron.send(
                  "chaeros-notification",
                  "Dataset converted"
                ); // Send a success message
                window.electron.send("pulsar", true);
                window.electron.send(
                  "console-logs",
                  "Successfully converted " + dataset
                ); // Log success
                setTimeout(() => {
                  window.electron.send("win-destroy", winId);
                }, 500);
              })
              .catch((err) => console.log(err));
          }
        });
    }
  }
};
