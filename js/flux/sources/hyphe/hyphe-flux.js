//======== Hyphe Endpoint Chercker ======

import { displayCorpusList } from "../../dataset";
import { powerValve } from "../../powervalve";

const hypheCheck = (args) => {
  var target = args.query;

  if (target.indexOf("/#/login") > -1) {
    target = target.replace("/#/login", "");
  }

  var hyphetarget;

  fetch(target + "/api/", {
    method: "POST",
    body: { method: "get_status", params: [null] },
    /* headers: { "Content-Type": "application/json" }, */
  })
    .then((res) => {
      if (res.ok) {
        hyphetarget = target + "/api/";
        hypheCorpusList(hyphetarget, args.resultDiv);
      } else {
        fetch(target + "-api/", {
          method: "POST",
          body: { method: "get_status", params: [null] },
          headers: { "Content-Type": "application/json" },
        }).then((res2) => {
          if (res2.ok) {
            hypheCorpusList(hyphetarget, args.resultDiv);
          }
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

//======== Hyphe Endpoint Loader ======

let lastEndpointUsed = "";

const hypheCorpusList = (target, resultDiv) =>
  fetch(target, {
    method: "POST",
    body: JSON.stringify({ method: "list_corpus" }),
  })
    .then((res) => res.json())
    .then((hypheResponse) => {
      console.log(hypheResponse);
      if (hypheResponse[0].code === "success") {
        lastEndpointUsed = target;
        const collection = [];
        for (var corpusName in hypheResponse[0].result) {
          const corpus = hypheResponse[0].result[corpusName];
          const Name = corpus.corpus_id;
          const webin = corpus.webentities_in;
          const lastActive = new Date(
            corpus.last_activity
          ).toLocaleDateString();
          collection.push({
            Name,
            "Web Entities IN": webin,
            "Last Activity": lastActive,
            Password: corpus.password,
          });
        }

        const detailDiv = document.createElement("div");
        detailDiv.style = `padding:1rem;margin:1,5rem;line-height:1.2rem;border: 1px solid #141414;display:none`;
        resultDiv.append(detailDiv);
        displayCorpusList(
          collection,
          resultDiv,
          detailDiv,
          { type: "hyphe" },
          false
        );
        resultDiv.style.display = "block";
      }
    })
    .catch((e) => {
      throw e;
    });

const loadHyphe = (corpus, password) =>
  fetch(lastEndpointUsed, {
    method: "POST",
    body: JSON.stringify({
      method: "start_corpus",
      params: [corpus, password],
    }),
  })
    .then((res) => res.json())
    .then((startingCorpus) => {
      var corpusRequests = [];
      let corpusStatus = startingCorpus[0].result;

      //get WE stats
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_stats",
          params: [corpus],
        }),
      });

      //get WE
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_by_status",
          params: { corpus, status: "in", count: -1 },
        }),
      });

      //get the network
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_network",
          params: {
            corpus,
            include_links_from_OUT: false,
            include_links_from_DISCOVERED: false,
          },
        }),
      });

      //get the tags
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_tags",
          params: { namespace: null, corpus },
        }),
      });

      const retrieveCorpus = () => {
        Promise.all(corpusRequests.map((d) => fetch(lastEndpointUsed, d)))
          .then((responses) => Promise.all(responses.map((res) => res.json())))
          .then((status) => {
            let success = true;

            status.forEach((answer) => {
              if (answer[0].code != "success") {
                success = false;
              }
            });

            let weStatus = status[0][0].result;

            let nodeData = status[1][0].result;

            let networkLinks = status[2][0].result;

            let tags = status[3][0].result.USER;

            corpusRequests = []; // purge the request array

            // With the response
            if (success) {
              const date = () =>
                new Date().toLocaleDateString() +
                "-" +
                new Date().toLocaleTimeString();

              const hypheCorpus = {
                id: corpus + date(),
                date: date(),
                name: corpus,
                source: "hyphe",
                data: {
                  corpusStatus: corpusStatus,
                  weStatus: weStatus,
                  nodeData: nodeData,
                  networkLinks: networkLinks,
                  tags: tags,
                },
                corpus: true,
              };

              powerValve("hypheImporter", hypheCorpus);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      };
      setTimeout(retrieveCorpus, 2000);
    })
    .catch((e) => {
      console.log(e);
    });

export { hypheCheck, loadHyphe };
