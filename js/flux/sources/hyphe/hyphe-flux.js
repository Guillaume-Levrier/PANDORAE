import { pandodb } from "../../../db";

//======== Hyphe Endpoint Chercker ======
var hyphetarget;

const hypheCheck = (target) => {
  let chk = document.getElementById("hyphe-checker");

  if (target.indexOf("/#/login") > -1) {
    target = target.replace("/#/login", "");
  }

  fetch(target + "/api/", {
    method: "POST",
    body: { method: "get_status", params: [null] },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.ok) {
        hyphetarget = target + "/api/";
        chk.style.color = "DarkOliveGreen";
        chk.innerText = "Hyphe enpoint reached";
        document.getElementById("hyphe-exporter").style.display = "block";
      } else {
        fetch(target + "-api/", {
          method: "POST",
          body: { method: "get_status", params: [null] },
          headers: { "Content-Type": "application/json" },
        }).then((res2) => {
          if (res2.ok) {
            hyphetarget = target + "-api/";
            chk.style.color = "DarkOliveGreen";
            chk.innerText = "Hyphe enpoint reached";
            document.getElementById("hyphe-exporter").style.display = "block";
          } else {
            chk.style.color = "DarkRed";
            chk.innerText = "Failure";
          }
        });
      }
    })
    .catch((e) => {
      console.log(e);
      chk.style.color = "DarkRed";
      chk.innerText = "Failure";
    });
};

//======== Hyphe Endpoint Chercker ======

const hypheCorpusList = (target, prevId) => {
  fetch(target, {
    method: "POST",
    body: JSON.stringify({ method: "list_corpus" }),
  })
    .then((res) => res.json())
    .then((hypheResponse) => {
      if (hypheResponse[0].code === "success") {
        let corpusList = document.createElement("UL");

        for (var corpus in hypheResponse[0].result) {
          let corpusID = hypheResponse[0].result[corpus].corpus_id;

          if (hypheResponse[0].result[corpus].password) {
            var line = document.createElement("LI");
            line.id = corpusID;

            var linCont = document.createElement("DIV");
            linCont.innerHTML =
              "<strong>" +
              hypheResponse[0].result[corpus].name +
              "</strong> - IN WE:" +
              hypheResponse[0].result[corpus].webentities_in +
              " - password : <input id=" +
              corpus +
              "pass" +
              " type='password'>";

            var load = document.createElement("INPUT");
            load.type = "button";
            load.value = "load";
            load.style.marginLeft = "10px";
            load.addEventListener("click", (e) => {
              loadHyphe(hypheResponse[0].result[corpus].corpus_id, target);
            });

            line.appendChild(linCont);
            linCont.appendChild(load);
            corpusList.appendChild(line);
          } else {
            var line = document.createElement("LI");
            line.id = corpusID;

            var linCont = document.createElement("DIV");
            linCont.innerHTML =
              "<strong>" +
              hypheResponse[0].result[corpus].name +
              "</strong> - IN WE:" +
              hypheResponse[0].result[corpus].webentities_in +
              " - ";

            var load = document.createElement("INPUT");
            load.type = "button";
            load.value = "load";
            load.addEventListener("click", (e) => {
              loadHyphe(corpusID, target);
            });

            line.appendChild(linCont);
            linCont.appendChild(load);
            corpusList.appendChild(line);
          }
        }

        document.getElementById(prevId).appendChild(corpusList); // Display dataPreview in a div
      } else {
      }
    })
    .catch((e) => {});
};

const loadHyphe = (corpus, endpoint, pass) => {
  let password = false;
  if (pass) {
    password = document.getElementById(corpus + "pass").value;
  }

  document.getElementById(corpus).innerHTML = "Loading corpus, please wait ...";

  var corpusRequests = [];

  fetch(endpoint + "/api/", {
    method: "POST",
    body: JSON.stringify({
      method: "start_corpus",
      params: [corpus, password],
    }),
  })
    .then((res) => res.json())
    .then((startingCorpus) => {
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
          params: { corpus: corpus, status: "in", count: -1 },
        }),
      });

      //get the network
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_network",
          params: { corpus: corpus },
        }),
      });

      //get the tags
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_tags",
          params: { namespace: null, corpus: corpus },
        }),
      });

      const retrieveCorpus = () => {
        Promise.all(corpusRequests.map((d) => fetch(endpoint + "/api/", d)))
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
              pandodb.hyphotype.add({
                id: corpus + date(),
                date: date(),
                name: corpus,
                content: {
                  corpusStatus: corpusStatus,
                  weStatus: weStatus,
                  nodeData: nodeData,
                  networkLinks: networkLinks,
                  tags: tags,
                },
                corpus: true,
              });
              document.getElementById(corpus).innerHTML =
                "<mark>Corpus added to hyphotype</mark>";
            } else {
              document.getElementById(corpus).innerHTML =
                "<mark><strong>Failure</strong> - check your password or the server's endpoints</mark>";
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
};

// ======== endpointConnector ======

const endpointConnector = (service, target) => {
  pandodb.open();

  pandodb[service].add({
    id: target,
    date: date(),
    name: target,
    content: target,
  });

  document.getElementById(service + "-exporter").innerText =
    "Added to " + service + " endpoints";
};

export { hypheCheck, endpointConnector };
