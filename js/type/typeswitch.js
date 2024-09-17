//========== TYPES ==========
// PANDORAE is a data exploration tool. Once the user's data has been loaded through Flux
// and potentially curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain perspective, and helps the user
// discover patterns on potentially larger datasets.

import { anthropotype } from "./explorers/anthropotype";
import { webArchive } from "./explorers/webArchive";
import { chronotype } from "./explorers/chronotype";
import { doxatype } from "./explorers/doxatype";
import { fieldotype } from "./explorers/fieldotype";
import { filotype } from "./explorers/filotype";
import { gazouillotype } from "./explorers/gazouillotype";
import { geotype } from "./explorers/geotype";
import { hyphotype } from "./explorers/hyphotype";
import { pharmacotype } from "./explorers/pharmacotype";
import { regards } from "./explorers/regardotype";

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type, id) => {
  document.getElementById("field").value = "loading " + type;

  switch (type) {
    case "regards":
      regards(id);
      break;
    case "fieldotype":
      fieldotype(id);
      break;

    case "pharmacotype":
      pharmacotype(id);
      break;

    case "hyphotype":
      hyphotype(id);
      break;

    case "filotype":
      filotype(id);
      break;

    case "doxatype":
      doxatype(id);
      break;

    case "anthropotype":
      anthropotype(id);
      break;
    case "webArchive":
      webArchive(id);
      break;

    case "chronotype":
      chronotype(id);
      break;

    case "gazouillotype":
      gazouillotype(id);
      break;

    case "geotype":
      geotype(id);

      break;

    case "pharmacotype":
      pharmacotype(id);
      break;

    case "topotype":
      topotype(id);
      break;
  }

  document.getElementById("source").innerText = "Source: " + id;
};

export { typeSwitch };
