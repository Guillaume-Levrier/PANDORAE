//========== FLUX ==========
// Flux is PANDORÆ's data management system. It allows the user to fetch data from different sources, to send them to
// their own systems (such as Zotero), and re-download the (potentially hand-edited) data to PANDORÆ's data-management
// or visualisation systems.
//
// Flux uses two main patterns : direct retrieval and powerValve. Direct retrieval usually sends a single request
// to an external database in order to gauge the size of the response. The response metadata is then displayed for the
// user to choose whether they want to retrieve the full content of the response. If the user chooses to do so, the request
// is transmitted to the Main Process which re-dispatches it to Chæros. Some powerValve actions are simple data cleaning
// procedures. They can be instantaneous or a lot longer, depending on the size of the file being cleaned.
//
// Flux is a modal window, which means no other window should be accessible while it is active. powerValve closes Flux,
// but it could technically be reopened once Chæros is done processing the powerValve request. As it can be frustrating for // advanced user, this feature isn't currently enforced.

//========== STARTING FLUX ==========
window.electron.send("console-logs", "Opening Flux"); // Sending notification to console

const closeWindow = () =>
  window.electron.send("windowManager", "closeWindow", "flux");

//===== Adding a new local service ======

const accessUserID = () =>
  window.electron.send("openPath", userDataPath + "/PANDORAE-DATA/userID/");

const changeUserID = () => window.electron.send("change-udp", "change");

const refreshWindow = () => location.reload();

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

