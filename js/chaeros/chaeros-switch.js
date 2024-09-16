import {
  zoteroCollectionBuilder,
  zoteroItemsRetriever,
} from "./zotero-chaeros";

//========== chaerosSwitch ==========
// Switch used to choose the function to execute in CHÆROS.

const chaerosSwitch = (fluxAction, fluxArgs) => {
  console.log(fluxAction, fluxArgs);

  window.electron.send(
    "console-logs",
    "CHÆROS started a " +
      fluxAction +
      " process with the following arguments : " +
      JSON.stringify(fluxArgs)
  );
  try {
    switch (fluxAction) {
      case "computePPS":
        computePPS(fluxArgs.ppUserlist, fluxArgs.userMail);
        break;

      case "wosBuild":
        wosFullRetriever(fluxArgs.user, fluxArgs.wosquery);

        break;

      case "BNF-SOLR":
        solrMetaExplorer(
          fluxArgs.bnfsolrquery,
          fluxArgs.meta,
          fluxArgs.dateFrom,
          fluxArgs.dateTo,
          fluxArgs.targetCollections
        );
        break;

      case "regards":
        regardsRetriever(fluxArgs.regquery, fluxArgs.legislature);
        break;

      case "cslConverter":
        switch (fluxArgs.corpusType) {
          case "Scopus":
          case "Scopus-dataset":
            scopusConverter(
              fluxArgs.dataset,
              fluxArgs.source,
              fluxArgs.normalize,
              fluxArgs.userMail
            );
            break;

          case "WoS-dataset":
            webofscienceConverter(
              fluxArgs.dataset,
              fluxArgs.source,
              fluxArgs.normalize,
              fluxArgs.userMail
            );
            break;
          case "istex":
          case "ISTEX-dataset":
            istexCSLconverter(
              fluxArgs.dataset,
              fluxArgs.source,
              fluxArgs.normalize,
              fluxArgs.userMail
            );
            break;

          case "dimensions":
            dimensionsCSLconverter(
              fluxArgs.dataset,
              fluxArgs.source,
              fluxArgs.normalize,
              fluxArgs.userMail
            );
            break;

          case "ISTEX-dataset":

          default:
            break;
        }
        // end of switch in a switch
        break;

      case "scopusGeolocate":
        scopusGeolocate(fluxArgs.scopusGeolocate.dataset);
        break;

      case "GallicaFullQuery":
        GallicaFullQuery(fluxArgs.GallicaFullQuery.queryString);
        break;

      case "webofscienceGeolocate":
        webofscienceGeolocate(fluxArgs.webofscienceGeolocate.dataset);
        break;

      case "altmetricRetriever":
        altmetricRetriever(
          fluxArgs.altmetricRetriever.id,
          fluxArgs.altmetricRetriever.user
        );
        break;

      case "istexRetriever":
        istexRetriever(fluxArgs.istexQuery);
        break;

      case "scopusRetriever":
        scopusRetriever(
          fluxArgs.scopusRetriever.user,
          fluxArgs.scopusRetriever.query,
          fluxArgs.scopusRetriever.bottleneck
        );
        break;

      case "clinTriRetriever":
        clinTriRetriever(fluxArgs.clinTriRetriever.query);
        break;

      case "zoteroItemsRetriever":
        zoteroItemsRetriever(
          fluxArgs.zoteroItemsRetriever.collections,
          fluxArgs.zoteroItemsRetriever.zoteroUser,
          fluxArgs.zoteroItemsRetriever.importName,
          fluxArgs.zoteroItemsRetriever.destination
        );
        break;

      case "zoteroCollectionBuilder":
        zoteroCollectionBuilder(
          fluxArgs.zoteroCollectionBuilder.collectionName,
          fluxArgs.zoteroCollectionBuilder.zoteroUser,
          fluxArgs.zoteroCollectionBuilder.id
        );
        break;

      case "biorxivRetriever":
        biorxivRetriever(fluxArgs.biorxivRetriever.query);
        break;

      case "sysExport":
        sysExport(
          fluxArgs.sysExport.dest,
          fluxArgs.sysExport.name,
          fluxArgs.sysExport.id
        );
        break;

      case "tweetImporter":
        tweetImporter(
          fluxArgs.tweetImporter.dataset,
          fluxArgs.tweetImporter.query,
          fluxArgs.tweetImporter.datasetName
        );
        break;

      case "clinTriRetriever":
        clinTriRetriever(fluxArgs.clinTriRetriever.query);
        break;

      case "reqISSN":
        reqISSN(fluxArgs.user, fluxArgs.reqISSN);
        break;
    }
  } catch (err) {
    window.electron.send("console-logs", err);
    window.electron.send("chaeros-failure", JSON.stringify(err));
    throw err;
  }
};

export { chaerosSwitch };
