import { date } from "../../flux-display";
import { powerValve } from "../../powervalve";

//========== istexBasicRetriever ==========
// Send a single request for a single document to ISTEX in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const istexBasicRetriever = (data) => {
  //document.getElementById("scopus-basic-query").innerText = "Loading ...";

  window.electron.send(
    "console-logs",
    "Sending ISTEX the following query : " + data.query
  ); // Log query

  const target = `https://api.istex.fr/document/?q=${data.query}&size=1`;

  fetch(target)
    .then((res) => res.json())
    .then((r) => {
      // Then, once the response is retrieved

      let getdate = date();

      // Display metadata in a div
      let dataBasicPreview = `<strong>Query: ${data.query}</strong><br>
        Expected results at request time: ${r.total}<br>
        Query date: ${getdate}<br><br>`;

      data.resultDiv.innerHTML = dataBasicPreview;
      data.resultDiv.style.display = "block";

      // propose full query

      const fullQueryButton = document.createElement("button");
      fullQueryButton.type = "submit";
      fullQueryButton.className = "flux-button";
      fullQueryButton.innerText = "Submit full ISTEX query";
      fullQueryButton.addEventListener("click", () => {
        powerValve("istexRetriever", { istexQuery: data.query });
      });

      data.resultDiv.append(fullQueryButton);
    })
    .catch(function (e) {
      window.electron.send("console-logs", "Query error : " + e); // Log error
    });
};

export { istexBasicRetriever };
