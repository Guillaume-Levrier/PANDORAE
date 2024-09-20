import { biorxivRetriever } from "./api-retrievers/biorxiv-retriever";
import { solrMetaExplorer } from "./api-retrievers/bnfsolr-api-retriever";
import { clinTriRetriever } from "./api-retrievers/clinical-trials-api-retriever";
import { istexRetriever } from "./api-retrievers/istex-api-retriever";
import { regardsRetriever } from "./api-retrievers/regards-citoyens-api-retriever";
import { reqISSN } from "./api-retrievers/scopus-api-retriever";
import { wosFullRetriever } from "./api-retrievers/wos-api-retriever";
import { sysExport } from "./chaeros-to-system";
import { dimensionsCSLconverter } from "./csljson-remappers/dimensions2csljson";
import { istexCSLconverter } from "./csljson-remappers/istex2csljson";
import { scopusConverter } from "./csljson-remappers/scopus2csljson";
import { webofscienceConverter } from "./csljson-remappers/wos2csljson";
import { computePPS } from "./flatfile-parsers/pps-computer";
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

          default:
            break;
        }
        // end of switch in a switch
        break;

      case "scopusGeolocate":
        scopusGeolocate(fluxArgs.scopusGeolocate.dataset);
        break;

      case "webofscienceGeolocate":
        webofscienceGeolocate(fluxArgs.webofscienceGeolocate.dataset);
        break;

      // ==== RETRIEVERS ====

      case "GallicaFullQuery":
        GallicaFullQuery(fluxArgs.GallicaFullQuery.queryString);
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
        console.log(fluxArgs);
        zoteroItemsRetriever(
          Object.values(fluxArgs.zoteroItemsRetriever.collections),
          fluxArgs.zoteroItemsRetriever.libraryID,
          fluxArgs.zoteroItemsRetriever.importName
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
        console.log(fluxArgs.sysExport);
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
