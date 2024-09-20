//========== clinicalBasicRetriever ==========
const clinicTrialBasicRetriever = () => {
  let ctQuery = document.getElementById("clinical_trialslocalqueryinput").value; // Request Content

  window.electron.send(
    "console-logs",
    "Sending Clinical Trial APIs the following query : " + ctQuery
  ); // Log query

  let rootUrl = "https://clinicaltrials.gov/api/query/full_studies?";

  fetch(rootUrl + "expr=" + ctQuery + "&fmt=json")
    .then((res) => res.json())
    .then((firstResponse) => {
      let totalResults = firstResponse.FullStudiesResponse.NStudiesFound;

      let requestAmount = (totalResults) => {
        if (totalResults > 100) {
          return parseInt(totalResults / 100) + 1;
        } else {
          return 2;
        }
      };

      let date =
        new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

      // Display metadata in a div
      let dataBasicPreview =
        "<strong>" +
        ctQuery +
        "</strong>" +
        "<br>Expected results at request time : " +
        totalResults +
        "<br>Amount of requests needed to retrieve full response : " +
        requestAmount(totalResults) +
        "<br>Query date: " +
        date +
        "<br>[Reload this window to submit a different query.]<br>" +
        "<br>Amount of requests per second: <span id='scopusRangeValue'>1</span><input style='margin-left:30px' type='range' oninput='this.previousSibling.innerText=parseInt(this.value)' id='scopusRange' min='1' step='any' max='20' value='1'><br><br>";

      document.getElementById("clinical_trials-basic-previewer").innerHTML =
        dataBasicPreview;

      // Display success in request button
      // Display next step option: send full request to Chæros
      document.getElementById("clinical_trials-query").style.display = "block";
    })
    .catch(function (e) {
      console.log(e);

      window.electron.send("console-logs", "Query error : " + e); // Log error
    });
};

export { clinicTrialBasicRetriever };
