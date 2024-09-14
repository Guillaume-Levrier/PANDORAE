//========== istexBasicRetriever ==========
// Send a single request for a single document to ISTEX in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const istexBasicRetriever = (checker) => {
  //document.getElementById("scopus-basic-query").innerText = "Loading ...";

  let query = document.getElementById("istexlocalqueryinput").value; // Request Content

  window.electron.send(
    "console-logs",
    "Sending ISTEX the following query : " + query
  ); // Log query

  const target = `https://api.istex.fr/document/?q=${query}&size=1`;

  fetch(target)
    .then((res) => res.json())
    .then((r) => {
      // Then, once the response is retrieved

      let getdate = date();

      // Display metadata in a div
      let dataBasicPreview = `<br><strong>Query: ${query}</strong><br>
        Expected results at request time: ${r.total}<br>
        Query date: ${getdate}`;

      document.getElementById("istex-basic-previewer").innerHTML =
        dataBasicPreview;

      // Display success in request button
      fluxButtonAction(
        "istex-basic-query",
        true,
        "Query Basic Info Retrieved",
        "errorPhrase"
      );

      // Display next step option: send full request to Chæros
      document.getElementById("istex-query").style.display = "block";
    })
    .catch(function (e) {
      fluxButtonAction(
        "istex-basic-query",
        false,
        "Query Basic Info Error",
        e.message
      );
      window.electron.send("console-logs", "Query error : " + e); // Log error
    });
};
