import { displayInErrorDiv } from "../../DOMbuilder/flux-DOM-api-query";
import {
  basicQueryResultDiv,
  addFullQueryButton,
} from "../../DOMbuilder/flux-DOM-common";

//===== Regards Citoyens ======

const nosDeputesBasic = (data) =>
  fetch(
    `https://${
      document.getElementById("nosDeplegSelect").value
    }.nosdeputes.fr/recherche/${encodeURI(data.query)}?format=json`
  )
    .then((r) => r.json())
    .then((r) => {
      let totalreq = parseInt(r.last_result / 500) + parseInt(r.last_result);

      //purge error
      displayInErrorDiv("", "nos deputes");

      // generate the response preview
      basicQueryResultDiv(data, totalreq);

      // powervalve sends the instructons for the Chaeros (/headless) context
      // to execute
      const powervalveArguments = {
        powerAction: "nosDeputesRetriever", // string, the name of the function to call
        powerArg: {
          query: data.query,
          legislature: document.getElementById("nosDeplegSelect").value,
        },
        message: "Starting Regards Citoyens", // string, the notification message
      };

      // add a full query button
      addFullQueryButton(
        data,
        "Submit full Regards Citoyens API query",
        powervalveArguments
      );
    })
    .catch((e) => {
      basicQueryResultDiv(data, 0, true);
      displayInErrorDiv(e, "nos deputes");
      throw e;
    });

export { nosDeputesBasic };
