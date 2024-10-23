//========== TYPES ==========
// PANDORAE is a data exploration tool. Once the user's data has been loaded through Flux
// and potentially curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain perspective, and helps the user
// discover patterns on potentially larger datasets.

import { anthropotype } from "./explorers/anthropotype";
import { webArchive } from "./explorers/webArchive";
import { timeline } from "./explorers/timeline";
import { doxatype } from "./explorers/doxatype";
import { fieldotype } from "./explorers/fieldotype";
import { filotype } from "./explorers/filotype";
import { gazouillotype } from "./explorers/gazouillotype";
import { geotype } from "./explorers/geotype";
import { hyphe } from "./explorers/hyphe";
import { pharmacotype } from "./explorers/pharmacotype";
import { regards } from "./explorers/regardotype";

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type, data) => {
  document.getElementById("field").value = "loading " + type;

  switch (type) {
    case "regards":
      regards(data);
      break;
    case "fieldotype":
      fieldotype(data);
      break;

    case "pharmacotype":
      pharmacotype(data);
      break;

    case "hyphe":
      hyphe(data);
      break;

    case "filotype":
      filotype(data);
      break;

    case "doxatype":
      doxatype(data);
      break;

    case "anthropotype":
      anthropotype(data);
      break;
    case "webArchive":
      webArchive(data);
      break;

    case "timeline":
      timeline(data);
      break;

    case "gazouillotype":
      gazouillotype(data);
      break;

    case "geotype":
      geotype(data);

      break;

    case "pharmacotype":
      pharmacotype(data);
      break;

    case "topotype":
      topotype(data);
      break;
  }

  document.getElementById("source").innerText = "Source: " + data.id;
};

export { typeSwitch };
