//===== Gallica  ======
// On a given Request sent to Gallica, find how many records
// are listed in the database.

import {
  basicQueryResultDiv,
  addFullQueryButton,
} from "../../DOMbuilder/flux-DOM-common";

// Gallica only yields XML, so prepare a parser
const parser = new DOMParser();

// function to parse the xml
const parseDoc = (xml) => parser.parseFromString(xml, "application/xml");

const recordNum = (xml) => {
  // calling the function, its result is an HTML collection pointed to by the variable "doc"
  const doc = parseDoc(xml);

  //return the parsed content of the element containing the number of results
  return parseInt(
    doc.getElementsByTagName("srw:numberOfRecords")[0].textContent
  );
};

// Standard basic retriever
// Fetch the endpoint with 1 result and the total result number
const gallicaBasicRetriever = (data) =>
  fetch(
    `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${data.query}&startRecord=1&maximumRecords=1`
  )
    .then((response) => response.text()) // parse the result as text, as the SRU only yields XML and not JSON
    .then((r) => {
      // extract the number of results
      const numberOfResults = recordNum(r); // parse the text, extract the number of results,

      // generate the response preview
      basicQueryResultDiv(data, numberOfResults);

      // add a button to execute the full query
      addFullQueryButton(
        data,
        "Submit full Gallica query",
        "GallicaFullQuery",
        { query: data.query }
      );
    })
    .catch((e) => {
      window.electron.send("console-logs", "Query error : " + e); // Log error
      throw e;
    });

export { gallicaBasicRetriever };
