import { addLocalService } from "./services";
import {
  generateLocalServiceConfig,
  queryBnFSolr,
} from "./sources/BNF/archivesinternet";
import { checkPPS, forceUpdatePPS } from "./sources/PPS/pps";
import { biorxivBasicRetriever } from "./sources/scientometrics/biorxiv";
import { scientoDisplay } from "./sources/scientometrics/combined";
import { wosBasicRetriever } from "./sources/scientometrics/wos";
import {
  changeUserID,
  basicUserData,
  checkKey,
  updateUserData,
} from "./userdata";
import { fluxDisplay } from "./flux-display";
import { closeFluxWindow, refreshFluxWindow } from "./window";
import { gallicaBasic } from "./sources/BNF/gallica";
import { dimensionsUpload } from "./sources/scientometrics/dimensions";
import { regardsBasic } from "./sources/parlements/regardscitoyens";
import { endpointConnector, hypheCheck } from "./sources/hyphe/hyphe-flux";
import { datasetDisplay, downloadData, localUpload } from "./dataset";
import { powerValve } from "./powervalve";
import { clinicTrialBasicRetriever } from "./sources/clinicaltrials/clinicaltrials";
import {
  affilRank,
  exportCitedBy,
  scopusBasicRetriever,
  ScopusList,
} from "./sources/scientometrics/scopus";
import { istexBasicRetriever } from "./sources/scientometrics/istex";
import { zoteroCollectionRetriever } from "./zotero-flux";

// this somehow creates a compilation bug
// to be inquired
//import { twitterCat } from "./sources/socialmedia/twitter-flux";

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
    func: "zoteroCollectionRetriever",
    //arg: "zoteroAPIValidation",
  },
  { id: "Zotero", func: "updateUserData", arg: "Zotero" },
  { id: "scopusValidation", func: "checkKey", arg: "scopusValidation" },
  { id: "Scopus", func: "updateUserData", arg: "Scopus" },
  { id: "WebOfScience", func: "updateUserData", arg: "WebOfScience" },
  { id: "fluxDisplayButton", func: "fluxDisplay", arg: "flux-manager" },
  { id: "fluxCloseButton", func: "closeFluxWindow" },
  { id: "fluxRefreshButton", func: "refreshFluxWindow" },
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

function fluxSwitch(funcName, args) {
  switch (funcName) {
    case "checkPPS":
      checkPPS();

      break;
    case "queryBnFSolr":
      queryBnFSolr(...args);
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
      checkKey(...args);
      break;

    case "forceUpdatePPS":
      forceUpdatePPS();
      break;
    case "updateUserData":
      updateUserData(...args);
      break;

    case "fluxDisplay":
      fluxDisplay(...args);
      break;

    case "closeFluxWindow":
      closeFluxWindow();
      break;

    case "refreshFluxWindow":
      refreshFluxWindow();
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
      datasetDisplay(...args);
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
      zoteroCollectionRetriever(args);
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

export { buttonList, fluxSwitch };
