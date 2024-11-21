import { displayInErrorDiv } from "../../DOMbuilder/flux-DOM-api-query";
import {
  basicQueryResultDiv,
  addFullQueryButton,
  genHr,
} from "../../DOMbuilder/flux-DOM-common";

//===== Regards Citoyens ======

const getLegislature = () => {
  var legislature = document.getElementById("nosDeplegSelect").value;

  if (legislature === "2022-2024") {
    legislature = "";
  } else {
    legislature += ".";
  }

  return legislature;
};

const nosDeputesBasic = (data) =>
  fetch(
    `https://${getLegislature()}nosdeputes.fr/recherche/${encodeURI(
      data.query
    )}?format=json`
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

    const buildNosDeputesArguments = (data, sectionDiv) => {
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "fluxRequestOptionDiv";
  sectionDiv.append(optionsDiv);

  const legislatures = ["2007-2012", "2012-2017", "2017-2022", "2022-2024"];

  const selectElement = document.createElement("select");
  selectElement.id = "nosDeplegSelect";
  selectElement.name = "nosDeplegSelect";

  const label = document.createElement("label");
  label.innerText = "Choisissez une législature : ";
  label.for = "nosDeplegSelect";
  //<label for="pet-select">Choose a pet:</label>

  optionsDiv.append(label, selectElement);

  legislatures.forEach((leg) => {
    const optionEl = document.createElement("option");
    optionEl.innerText = leg;
    optionEl.value = leg;

    selectElement.append(optionEl);
  });
};



export { nosDeputesBasic,buildNosDeputesArguments };
