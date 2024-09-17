import { pandodb } from "../../../db";
import { fluxButtonAction } from "../../actionbuttons";

var ISSNarr = [];

//========== scopusBasicRetriever ==========
// Send a single request for a single document to Scopus in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const scopusBasicRetriever = (checker) => {
  //document.getElementById("scopus-basic-query").innerText = "Loading ...";

  let scopusQuery = document.getElementById("scopuslocalqueryinput").value; // Request Content

  window.electron.send(
    "console-logs",
    "Sending Scopus the following query : " + scopusQuery
  ); // Log query

  let scopusApiKey = getPassword(
    "Scopus",
    document.getElementById("userNameInput").value
  );
  let rootUrl = "https://api.elsevier.com/content/search/scopus?query=";
  let apiProm = "&apiKey=";
  let urlCount = "&count=";
  let urlStart = "&start=";
  let docAmount = 0;

  fetch(
    rootUrl + scopusQuery + apiProm + scopusApiKey + urlCount + 1 + urlStart + 0
  )
    .then((res) => res.json())
    .then((firstResponse) => {
      // Then, once the response is retrieved
      if (checker) {
        if (firstResponse["search-results"]) {
          checkKey("scopusValidation", true);
        } else {
          checkKey("scopusValidation", false);
        }
      } else {
        // Extract relevant metadata
        let searchTerms =
          firstResponse["search-results"]["opensearch:Query"]["@searchTerms"];
        let totalResults =
          firstResponse["search-results"]["opensearch:totalResults"];
        let requestAmount = (totalResults) => {
          if (totalResults > 200) {
            return parseInt(totalResults / 200) + 1;
          } else {
            return 2;
          }
        };
        const date = () =>
          new Date().toLocaleDateString() +
          "-" +
          new Date().toLocaleTimeString();

        // Display metadata in a div
        let dataBasicPreview =
          "<strong>" +
          searchTerms +
          "</strong>" +
          "<br>Expected results at request time : " +
          totalResults +
          "<br>Amount of requests needed to retrieve full response : " +
          requestAmount(totalResults) +
          "<br>Query date: " +
          date() +
          "<br>[Reload this window to submit a different query.]<br>" +
          "<br>Amount of requests per second: <span id='scopusRangeValue'>1</span><input style='margin-left:30px' type='range' oninput='this.previousSibling.innerText=parseInt(this.value)' id='scopusRange' min='1' step='any' max='20' value='1'><br><br>";

        document.getElementById("scopus-basic-previewer").innerHTML =
          dataBasicPreview;

        // Display success in request button
        fluxButtonAction(
          "scopus-basic-query",
          true,
          "Query Basic Info Retrieved",
          "errorPhrase"
        );

        // Display next step option: send full request to Chæros
        document.getElementById("scopus-query").style.display = "block";
      }
    });
  /*
      .catch(function (e) {
  
        fluxButtonAction(
          "scopus-basic-query",
          false,
          "Query Basic Info Error",
          e.message
        );
        window.electron.send("console-logs", "Query error : " + e); // Log error
      });*/
};

var availScopus = [];

const prepareISSN = () => {
  var cols = [];

  var collecs = document.getElementsByClassName("scopColCheck");

  for (let i = 0; i < collecs.length; i++) {
    if (collecs[i].checked) {
      cols.push(collecs[i].value);
    }
  }

  availScopus.forEach((d) => {
    cols.forEach((e) => {
      if (d === e) {
        ISSNarr.push(e);
      }
    });
  });
};

const exportCitedBy = () => {
  var cols = [];
  var citedby = [];

  var collecs = document.getElementsByClassName("scopColCheck");

  for (let i = 0; i < collecs.length; i++) {
    if (collecs[i].checked) {
      cols.push(collecs[i].value);
    }
  }

  pandodb.scopus.toArray((files) => {
    files.forEach((d) => {
      cols.forEach((e) => {
        if (d.id === e) {
          d.content.entries.forEach((art) => {
            let val = {};
            val[art["prism:doi"]] = parseInt(art["citedby-count"]);
            citedby.push(val);
          });
        }
      });
    });
    var data = {
      date: date(),
      id: "scopus-citedby_" + date(),
      name: "scopus-citedby",
      content: citedby,
    };
    pandodb.system.add(data).then(() => {
      window.electron.send("coreSignal", "poured citedby in SYSTEM"); // Sending notification to console
      window.electron.send(
        "console-logs",
        "Poured citedby in SYSTEM " + data.id
      ); // Sending notification to console
      setTimeout(() => {
        closeWindow();
      }, 500);
    });
  });
};

