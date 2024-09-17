// =========== DATABASE ===========

import Dexie from "dexie";

Dexie.debug = false;

let pandodb = new Dexie("PandoraeDatabase");

pandodb.version(1).stores({
  type: "type",
  flux: "source",
  system: "id",
});
pandodb.open();

export { pandodb };
