import {
  basicQueryResultDiv,
  addFullQueryButton,
} from "../../DOMbuilder/flux-DOM-common";

//========== istexBasicRetriever ==========
// Send a single request for a single document to ISTEX in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const istexBasicRetriever = (data) =>
  fetch(`https://api.istex.fr/document/?q=${data.query}&size=1`)
    .then((res) => res.json())
    .then((r) => {
      // get the total number of results
      const numberOfResults = r.total;

      // generate the response preview
      basicQueryResultDiv(data, r.total);

      // powervalve sends the instructons for the Chaeros (/headless) context
      // to execute
      const powervalveArguments = {
        powerAction: "istexRetriever", // string, the name of the function to call
        powerArg: {
          // object, the arguments for that function
          istexQuery: data.query,
        },
        message: "Starting ISTEX", // string, the notification message
      };

      // add a full query button
      addFullQueryButton(data, "Submit full ISTEX query", powervalveArguments);
    })
    .catch(function (e) {
      window.electron.send("console-logs", "Query error : " + e); // Log error
      throw e;
    });

export { istexBasicRetriever };