const affilRank = () => {
  var cols = [];
  var affils = {};

  var collecs = document.getElementsByClassName("scopColCheck");

  for (let i = 0; i < collecs.length; i++) {
    if (collecs[i].checked) {
      cols.push(collecs[i].value);
    }
  }
  pandodb.scopus.toArray((files) => {
    files.forEach((d) => {
      cols.forEach((e) => {
        if (d.id === e) {
          d.content.entries.forEach((art) => {
            if (art.hasOwnProperty("affiliation")) {
              if (art.affiliation.length > 0) {
                art.affiliation.forEach((aff) => {
                  let affName = aff.affilname;

                  if (affils.hasOwnProperty(affName)) {
                  } else {
                    let area = "";

                    switch (aff["affiliation-country"]) {
                      case "China":
                        area = "CN";
                        break;

                      case "United States":
                        area = "US";
                        break;

                      default:
                        if (
                          "Austria Italy Belgium Latvia Bulgaria Lithuania Croatia Luxembourg Cyprus Malta Czech Republic Netherlands Denmark Poland Estonia Portugal Finland Romania France Slovakia Germany Slovenia Greece Spain Hungary Sweden Ireland United Kingdom".includes(
                            aff["affiliation-country"]
                          )
                        ) {
                          area = "EU";
                        } else {
                          area = "Other";
                        }
                        break;
                    }

                    affils[affName] = {
                      name: affName,
                      numCount: 0,
                      citedBy: 0,
                      city: aff["affiliation-city"],
                      area: area,
                    };
                  }

                  affils[affName].numCount++;

                  affils[affName].citedBy += parseInt(art["citedby-count"]);
                });
              }
            }
          });
        }
      });
    });
    var data = {
      date: date(),
      id: "scopus-affilRank_" + date(),
      name: "scopus-affilRank",
      content: affils,
    };

    pandodb.system.add(data).then(() => {
      window.electron.send("coreSignal", "poured citedby in SYSTEM"); // Sending notification to console
      window.electron.send(
        "console-logs",
        "Poured citedby in SYSTEM " + data.id
      ); // Sending notification to console
      setTimeout(() => {
        closeWindow();
      }, 500);
    });
  });
};

//========== Scopus List ==========

const ScopusList = () => {
  window.electron.send("console-logs", "Listing available scopus datasets."); // Log collection request

  pandodb.scopus
    .toArray((files) => {
      // With the response
      let collections = []; // Create empty 'collections' array
      for (let i = 0; i < files.length; i++) {
        availScopus.push(files[i].id);
        // Loop on the response
        let coll = {}; // Create an empty object
        coll.key = files[i].id; // Fill it with this collection's key
        coll.name = files[i].name; // Fill it with this collection's name
        collections.push(
          // Push a string (HTML input list) in the collections array
          "<input class='scopColCheck' value='" +
            coll.key +
            "' name='" +
            coll.name +
            "' type='checkbox'/><label> " +
            coll.key +
            "</label><br> "
        );
      }

      var collectionList = ""; // Create the list as a string
      for (var k = 0; k < collections.length; ++k) {
        // For each element of the array
        collectionList = collectionList + collections[k]; // Add it to the string
      }

      // Display full list in div
      document.getElementById("scopus-dataset-ISSN-list").innerHTML =
        "<form style='line-height:1.5'>" + collectionList + "</form>";

      // Show success on button

      fluxButtonAction(
        "scopus-list-display",
        true,
        "Displaying available Scopus Datasets",
        "errorPhrase"
      );

      // Preparing and showing additional options

      document.getElementById("issn-prepare").style.display = "inline-flex";
      document.getElementById("export-cited-by").style.display = "inline-flex";
      document.getElementById("export-affil-rank").style.display =
        "inline-flex";
    })
    .catch(function (err) {
      fluxButtonAction("scopus-dataset-ISSN-list", false, "Failure", err);
      window.electron.send(
        "console-logs",
        "Error in fetching Scopus data : " + err
      ); // Log error
    });
};

export { scopusBasicRetriever, ScopusList, exportCitedBy, affilRank };