window.addEventListener("load", (event) => {
  const buttonList = [
    { id: "checkPPS", func: "checkPPS" },
    //    { id: "change-user-id", func: "changeUserID" },
    { id: "manual-merge-authors", func: "manualMergeAuthors" },
    { id: "wos-basic-query", func: "wosBasicRetriever" },
    {
      id: "wos-query",
      func: "powerValve",
      arg: "wosBuild",
    },
    { id: "new-service-button", func: "addLocalService" },
    { id: "showConsole", func: "fluxConsole" },
    {
      id: "istex-list-display",
      func: "datasetDisplay",
      arg: ["istex-list", "istex"],
    },
    {
      id: "dimensions-list-display",
      func: "datasetDisplay",
      arg: ["dimensions-list", "dimensions"],
    },
    { id: "scopus-list-display", func: "ScopusList" },
    { id: "user-button", func: "basicUserData" },
    { id: "access-user-id", func: "accessUserID" },
    {
      id: "zoteroAPIValidation",
      func: "checkKey",
      arg: "zoteroAPIValidation",
    },
    { id: "Zotero", func: "updateUserData", arg: "Zotero" },
    { id: "scopusValidation", func: "checkKey", arg: "scopusValidation" },
    { id: "Scopus", func: "updateUserData", arg: "Scopus" },
    { id: "WebOfScience", func: "updateUserData", arg: "WebOfScience" },
    { id: "fluxDisplayButton", func: "fluxDisplay", arg: "flux-manager" },
    { id: "fluxCloseButton", func: "closeWindow" },
    { id: "fluxRefreshButton", func: "refreshWindow" },
    { id: "hyphe-checker", func: "hypheCheck" },
    { id: "hyphe-exporter", func: "endpointConnector" },
    {
      id: "hypheDataset",
      func: "datasetDisplay",
      arg: ["hyphe-dataset-list", "hyphe"],
    },

    {
      id: "systemList",
      func: "datasetDisplay",
      arg: ["systemDatasetsList", "system"],
    },

    { id: "load-dimensions", func: "dimensionsUpload" },
    { id: "load-local", func: "localUpload" },
    { id: "systitret", func: "powerValve", arg: "sysExport" },
    {
      id: "clinical_trials-basic-query",
      func: "clinicTrialBasicRetriever",
    },
    {
      id: "clinical_trials-query",
      func: "powerValve",
      arg: "clinTriRetriever",
    },
    { id: "scopus-basic-query", func: "scopusBasicRetriever", arg: [] },
    { id: "istex-basic-query", func: "istexBasicRetriever", arg: [] },
    { id: "scopus-query", func: "powerValve", arg: "scopusRetriever" },
    { id: "istex-query", func: "powerValve", arg: "istexRetriever" },
    { id: "biorxiv-basic-query", func: "biorxivBasicRetriever" },
    { id: "biorxiv-query", func: "powerValve", arg: "biorxivRetriever" },
    { id: "twitterImporter", func: "powerValve", arg: "tweetImporter" },
    { id: "twitterCatImporter", func: "twitterCat" },
    { id: "twitterThreadImporter", func: "twitterThread" },
    { id: "scopusGeolocate", func: "powerValve", arg: "scopusGeolocate" },
    { id: "gallica-full-query", func: "powerValve", arg: "GallicaFullQuery" },

    {
      id: "webofscienceGeolocate",
      func: "powerValve",
      arg: "webofscienceGeolocate",
    },
    { id: "regards-basic-query", func: "regardsBasic" },
    { id: "regards-query", func: "powerValve", arg: "regards" },
    { id: "gallica-basic-query", func: "gallicaBasic" },
    {
      id: "sci-api-retrieve-display",
      func: "datasetDisplay",
      arg: ["scopus-dataset-list", "scopus"],
    },
    {
      id: "sci-api-retrieve-display",
      func: "datasetDisplay",
      arg: ["webofscience-dataset-list", "webofscience"],
    },
    { id: "convert-csl", func: "powerValve", arg: "cslConverter" },
    {
      id: "sciento-db-display",
      func: "scientoDisplay",
    },
    {
      id: "cslcolret",
      func: "datasetDisplay",
      arg: ["userCsljsonCollections", "csljson"],
    },
    {
      id: "mancolret",
      func: "datasetDisplay",
      arg: ["manualCsljsonCollections", "csljson", "manual"],
    },
    {
      id: "zoteroCollecBuild",
      func: "powerValve",
      arg: "zoteroCollectionBuilder",
    },
    {
      id: "computePPS",
      func: "powerValve",
      arg: "computePPS",
    },

    { id: "zotcolret", func: "zoteroCollectionRetriever" },
    { id: "zotitret", func: "powerValve", arg: "zoteroItemsRetriever" },
    {
      id: "issn-prepare",
      func: "powerValve",
      arg: "reqISSN",
    },
    {
      id: "export-cited-by",
      func: "exportCitedBy",
    },
    {
      id: "export-affil-rank",
      func: "affilRank",
    },
    {
      id: "newServiceType",
      func: "generateLocalServiceConfig",
    },

    {
      id: "downloadData",
      func: "downloadData",
    },
    { id: "forceUpdatePPS", func: "forceUpdatePPS" },
  ];

  window.electron.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);
    updateCascade();

    const buttonList = [];

    const localServicePreviewer = document.getElementById(
      "localservices-basic-previewer"
    );

    const table = document.createElement("UL");

    localServicePreviewer.append(table);

    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          const serv = service.toUpperCase().replace(" ", "-");

          const serviceLine = document.createElement("li");
          serviceLine.style = "display:flex;justify-content: space-between;";
          const serviceName = document.createElement("div");
          serviceName.innerHTML = `- ${availability.dnsLocalServiceList[service].type} - ${service}`;
          const serviceRemove = document.createElement("div");
          serviceRemove.style = "font-weight:bold;";
          serviceRemove.innerText = "x";
          serviceRemove.addEventListener("click", () => {
            serviceLine.remove();
            removeLocalService(service);
          });
          serviceLine.append(serviceName, serviceRemove);

          table.append(serviceLine);

          const solrCont = document.createElement("div");

          solrCont.id = serv.toLowerCase();
          solrCont.style.display = "none";
          solrCont.className = "fluxTabs";

          const sourceRequest =
            "http://" +
            availability.dnsLocalServiceList[service].url +
            ":" +
            availability.dnsLocalServiceList[service].port +
            "/solr/admin/collections?action=LIST&wt=json";

          // The answer is in the array at r.collections

          var sourceSolrRadio = "";

          var coreSource; // In theory, there is only one core collection

          fetch(sourceRequest)
            .then((r) => r.json())
            .then((r) => {
              coreSource = r.collections[0];
              for (let i = 0; i < r.collections.length; i++) {
                const col = r.collections[i];
                let checked = i === 0 ? "checked" : "";

                sourceSolrRadio += `<div>
              <input type="radio" name="bnf-solr-radio-${serv}" class="bnf-solr-radio-${serv}" id="${col}"  ${checked}  />
              <label for="${col}">${col}</label>
            </div>`;
              }
            })
            .then(() => {
              const facetRequest =
                "http://" +
                availability.dnsLocalServiceList[service].url +
                ":" +
                availability.dnsLocalServiceList[service].port +
                "/solr/" +
                coreSource +
                "/select?q=*rows=0&facet=on&facet.field=collections";

              fetch(facetRequest)
                .then((facet) => facet.json())
                .then((facets) => {
                  console.log(facets);

                  const facetList =
                    facets.facet_counts.facet_fields.collections;

                  var facetCheckBox = "";

                  for (let i = 0; i < facetList.length; i++) {
                    const face = facetList[i];

                    if (typeof face === "string") {
                      let checked = i === 0 ? "checked" : "";

                      facetCheckBox += `<div>
              <input type="checkbox" name="bnf-solr-checkbox-${serv}" class="bnf-solr-checkbox-${serv}" id="${face}"  ${checked}  />
              <label for="${face}">${face}</label>
            </div>`;
                    }
                  }

                  solrCont.innerHTML = `<!-- BNF SOLR TAB -->     
            <span class="flux-title">${service.toUpperCase()}</span>
            <br><br>
            <form id="bnf-solr-form" autocomplete="off">Query:<br>
              <input class="fluxInput" spellcheck="false" id="bnf-solr-query-${serv}" type="text" value=""><br><br>
              From: <input type="date" id="bnf-solr-${serv}-date-from"> - To: <input type="date" id="bnf-solr-${serv}-date-to"><br>
              <br>Selected source:
              ${sourceSolrRadio}<br><br>
               <br>Select collection:
              ${facetCheckBox}<br><br>
              <button type="submit" class="flux-button" id="bnf-solr-basic-query-${serv}">Retrieve
                basic info</button>&nbsp;&nbsp;
              <div id="bnf-solr-basic-previewer-${serv}" style="position:relative;"></div><br><br>
              <button style="display: none;" type="submit" class="flux-button" id="bnf-solr-fullquery-${serv}">Submit Full Query</button>
              <br><br>
            </form>`;

                  document.body.append(solrCont);

                  buttonList.push({
                    id: "bnf-solr-basic-query-" + serv,
                    serv,
                    func: "queryBnFSolr",
                    args: availability.dnsLocalServiceList[service],
                  });

                  buttonList.push({
                    id: "bnf-solr-fullquery-" + serv,
                    serv,
                    func: "powerValve",
                    arg: "BNF-SOLR",
                  });

                  buttonList.forEach((but) => {
                    document
                      .getElementById(but.id)
                      .addEventListener("click", (e) => {
                        e.preventDefault();
                        funcSwitch(e, but);

                        return false;
                      });
                  });
                });
            });

          break;

        default:
          break;
      }
    }
  });

  function funcSwitch(e, but) {
    switch (but.func) {
      case "checkPPS":
        checkPPS();
        break;
      case "queryBnFSolr":
        queryBnFSolr(but);
        break;
      case "addLocalService":
        addLocalService();
        break;
      case "fluxConsole":
        window.electron.invoke("fluxDevTools", true);

        var id = document.getElementById("system-dataset-preview").name;

        //pandodb.system.get(id).then((data) => console.log(data));

        break;

      case "wosBasicRetriever":
        wosBasicRetriever();
        break;

      case "biorxivBasicRetriever":
        biorxivBasicRetriever();
        break;

      case "accessUserID":
        accessUserID();
        break;

      case "scientoDisplay":
        scientoDisplay();
        break;

      case "changeUserID":
        changeUserID();
        break;

      case "basicUserData":
        basicUserData();
        break;
      case "checkKey":
        checkKey(but.arg);
        break;

      case "forceUpdatePPS":
        forceUpdatePPS();
        break;
      case "updateUserData":
        updateUserData(but.arg);
        break;

      case "fluxDisplay":
        fluxDisplay(but.arg);
        break;

      case "closeWindow":
        closeWindow();
        break;

      case "refreshWindow":
        refreshWindow();
        break;

      case "generateLocalServiceConfig":
        generateLocalServiceConfig();
        break;

      case "gallicaBasic":
        gallicaBasic();
        break;

      case "dimensionsUpload":
        dimensionsUpload();
        break;

      case "regardsBasic":
        regardsBasic();
        break;

      case "hypheCheck":
        hypheCheck(document.getElementById("hypheaddress").value);
        break;

      case "endpointConnector":
        endpointConnector("hyphe", hyphetarget);
        break;

      case "datasetDisplay":
        datasetDisplay(but.arg[0], but.arg[1], but.arg[2]);
        break;

      case "localUpload":
        localUpload();
        break;

      case "powerValve":
        powerValve(but.arg, e.target);
        break;

      case "clinicTrialBasicRetriever":
        clinicTrialBasicRetriever();
        break;

      case "scopusBasicRetriever":
        scopusBasicRetriever();
        break;

      case "istexBasicRetriever":
        istexBasicRetriever();
        break;

      case "twitterCat":
        twitterCat();
        break;

      case "twitterThread":
        twitterThread();
        break;

      case "zoteroCollectionRetriever":
        zoteroCollectionRetriever();
        break;

      case "istexList":
        istexList();
        break;

      case "dimensionsList":
        dimensionsList();
        break;
      case "ScopusList":
        ScopusList();
        break;

      case "exportCitedBy":
        exportCitedBy();
        break;

      case "affilRank":
        affilRank();
        break;

      case "manualMergeAuthors":
        manualMergeAuthors();
        break;

      case "downloadData":
        downloadData();
        break;
    }
  }
});
