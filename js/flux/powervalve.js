//========== powerValve ==========
// Some of the flux functions are not instantaneous because they can require data streams from remote services (such as
// online databases APIs), or because they are CPU intensive (data management). In order not to freeze the flux modal
// window, the following sequence is triggered through the powerValve Function:
// - those "heavy" functions are sent to the main process through the 'dataFlux' channel (and dispatched to Chæeros)
// - the flux  modal window is closed

import { closeFluxWindow } from "./window";

const powerValve = (fluxAction, item) => {
  // powerValve main function

  window.electron.send(
    "console-logs",
    "Actioning powerValve on " +
      JSON.stringify(item.name) +
      " through the " +
      fluxAction +
      " procedure."
  );

  let fluxArgs = {}; // Arguments are stored in an object
  let message = ""; // Creating the default message variable
  let itemname = item.name; // item argument is usually stored in "this"

  switch (
    fluxAction // According to function name ...
  ) {
    case "computePPS":
      const list = document.getElementById("pubPeerUserList").value.split(",");
      fluxArgs.ppUserlist = [];

      list.forEach((u) => fluxArgs.ppUserlist.push(u.trim()));

      fluxArgs.userMail = document.getElementById("userMailInput").value;

      message = "Computing PPS requests";

      break;
    case "wosBuild":
      fluxArgs.wosquery = wosReq;
      fluxArgs.user = document.getElementById("userNameInput").value;
      message = "Connecting to WoS";
      break;
    case "BNF-SOLR":
      const fieldId = item.id.replace("full", "");
      fluxArgs.bnfsolrquery = document.getElementById(fieldId).value;
      fluxArgs.meta = solrbnfcount[fluxArgs.bnfsolrquery];
      fluxArgs.targetCollections = solrbnfcount.targetCollections;

      const serv = item.id.replace("bnf-solr-fullquery-", "");

      const collections = document.getElementsByClassName(
        `bnf-solr-radio-${serv}`
      );

      fluxArgs.collections = [];

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];

        if (collection.checked) {
          fluxArgs.collections.push(collection.id);
        }
      }

      const facets = document.getElementsByClassName(
        `bnf-solr-checkbox-${serv}`
      );

      fluxArgs.facets = [];

      for (let i = 0; i < facets.length; i++) {
        const facet = facets[i];

        if (facet.checked) {
          fluxArgs.facets.push(facet.id);
        }
      }

      fluxArgs.dateFrom = document.getElementById(
        `bnf-solr-${serv}-date-from`
      ).value;

      fluxArgs.dateTo = document.getElementById(
        `bnf-solr-${serv}-date-to`
      ).value;

      message = "Connecting to BNF-SOLR";
      break;

    /* case "altmetricRetriever":
      fluxArgs.altmetricRetriever = {};
      fluxArgs.altmetricRetriever.id =
        document.getElementById("altmetricRetriever").name;
      fluxArgs.altmetricRetriever.user =
        document.getElementById("userNameInput").value;
      break; */

    case "reqISSN":
      prepareISSN();
      fluxArgs.user = document.getElementById("userNameInput").value;
      fluxArgs.reqISSN = ISSNarr;
      message = "Preparing ISSN requests";
      break;

    case "regards":
      fluxArgs.regquery = document.getElementById("regardsrecherche").value;
      fluxArgs.legislature = document.getElementById("legislature").value;
      message = "Connecting to Regards Citoyens";
      break;

    case "cslConverter":
      fluxArgs.normalize = document.getElementById("crossEnrich").checked;
      fluxArgs.userMail = document.getElementById("userMailInput").value;
      fluxArgs.source = document.getElementById("sciento-source").innerText;
      fluxArgs.corpusType =
        document.getElementById("sciento-corpusType").innerText;
      fluxArgs.dataset = document.getElementById("sciento-dataset").innerText;
      message = "Converting to CSL-JSON";
      break;

    case "GallicaFullQuery":
      const radioButtons = document.getElementsByClassName("gallicaDCradio");

      let selected;

      for (let i = 0; i < radioButtons.length; i++) {
        const rad = radioButtons[i];
        if (rad.checked && rad.value != "none") {
          selected = rad.value;
        }
      }

      var queryString;
      const targetExpression = document.getElementById(
        "gallicalocalqueryinput"
      ).value;

      if (selected) {
        queryString = `(dc.${selected} all '${targetExpression}')`;
      } else {
        queryString = targetExpression;
      }
      fluxArgs.GallicaFullQuery = { queryString };

      message = "Querying Gallica";
      break;

    case "scopusGeolocate":
      fluxArgs.scopusGeolocate = { dataset: itemname };

      message = "Geolocating Affiliations";
      break;

    case "webofscienceGeolocate":
      fluxArgs.webofscienceGeolocate = { dataset: itemname };
      //fluxArgs.webofscienceGeolocate.
      message = "Geolocating Affiliations";
      break;

    case "istexRetriever":
      fluxArgs.istexQuery = document.getElementById(
        "istexlocalqueryinput"
      ).value;

      message = "Retrieving data from ISTEX";
      break;

    case "scopusRetriever":
      fluxArgs.scopusRetriever = { user: "", query: "" };
      fluxArgs.scopusRetriever.user =
        document.getElementById("userNameInput").value;
      fluxArgs.scopusRetriever.query = document.getElementById(
        "scopuslocalqueryinput"
      ).value;
      fluxArgs.scopusRetriever.bottleneck =
        document.getElementById("scopusRange").value;
      message = "Retrieving data from Scopus";
      break;

    case "clinTriRetriever":
      fluxArgs.clinTriRetriever = { query: "" };
      fluxArgs.clinTriRetriever.query = document.getElementById(
        "clinical_trialslocalqueryinput"
      ).value;
      message = "retrieving clinical trials info";
      break;

    case "capcoRebuilder":
      fluxArgs.capcoRebuilder = { dataFile: "", dataMatch: "" };
      fluxArgs.capcoRebuilder.dataFile = pubDebDatasetLoader();
      fluxArgs.capcoRebuilder.dataMatch = pubDeblinkDatasetLoader();
      message = "Rebuilding Public Debate dataset";
      break;

    case "sysExport":
      fluxArgs.sysExport = {};
      fluxArgs.sysExport.id = item.id;
      fluxArgs.sysExport.name = item.name;
      fluxArgs.sysExport.dest = [];
      var dest = document.getElementsByClassName("sysDestCheck");
      for (let i = 0; i < dest.length; i++) {
        if (dest[i].checked) {
          fluxArgs.sysExport.dest.push(dest[i].value);
        }
      }
      message = "Exporting " + fluxArgs.sysExport.name;
      break;

    case "zoteroItemsRetriever":
      fluxArgs.zoteroItemsRetriever = {
        collections: [],
        destination: [],
      };

      var collecs = document.getElementsByClassName("zotColCheck");
      for (let i = 0; i < collecs.length; i++) {
        if (collecs[i].checked) {
          fluxArgs.zoteroItemsRetriever.collections.push({
            key: collecs[i].value,
            name: collecs[i].name,
          });
        }
      }

      fluxArgs.zoteroItemsRetriever.zoteroUser =
        document.getElementById("zoterouserinput").value;

      fluxArgs.zoteroItemsRetriever.importName = document
        .getElementById("zoteroImportName")
        .value.replace(/\s/g, "");
      message = "Retrieving user collections…";

      break;

    case "zoteroCollectionBuilder":
      fluxArgs.zoteroCollectionBuilder = {};
      fluxArgs.zoteroCollectionBuilder.id = document.getElementById(
        "csljson-dataset-preview"
      ).name;
      fluxArgs.zoteroCollectionBuilder.collectionName =
        document.getElementById("zoteroCollecName").value;
      fluxArgs.zoteroCollectionBuilder.zoteroUser =
        document.getElementById("zoterouserinput").value;
      break;

    case "biorxivRetriever":
      fluxArgs.biorxivRetriever = { query: {} };
      fluxArgs.biorxivRetriever.query = {
        amount: bioRxivAmount,
        terms: document.getElementById("biorxivlocalqueryinput").value,
        doi: document.getElementById("biorxiv-doi").value,
        author: document.getElementById("biorxiv-author").value,
        jcode: document.getElementById("biorxiv-list").value,
        from: document.getElementById("biorxiv-date-from").value,
        to: document.getElementById("biorxiv-date-to").value,
      };
      message = "retrieving bioRxiv data";
      break;

    case "tweetImporter":
      fluxArgs.tweetImporter = {};
      fluxArgs.tweetImporter.dataset =
        document.getElementById("twitterDataset").files[0].path;
      fluxArgs.tweetImporter.query =
        document.getElementById("twitterQuery").files[0].path;
      fluxArgs.tweetImporter.datasetName =
        document.getElementById("twitterDatasetName").value;
      message = "loading twitter dataset";
      break;
  }

  const logMessage = `Sending to CHÆROS action ${fluxAction} with arguments ${JSON.stringify(
    fluxArgs
  )}.`;

  window.electron.send("console-logs", logMessage);

  console.log(logMessage);

  window.electron.send("dataFlux", { fluxAction, fluxArgs, message }); // Send request to main process
  window.electron.send("pulsar", false);
  closeFluxWindow();
};

export { powerValve };
