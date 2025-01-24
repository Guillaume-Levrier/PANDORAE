import { addLocalService } from "./services";
import {
  generateLocalServiceConfig,
  queryBnFSolr,
} from "./sources/webArchives/archivesinternet";
import { checkPPS, forceUpdatePPS } from "./sources/PPS/pps";
import { biorxivBasicRetriever } from "./sources/scientometrics/biorxiv";

import { wosBasicRetriever } from "./sources/scientometrics/wos";
import { changeUserID, checkKey, updateUserData } from "./userdata";

import { refreshFluxWindow } from "./window";
import { gallicaBasicRetriever } from "./sources/IIIF/gallica";
import { dimensionsUpload } from "./sources/scientometrics/dimensions";
import { nosDeputesBasic } from "./sources/parlements/regardscitoyens";
import { hypheCheck } from "./sources/hyphe/hyphe-flux";
import {
  datasetDisplay,
  downloadData,
  localUpload,
} from "./dataset/dataset-details";
import { powerValve } from "./powervalve";
import { clinicTrialBasicRetriever } from "./sources/clinicaltrials/clinicaltrials";
import { istexBasicRetriever } from "./sources/scientometrics/istex";
import { zoteroCollectionRetriever } from "./zotero-flux";

// The flux switch matches a string with a function
//
// It happens that in javascript, there is a shorthand property
// name possibility that makes it possible to declare variables
// as properties.
//
// This means that in
//
// const a = (n) => n * 2;
// const b = { a : a };
//
// can also be noted as
//
// const b = { a };
//
// In both cases, b.a(2) will return 4.
//
// more about this here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
//
// This is how this flux switch, that isn't really a switch statement anymore
// but used to be, works.

const fluxFunctions = {
  // ==================
  // User Data operations
  //
  changeUserID,
  updateUserData,
  // ==================
  // Service management
  //
  addLocalService,
  checkKey,
  generateLocalServiceConfig,
  // ==================
  // Data management
  //
  datasetDisplay,
  localUpload,
  zoteroCollectionRetriever,
  downloadData,
  // ==================
  // Basic API Probes
  //
  queryBnFSolr,
  wosBasicRetriever,
  biorxivBasicRetriever,
  gallicaBasicRetriever,
  nosDeputesBasic,
  hypheCheck,
  clinicTrialBasicRetriever,
  istexBasicRetriever,
  // ==================
  // PowerValve
  //
  powerValve,
  // ==================
  // Window management
  //
  refreshFluxWindow,
  // ==================
  // Misc
  //
  checkPPS,
  forceUpdatePPS,
  dimensionsUpload,
  //twitterThread,
};

const fluxSwitch = (funcName, args) => fluxFunctions[funcName](args);

export { fluxSwitch };
