//========== FLUX ==========
// Flux is PANDORÆ's data management system. It allows the user to fetch data from different sources, to send them to
// their own systems (such as Zotero), and re-download the (potentially hand-edited) data to PANDORÆ's data-management
// or visualisation systems.
//
// Flux uses two main patterns : direct retrieval and powerValve. Direct retrieval usually sends a single request
// to an external database in order to gauge the size of the response. The response metadata is then displayed for the
// user to choose whether they want to retrieve the full content of the response. If the user chooses to do so, the request
// is transmitted to the Main Process which re-dispatches it to Chæros. Some powerValve actions are simple data cleaning
// procedures. They can be instantaneous or a lot longer, depending on the size of the file being cleaned.
//
// Flux is a modal window, which means no other window should be accessible while it is active. powerValve closes Flux,
// but it could technically be reopened once Chæros is done processing the powerValve request. As it can be frustrating for // advanced user, this feature isn't currently enforced.

//========== REQUIRED MODULES ==========
const { ipcRenderer, shell } = require("electron"); // ipcRenderer manages messages with Main Process
const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path
const tg = require("@hownetworks/tracegraph");
const fs = require("fs"); // FileSystem reads/writes files and directories
const d3 = require("d3");

var CM = CMT["EN"];

var db = "";

var ISSNarr = [];

const date =
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//========== Tracegraph ==========

let traces = [
  {
    hops: [
      { info: { name: "USER" }, name: "USER" },
      { info: { name: "TWITTER" }, name: "TWITTER" },
      { info: { name: "SYSTEM" }, name: "SYSTEM" },
    ],
  },

  {
    hops: [
      { info: { name: "OPEN" }, name: "OPEN" },
      { info: { name: "HYPHE" }, name: "HYPHE" },
    ],
  },
];

const addHop = (steparr) => {
  const hops = {
    hops: [],
  };
  steparr.forEach((d) => hops.hops.push({ info: { name: d }, name: d }));
  traces.push(hops);
};

const drawFlux = (svg, traces, horizontal, showTexts) => {
  function makeText(selection) {
    return selection
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12);
  }

  const tmpSvg = d3
    .select("body")
    .append("svg")
    .attr("width", 720)
    .attr("height", 500);

  const tmpText = makeText(tmpSvg);

  const graph = tg
    .tracegraph()
    .horizontal(horizontal)
    .nodeSize((node) => {
      const name = node.hops[0].name;
      if (showTexts && name) {
        const bbox = tmpText.text(name).node().getBBox();
        return [bbox.width + 14, bbox.height + 8];
      }
      return name || node.hops[0].root ? [30, 30] : [10, 10];
    })
    .levelMargin(10)
    .hopDefined((hop) => hop.name || hop.root)
    .traceWidth(6)
    .nodeId((hop, hopIndex, trace, traceIndex) => {
      return (
        hop.name || (hop.root && "root") || `empty-${traceIndex}-${hopIndex}`
      );
    });

  const layout = graph(traces);

  tmpSvg.remove();

  const vb = layout.bounds.expanded(4);

  svg
    .attr("viewBox", `${vb.x} ${vb.y} ${vb.width} ${vb.height}`)
    .attr("width", 720)
    .attr("height", 500);

  const gradients = layout.nodes.map(() => tg.genUID());

  svg
    .append("defs")
    .selectAll("linearGradient")
    .data(layout.nodes.map(tg.nodeGradient))
    .enter()
    .append("linearGradient")
    .attr("id", (d, i) => gradients[i].id)
    .attr("gradientUnits", (d) => d.gradientUnits)
    .attr("x1", (d) => d.x1)
    .attr("y1", (d) => d.y1)
    .attr("x2", (d) => d.x2)
    .attr("y2", (d) => d.y2)
    .selectAll("stop")
    .data((d) => d.stops)
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr(
      "stop-color",
      (d) => d3.schemeSet2[d.traceIndex % d3.schemeSet2.length]
    );

  const traceGroup = svg
    .selectAll(".trace")
    .data(layout.traces)
    .enter()
    .append("g")
    .attr("class", "trace")
    .attr("fill", "none");
  traceGroup
    .filter((segment) => segment.defined)
    .append("path")
    .attr("stroke-width", (d) => d.width - 2)
    .attr("stroke", "white")
    .attr("d", tg.traceCurve());
  traceGroup
    .append("path")
    .attr("stroke-width", (d) => (d.defined ? d.width - 4.5 : d.width - 5))
    .attr(
      "stroke",
      (segment) => d3.schemeSet2[segment.index % d3.schemeSet2.length]
    )
    .attr("stroke-dasharray", (segment) => (segment.defined ? "" : "4 2"))
    .attr("d", tg.traceCurve());

  const nodeGroup = svg
    .selectAll(".node")
    .data(layout.nodes)
    .enter()
    .append("g")
    .attr("stroke", (d, i) => gradients[i])
    .attr("stroke-width", 2)
    .attr("fill", "white");

  const textNodes = nodeGroup
    .filter((d) => showTexts && d.hops[0].name)
    .datum((d) => ({ ...d, bounds: d.bounds.expanded(-2.5) }));
  textNodes
    .append("rect")
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("x", (d) => d.bounds.x)
    .attr("y", (d) => d.bounds.y)
    .attr("width", (d) => d.bounds.width)
    .attr("height", (d) => d.bounds.height);

  makeText(textNodes)
    .attr("x", (d) => d.bounds.cx)
    .attr("y", (d) => d.bounds.cy)
    .attr("stroke", "none")
    .attr("fill", "black")
    .attr("alignment-baseline", "central")
    .attr("text-anchor", "middle")
    .style("cursor", "pointer")
    .attr("font-size", 10)
    .text((d) => d.hops[0].info.name)
    .on("mouseenter", (event, d) => {
      //NODEGROUP STYLE
      nodeGroup.transition().duration(200).style("opacity", 0.15);
      let selectedTraces = [];
      traces.forEach((f) => {
        for (let i = 0; i < f.hops.length; i++) {
          if (f.hops[i].name === d.hops[0].name) {
            selectedTraces.push(f);
          }
        }
      });
      for (let k = 0; k < selectedTraces.length; k++) {
        for (let u = 0; u < selectedTraces[k].hops.length; u++) {
          nodeGroup
            .filter((d) => d.hops[0].name === selectedTraces[k].hops[u].name)
            .transition()
            .duration(250)
            .style("opacity", 0.65);
        }
      }

      nodeGroup
        .filter((e) => e === d)
        .transition()
        .duration(300)
        .style("opacity", 1);

      //Tracegroup
      traceGroup.transition().duration(200).style("stroke-opacity", 0.15);
      selectedTraces.forEach((signal) => {
        for (let i = 0; i < traceGroup._groups[0].length; i++) {
          if (traceGroup._groups[0][i].__data__.hops[0] === signal.hops[0]) {
            d3.select(traceGroup._groups[0][i])
              .transition()
              .duration(250)
              .style("stroke-opacity", 0.65);
          }
        }
      });
    })
    .on("mouseout", (event, d) => {
      nodeGroup.transition().duration(200).style("opacity", 1);
      traceGroup.transition().duration(200).style("stroke-opacity", 1);
    })
    .on("click", (event, d) => {
      fluxDisplay(d.hops[0].name.toLowerCase());
    });

  nodeGroup
    .filter((d) => !(showTexts && d.hops[0].name))
    .append("circle")
    .attr("r", (d) => Math.min(d.bounds.width, d.bounds.height) / 2)
    .attr("cx", (d) => d.bounds.cx)
    .attr("cy", (d) => d.bounds.cy);
};

//========== fluxDisplay ==========
// Display relevant tab when called according to the tab's id.
const fluxDisplay = (tab) => {
  db = tab;

  let tabs = document.getElementsByClassName("fluxTabs"); // Get all content DIVs by their common class

  for (let i = 0; i < tabs.length; i++) {
    // Loop on DIVs
    tabs[i].style.display = "none"; // Hide the DIVs
  }
  document.getElementById(tab).style.display = "block"; // Display the div corresponding to the clicked button
};
//========== powerValve ==========
// Some of the flux functions are not instantaneous because they can require data streams from remote services (such as
// online databases APIs), or because they are CPU intensive (data management). In order not to freeze the flux modal
// window, the following sequence is triggered through the powerValve Function:
// - those "heavy" functions are sent to the main process through the 'dataFlux' channel (and dispatched to Chæeros)
// - the flux  modal window is closed

const powerValve = (fluxAction, item) => {
  // powerValve main function

  ipcRenderer.send(
    "console-logs",
    "Actioning powerValve on " +
      JSON.stringify(item.name) +
      " through the " +
      fluxAction +
      " procedure."
  );

  let fluxArgs = {}; // Arguments are stored in an object
  let message = ""; // Creating the default message variable
  let itemname = item.name; // item argument is usually stored in "this"

  switch (
    fluxAction // According to function name ...
  ) {
    case "altmetricRetriever":
      fluxArgs.altmetricRetriever = {};
      fluxArgs.altmetricRetriever.id =
        document.getElementById("altmetricRetriever").name;
      fluxArgs.altmetricRetriever.user =
        document.getElementById("userNameInput").value;
      break;

    case "reqISSN":
      prepareISSN();
      fluxArgs.user = document.getElementById("userNameInput").value;
      fluxArgs.reqISSN = ISSNarr;
      message = "Preparing ISSN requests";
      break;

    case "regards":
      fluxArgs.regquery = document.getElementById("regardsrecherche").value;
      message = "Connecting to Regards Citoyens";
      break;

    case "scopusConverter":
      fluxArgs.scopusConverter = { dataset: "" };
      fluxArgs.scopusConverter.dataset = itemname;
      message = "Converting to CSL-JSON";
      break;

    case "scopusGeolocate":
      fluxArgs.scopusGeolocate = {};
      fluxArgs.scopusGeolocate.dataset = itemname;
      message = "Geolocating Affiliations";
      break;

    case "scopusRetriever":
      fluxArgs.scopusRetriever = { user: "", query: "" };
      fluxArgs.scopusRetriever.user =
        document.getElementById("userNameInput").value;
      fluxArgs.scopusRetriever.query = document.getElementById(
        "scopuslocalqueryinput"
      ).value;
      fluxArgs.scopusRetriever.bottleneck =
        document.getElementById("scopusRange").value;
      message = "Retrieving data from Scopus";
      break;

    case "clinTriRetriever":
      fluxArgs.clinTriRetriever = { query: "" };
      fluxArgs.clinTriRetriever.query = document.getElementById(
        "clinical_trialslocalqueryinput"
      ).value;
      message = "retrieving clinical trials info";
      break;

    case "capcoRebuilder":
      fluxArgs.capcoRebuilder = { dataFile: "", dataMatch: "" };
      fluxArgs.capcoRebuilder.dataFile = pubDebDatasetLoader();
      fluxArgs.capcoRebuilder.dataMatch = pubDeblinkDatasetLoader();
      message = "Rebuilding Public Debate dataset";
      break;

    case "sysExport":
      fluxArgs.sysExport = {};
      fluxArgs.sysExport.id = document.getElementById(
        "system-dataset-preview"
      ).name;
      fluxArgs.sysExport.name = document.getElementById("systemToType").value;
      fluxArgs.sysExport.dest = [];
      var dest = document.getElementsByClassName("sysDestCheck");
      for (let i = 0; i < dest.length; i++) {
        if (dest[i].checked) {
          fluxArgs.sysExport.dest.push(dest[i].value);
        }
      }
      message = "Exporting " + fluxArgs.sysExport.name;
      break;

    case "zoteroItemsRetriever":
      if (document.getElementById("zotitret").name === "block") {
        fluxButtonAction(
          "zotcolret",
          false,
          "Zotero Collections Successfully Retrieved",
          "Please select a destination"
        );
      } else {
        fluxArgs.zoteroItemsRetriever = {
          collections: [],
          destination: [],
        };
        var collecs = document.getElementsByClassName("zotColCheck");
        for (let i = 0; i < collecs.length; i++) {
          if (collecs[i].checked) {
            fluxArgs.zoteroItemsRetriever.collections.push({
              key: collecs[i].value,
              name: collecs[i].name,
            });
          }
        }

        fluxArgs.zoteroItemsRetriever.zoteroUser =
          document.getElementById("zoterouserinput").value;
        fluxArgs.zoteroItemsRetriever.importName = document
          .getElementById("zoteroImportName")
          .value.replace(/\s/g, "");
        message = "Retrieving user collections";
      }
      break;

    case "zoteroCollectionBuilder":
      fluxArgs.zoteroCollectionBuilder = {};
      fluxArgs.zoteroCollectionBuilder.id = document.getElementById(
        "csljson-dataset-preview"
      ).name;
      fluxArgs.zoteroCollectionBuilder.collectionName =
        document.getElementById("zoteroCollecName").value;
      fluxArgs.zoteroCollectionBuilder.zoteroUser =
        document.getElementById("zoterouserinput").value;
      break;

    case "biorxivRetriever":
      fluxArgs.biorxivRetriever = { query: {} };
      fluxArgs.biorxivRetriever.query = {
        amount: bioRxivAmount,
        terms: document.getElementById("biorxivlocalqueryinput").value,
        doi: document.getElementById("biorxiv-doi").value,
        author: document.getElementById("biorxiv-author").value,
        jcode: document.getElementById("biorxiv-list").value,
        from: document.getElementById("biorxiv-date-from").value,
        to: document.getElementById("biorxiv-date-to").value,
      };
      message = "retrieving bioRxiv data";
      break;

    case "tweetImporter":
      fluxArgs.tweetImporter = {};
      fluxArgs.tweetImporter.dataset =
        document.getElementById("twitterDataset").files[0].path;
      fluxArgs.tweetImporter.query =
        document.getElementById("twitterQuery").files[0].path;
      fluxArgs.tweetImporter.datasetName =
        document.getElementById("twitterDatasetName").value;
      message = "loading twitter dataset";
      break;
  }

  ipcRenderer.send(
    "console-logs",
    "Sending to CHÆROS action " +
      fluxAction +
      " with arguments " +
      JSON.stringify(fluxArgs) +
      " " +
      message
  );
  ipcRenderer.send("dataFlux", fluxAction, fluxArgs, message); // Send request to main process
  ipcRenderer.send("pulsar", false);
  ipcRenderer.send("window-manager", "closeWindow", "flux");
};

//========== fluxButtonAction ==========
// fluxButtonAction makes flux button change shape on click. It takes 4 arguments:
// - buttonID is the id of the DOM input button to be modified
// - success is a boolean, true means the action succeeded, false that it failed
// - successPhrase is the string to be displayed as button value (the text of the button) if success = true
// - errorPhrase is the same thing if success = false

const fluxButtonAction = (buttonID, success, successPhrase, errorPhrase) => {
  document.getElementById(buttonID).style.transition = "all 1s ease-out"; // Animate button
  document.getElementById(buttonID).style.backgroundPosition = "left bottom"; // Move background white->black
  document.getElementById(buttonID).style.color = "white"; // Change button font color to white

  if (success) {
    // If success = true
    document.getElementById(buttonID).innerText = successPhrase; // Display success phrase
  } else {
    // If success = false
    document.getElementById(buttonID).innerText = errorPhrase; // Display error phrase
  }

  // Disable button after request to prevent external request spamming and subsequent API throttling.
  document.getElementById(buttonID).disabled = true;
};

//========== datasetDisplay ==========
// datasetDisplay shows the datasets (usually JSON or CSV files) available in the relevant /datasets/ subdirectory.

const datasetDisplay = (divId, kind) => {
  try {
    // Try the following block

    let list = document.createElement("UL");

    pandodb[kind].toArray((files) => {
      files.forEach((file) => {
        let line = document.createElement("LI");
        line.id = file.id;

        let button = document.createElement("SPAN");
        button.addEventListener("click", (e) => {
          datasetDetail(
            kind + "-dataset-preview",
            kind,
            file.id,
            kind + "-dataset-buttons"
          );
        });
        button.innerText = file.name;

        let download = document.createElement("i");
        download.className = "fluxDelDataset material-icons";
        download.addEventListener("click", (e) => {
          let name = file.name + ".json";
          ipcRenderer.invoke(
            "saveDataset",
            { defaultPath: name },
            JSON.stringify(file, replacer)
          );
        });

        download.innerText = "download";

        let remove = document.createElement("i");
        remove.className = "fluxDelDataset material-icons";
        remove.addEventListener("click", (e) => {
          datasetRemove(kind, file.id);
        });
        remove.innerText = "close";

        line.appendChild(button);
        line.appendChild(remove);
        line.appendChild(download);

        list.appendChild(line);
      });

      if (files.length === 0) {
        document.getElementById(divId).innerHTML =
          "No dataset available in the system";
      } else {
        document.getElementById(divId).innerHTML = "";
        document.getElementById(divId).appendChild(list);
      }
    });
  } catch (err) {
    document.getElementById(divId).innerHTML = err; // Display error in the result div
  }
};

const datasetRemove = (kind, id) => {
  pandodb[kind].get(id).then((dataset) => {
    if (dataset.content.hasOwnProperty("path")) {
      fs.unlink(dataset.content.path, (err) => {
        if (err) throw err;
      });
    }

    pandodb[kind].delete(id);

    document
      .getElementById(id)
      .parentNode.removeChild(document.getElementById(id));
    ipcRenderer.send(
      "console-logs",
      "Removed " + id + " from database: " + kind
    );
    datasetDetail(null, kind, null, null);
  });
};
//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).

const datasetDetail = (prevId, kind, id, buttonId) => {
  // This function provides info on a specific dataset

  var datasetDetail = {}; // Create the dataDetail object
  let dataPreview = ""; // Created dataPreview variable

  if (prevId === null) {
    document.getElementById(kind + "-dataset-preview").innerText =
      "Dataset deleted";
    document.getElementById(kind + "-dataset-buttons").style.display = "none";
  } else if (kind === "hyphe") {
    hypheCorpusList(id, prevId);
  } else {
    try {
      pandodb[kind].get(id).then((doc) => {
        switch (kind) {
          case "scopus":
            dataPreview =
              "<strong>" +
              doc.name +
              "</strong>" + // dataPreview is the displayed information in the div
              "<br>Origin: Scopus" +
              "<br>Query: " +
              doc.content.query +
              "<br>Total results: " +
              doc.content.entries.length +
              "<br>Query date: " +
              doc.date;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            document.getElementById(buttonId).style.display = "block";
            document.getElementById("scopusGeolocate").name = doc.id;
            document.getElementById("altmetricRetriever").name = doc.id;

            break;

          case "enriched":
            dataPreview =
              "<strong>" +
              doc.name +
              "</strong>" + // dataPreview is the displayed information in the div
              "<br>Origin: Scopus" +
              "<br>Query: " +
              doc.content.query +
              "<br>Total results: " +
              doc.content.entries.length +
              "<br>Query date: " +
              doc.date +
              "<br>Affiliations geolocated: " +
              doc.content.articleGeoloc +
              "<br>Altmetric metadata retrieved: " +
              doc.content.altmetricEnriched;
            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(buttonId).style.display = "block";
            document.getElementById("convert-csl").style.display =
              "inline-flex";
            document.getElementById("convert-csl").name = doc.id;
            break;

          case "csljson":
            dataPreview =
              "<strong>" +
              doc.name +
              "</strong><br>Item amount : " +
              doc.content.length;
            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(prevId).name = doc.id;
            document.getElementById(buttonId).style.display = "inline-flex";
            break;

          case "system":
            let subArrayContent = "";
            if (doc.content.isArray) {
              doc.content.forEach((d) => {
                let subContent =
                  "<tr><td>" +
                  d.name +
                  "</td><td>" +
                  d.items.length +
                  " </td><td>" +
                  d.library.name +
                  "</td></tr>";
                subArrayContent += subContent;
              });
              dataPreview =
                "<br><strong>" +
                doc.name +
                "</strong><br>" +
                "Dataset date: " +
                doc.date +
                "<br><br>Arrays contained in the dataset" +
                "<br><table style='border-collapse: collapse;'><thead><tr style='border:1px solid #141414;'><th>Name</th><th>#</th><th>Origin</th></tr></thead>" +
                "<tbody>" +
                subArrayContent +
                "</tbody></table>";
            } else {
              dataPreview =
                "<br><strong>" +
                doc.name +
                "</strong><br>" +
                "Dataset date: " +
                doc.date +
                "<br>";
              "Dataset type: " + doc.content.type + "<br>";
            }
            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(prevId).name = doc.id;
            document.getElementById(buttonId).style.display = "unset";
            document.getElementById(buttonId).style.flex = "auto";
            document.getElementById("systemToType").value = doc.id;

            break;
        }
      });
    } catch (error) {
      // If it fails at one point
      document.getElementById(prevId).innerHTML = error; // Display error message
      ipcRenderer.send("console-logs", error); // Log error
    }
  }
};

//========== scopusBasicRetriever ==========
// Send a single request for a single document to Scopus in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const scopusBasicRetriever = (checker) => {
  //document.getElementById("scopus-basic-query").innerText = "Loading ...";

  let scopusQuery = document.getElementById("scopuslocalqueryinput").value; // Request Content

  ipcRenderer.send(
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
        let date = new Date();

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
          date +
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
    })
    .catch(function (e) {
      fluxButtonAction(
        "scopus-basic-query",
        false,
        "Query Basic Info Error",
        e.message
      );
      ipcRenderer.send("console-logs", "Query error : " + e); // Log error
    });
};

//========== biorxivBasicRetriever ==========
let bioRxivAmount = 0;
const biorxivBasicRetriever = () => {
  let endUrl =
    "%20numresults%3A1%20sort%3Apublication-date%20direction%3Adescending%20format_result%3Acondensed";
  let jcode = "%20jcode%3Abiorxiv";

  let reqURL =
    "https://www.biorxiv.org/search/" +
    document.getElementById("biorxivlocalqueryinput").value;

  if (document.getElementById("biorxiv-doi").value.length > 0) {
    reqURL =
      reqURL + "%20doi%3A" + document.getElementById("biorxiv-doi").value;
  }
  if (document.getElementById("biorxiv-author").value.length > 0) {
    reqURL =
      reqURL +
      "%20author1%3A" +
      document.getElementById("biorxiv-author").value;
  }

  reqURL =
    reqURL +
    jcode +
    "%20limit_from%3A" +
    document.getElementById("biorxiv-date-from").value +
    "%20limit_to%3A" +
    document.getElementById("biorxiv-date-to").value +
    endUrl;

  document.getElementById("biorxiv-basic-previewer").innerHTML =
    "Retrieving result amount...";

  let req = {
    type: "request",
    model: "biorxiv-amount-retriever",
    address: reqURL,
  };

  ipcRenderer.send("biorxiv-retrieve", req);
};

ipcRenderer.on("biorxiv-retrieve", (event, message) => {
  console.log("got answer", message);
  switch (message.type) {
    case "biorxiv-amount":
      let dataBasicPreview = "Expected amount: " + message.content;

      document.getElementById("biorxiv-basic-previewer").innerHTML =
        dataBasicPreview;

      bioRxivAmount = message.content.match(/\d+/g).join("");

      document.getElementById("biorxiv-query").style.display = "block";
      break;
  }
});

//========== clinicalBasicRetriever ==========
const clinicTrialBasicRetriever = () => {
  console.log("clintri retrieve");

  let ctQuery = document.getElementById("clinical_trialslocalqueryinput").value; // Request Content

  ipcRenderer.send(
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

      let date = new Date();

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
      fluxButtonAction(
        "clinical_trials-basic-query",
        true,
        "Query Basic Info Retrieved",
        "errorPhrase"
      );

      // Display next step option: send full request to Chæros
      document.getElementById("clinical_trials-query").style.display = "block";
    })
    .catch(function (e) {
      fluxButtonAction(
        "scopus-basic-query",
        false,
        "Query Basic Info Error",
        e.message
      );
      ipcRenderer.send("console-logs", "Query error : " + e); // Log error
    });
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
      date: date,
      id: "scopus-citedby_" + date,
      name: "scopus-citedby",
      content: citedby,
    };
    pandodb.system.add(data).then(() => {
      ipcRenderer.send("coreSignal", "poured citedby in SYSTEM"); // Sending notification to console
      ipcRenderer.send("console-logs", "Poured citedby in SYSTEM " + data.id); // Sending notification to console
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
                  console.log(aff);
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
                  console.log(affils[affName].citedBy);
                  affils[affName].citedBy += parseInt(art["citedby-count"]);
                  console.log(affils[affName].citedBy);
                });
              }
            }
          });
        }
      });
    });
    var data = {
      date: date,
      id: "scopus-affilRank_" + date,
      name: "scopus-affilRank",
      content: affils,
    };

    pandodb.system.add(data).then(() => {
      ipcRenderer.send("coreSignal", "poured citedby in SYSTEM"); // Sending notification to console
      ipcRenderer.send("console-logs", "Poured citedby in SYSTEM " + data.id); // Sending notification to console
      setTimeout(() => {
        closeWindow();
      }, 500);
    });
  });
};

//========== Scopus List ==========

const ScopusList = () => {
  ipcRenderer.send("console-logs", "Listing available scopus datasets."); // Log collection request

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
      ipcRenderer.send(
        "console-logs",
        "Error in fetching Scopus data : " + err
      ); // Log error
    });
};

//========== zoteroCollectionRetriever ==========
// Retrieve collections from a Zotero user code. To be noted that a user code can be something else than a user: it can
// also be a group library ID, allowing for group or even public work on a same Zotero/PANDORÆ corpus.

const zoteroCollectionRetriever = () => {
  let zoteroUser = document.getElementById("zoterouserinput").value; // Get the Zotero user code to request

  ipcRenderer.send(
    "console-logs",
    "Retrieving collections for Zotero id " + zoteroUser
  ); // Log collection request

  let zoteroApiKey = getPassword("Zotero", zoteroUser);
  // URL Building blocks
  let rootUrl = "https://api.zotero.org/groups/";
  let urlCollections = "/collections";
  var zoteroVersion = "&v=3&key=";

  //build the url
  let zoteroCollectionRequest =
    rootUrl + zoteroUser + urlCollections + "?" + zoteroVersion + zoteroApiKey;

  fetch(zoteroCollectionRequest)
    .then((res) => res.json())
    .then((zoteroColResponse) => {
      // With the response

      let collections = []; // Create empty 'collections' array

      for (let i = 0; i < zoteroColResponse.length; i++) {
        // Loop on the response
        let coll = {}; // Create an empty object
        coll.key = zoteroColResponse[i].data.key; // Fill it with this collection's key
        coll.name = zoteroColResponse[i].data.name; // Fill it with this collection's name
        collections.push(
          // Push a string (HTML input list) in the collections array
          "<input class='zotColCheck' value='" +
            coll.key +
            "' name='" +
            coll.name +
            "' type='checkbox'/><label> " +
            coll.key +
            " - " +
            coll.name +
            "</label><br> "
        );
      }

      var collectionList = ""; // Create the list as a string
      for (var k = 0; k < collections.length; ++k) {
        // For each element of the array
        collectionList = collectionList + collections[k]; // Add it to the string
      }

      // Display full list in div
      document.getElementById("userZoteroCollections").innerHTML =
        "<form style='line-height:1.5'>" + collectionList + "</form>";

      // Show success on button
      fluxButtonAction(
        "zotcolret",
        true,
        "Zotero Collections Successfully Retrieved",
        "errorPhrase"
      );

      // Preparing and showing additional options
      document.getElementById("zotitret").style.display = "inline-flex";
      document.getElementById("zoteroResults").style.display = "flex";
      document.getElementById("zoteroImportName").style.display = "inline-flex";
      document.getElementById("zoteroImportInstruction").style.display =
        "inline-flex";

      checkKey("zoteroAPIValidation", true);
    })
    .catch(function (err) {
      fluxButtonAction(
        "zotcolret",
        false,
        "Zotero Collections Successfully Retrieved",
        err
      );
      ipcRenderer.send(
        "console-logs",
        "Error in retrieving collections for Zotero id " +
          zoteroUser +
          " : " +
          err
      ); // Log error
    });
};

//========== zoteroLocalRetriever ==========
// This would need a custom zotero plugin - post v 1.0
// more info here https://www.zotero.org/support/dev/client_coding/connector_http_server
// and here https://github.com/zotero/zotero-connectors

const zoteroLocalRetriever = () => {
  ipcRenderer.send("console-logs", "Retrieving local Zotero collections."); // Log collection request

  let zoteroApiKey = getPassword("Zotero", zoteroUser);

  // URL Building blocks
  let rootUrl = "http://127.0.0.1:23119/";

  //build the url
  let zoteroCollectionRequest = rootUrl;

  fetch(zoteroCollectionRequest)
    .then((res) => res.json())
    .then((zoteroColResponse) => {
      // With the response

      let collections = []; // Create empty 'collections' array

      for (let i = 0; i < zoteroColResponse.length; i++) {
        // Loop on the response
        let coll = {}; // Create an empty object
        coll.key = zoteroColResponse[i].data.key; // Fill it with this collection's key
        coll.name = zoteroColResponse[i].data.name; // Fill it with this collection's name
        collections.push(
          // Push a string (HTML input list) in the collections array
          "<input class='zotColCheck' value='" +
            coll.key +
            "' name='" +
            coll.name +
            "' type='checkbox'/><label> " +
            coll.key +
            " - " +
            coll.name +
            "</label><br> "
        );
      }

      var collectionList = ""; // Create the list as a string
      for (var k = 0; k < collections.length; ++k) {
        // For each element of the array
        collectionList = collectionList + collections[k]; // Add it to the string
      }

      // Display full list in div
      document.getElementById("userZoteroCollections").innerHTML =
        "<form style='line-height:1.5'>" + collectionList + "</form>";

      // Show success on button
      fluxButtonAction(
        "zotcolret",
        true,
        "Zotero Collections Successfully Retrieved",
        "errorPhrase"
      );

      // Preparing and showing additional options
      document.getElementById("zotitret").style.display = "inline-flex";
      document.getElementById("zoteroResults").style.display = "flex";
      document.getElementById("zoteroImportName").style.display = "inline-flex";
      document.getElementById("zoteroImportInstruction").style.display =
        "inline-flex";

      checkKey("zoteroAPIValidation", true);
    })
    .catch((err) => {
      console.log(err);
      /*   fluxButtonAction ("zotcolret",false,"Zotero Collections Successfully Retrieved",err);
        ipcRenderer.send('console-logs',"Error in retrieving collections for Zotero id "+ zoteroUser + " : "+err); //  */
    });
};

//========== datasetLoader ==========
// datasetLoader allows user to load datasets from a local directory into a PANDORAE target subdirectory.

const datasetLoader = () => {
  let uploadedFiles = document.getElementById("dataset-upload").files; // Uploaded file as a variable

  let targets = [];

  var dest = document.getElementsByClassName("locDestCheck");

  for (let i = 0; i < dest.length; i++) {
    if (dest[i].checked) {
      targets.push(dest[i].value);
    }
  }

  try {
    uploadedFiles.forEach((dataset) => {
      targets.forEach((target) => {
        pandodb[target].put(dataset);
        ipcRenderer.send(
          "console-logs",
          "Dataset " +
            dataset.name +
            " loaded into " +
            JSON.stringify(target) +
            "."
        ); // Log action
      });
    });
  } catch (e) {
    ipcRenderer.send("console-logs", e); // Log error
  } finally {
    fluxButtonAction("load-local", true, "Uploaded", "");
  }
};

//========== datasetsSubdirList ==========
// List available directories for the user to upload the datasets in.
const datasetsSubdirList = (kind, dirListId) => {
  let datasetDirArray = [];

  if ((kind = "local")) {
    datasetDirArray = [
      "altmetric",
      "scopus",
      "csljson",
      "zotero",
      "twitter",
      "anthropotype",
      "chronotype",
      "geotype",
      "pharmacotype",
      "publicdebate",
      "gazouillotype",
    ];
  } else {
    datasetDirArray = kind;
  }

  var datasetDirList = ""; // Create the list as a string
  for (var i = 0; i < datasetDirArray.length; ++i) {
    // For each element of the array
    datasetDirList = datasetDirList + datasetDirArray[i]; // Add it to the string
  }
  document.getElementById(dirListId).innerHTML = datasetDirList; // The string is a <ul> list
};

// ======== endpointConnector ======

const endpointConnector = (service, target) => {
  pandodb.open();

  pandodb[service].add({
    id: target,
    date: date,
    name: target,
    content: target,
  });

  document.getElementById(service + "-exporter").innerText =
    "Added to " + service + " endpoints";
};

//======== Hyphe Endpoint Chercker ======

const hypheCheck = (target) => {
  let chk = document.getElementById("hyphe-checker");

  fetch(target + "/api/", {
    method: "POST",
    body: { method: "get_status", params: [null] },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.ok) {
        chk.style.color = "DarkOliveGreen";
        chk.innerText = "Hyphe enpoint reached";
        document.getElementById("hyphe-exporter").style.display = "block";
      } else {
        chk.style.color = "DarkRed";
        chk.innerText = "Failure";
      }
    })
    .catch((e) => {
      console.log(e);
      chk.style.color = "DarkRed";
      chk.innerText = "Failure";
    });
};

//======== Hyphe Endpoint Chercker ======

const hypheCorpusList = (target, prevId) => {
  console.log(target, prevId);

  fetch(target + "/api/", {
    method: "POST",
    body: JSON.stringify({ method: "list_corpus" }),
  })
    .then((res) => res.json())
    .then((hypheResponse) => {
      if (hypheResponse[0].code === "success") {
        let corpusList = document.createElement("UL");

        for (var corpus in hypheResponse[0].result) {
          let corpusID = hypheResponse[0].result[corpus].corpus_id;

          if (hypheResponse[0].result[corpus].password) {
            var line = document.createElement("LI");
            line.id = corpusID;

            var linCont = document.createElement("DIV");
            linCont.innerHTML =
              "<strong>" +
              hypheResponse[0].result[corpus].name +
              "</strong> - IN WE:" +
              hypheResponse[0].result[corpus].webentities_in +
              " - password : <input id=" +
              corpus +
              "pass" +
              " type='password'>";

            var load = document.createElement("INPUT");
            load.type = "button";
            load.value = "load";
            load.style.marginLeft = "10px";
            load.addEventListener("click", (e) => {
              loadHyphe(hypheResponse[0].result[corpus].corpus_id, target);
            });

            line.appendChild(linCont);
            linCont.appendChild(load);
            corpusList.appendChild(line);
          } else {
            var line = document.createElement("LI");
            line.id = corpusID;

            var linCont = document.createElement("DIV");
            linCont.innerHTML =
              "<strong>" +
              hypheResponse[0].result[corpus].name +
              "</strong> - IN WE:" +
              hypheResponse[0].result[corpus].webentities_in +
              " - ";

            var load = document.createElement("INPUT");
            load.type = "button";
            load.value = "load";
            load.addEventListener("click", (e) => {
              loadHyphe(corpusID, target);
            });

            line.appendChild(linCont);
            linCont.appendChild(load);
            corpusList.appendChild(line);
          }
        }

        document.getElementById(prevId).appendChild(corpusList); // Display dataPreview in a div
      } else {
      }
    })
    .catch((e) => {});
};

const loadHyphe = (corpus, endpoint, pass) => {
  console.log(corpus, endpoint, pass);

  let password = false;
  if (pass) {
    password = document.getElementById(corpus + "pass").value;
  }

  document.getElementById(corpus).innerHTML = "Loading corpus, please wait ...";

  var corpusRequests = [];

  fetch(endpoint + "/api/", {
    method: "POST",
    body: JSON.stringify({
      method: "start_corpus",
      params: [corpus, password],
    }),
  })
    .then((res) => res.json())
    .then((startingCorpus) => {
      let corpusStatus = startingCorpus[0].result;

      //get WE stats
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_stats",
          params: [corpus],
        }),
      });

      //get WE
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_by_status",
          params: { corpus: corpus, status: "in", count: -1 },
        }),
      });

      //get the network
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_webentities_network",
          params: { corpus: corpus },
        }),
      });

      //get the tags
      corpusRequests.push({
        method: "POST",
        body: JSON.stringify({
          method: "store.get_tags",
          params: { namespace: null, corpus: corpus },
        }),
      });

      const retrieveCorpus = () => {
        Promise.all(corpusRequests.map((d) => fetch(endpoint + "/api/", d)))
          .then((responses) => Promise.all(responses.map((res) => res.json())))
          .then((status) => {
            let success = true;

            status.forEach((answer) => {
              if (answer[0].code != "success") {
                success = false;
              }
            });

            let weStatus = status[0][0].result;

            let nodeData = status[1][0].result;

            let networkLinks = status[2][0].result;

            let tags = status[3][0].result.USER;

            corpusRequests = []; // purge the request array

            // With the response
            if (success) {
              pandodb.hyphotype.add({
                id: corpus + date,
                date: date,
                name: corpus,
                content: {
                  corpusStatus: corpusStatus,
                  weStatus: weStatus,
                  nodeData: nodeData,
                  networkLinks: networkLinks,
                  tags: tags,
                },
                corpus: true,
              });
              document.getElementById(corpus).innerHTML =
                "<mark>Corpus added to hyphotype</mark>";
            } else {
              document.getElementById(corpus).innerHTML =
                "<mark><strong>Failure</strong> - check your password or the server's endpoints</mark>";
            }
          })
          .catch((e) => {
            console.log(e);
          });
      };
      setTimeout(retrieveCorpus, 2000);
    })
    .catch((e) => {
      console.log(e);
    });
};

const twitterCat = () => {
  ipcRenderer.send("coreSignal", "importing categorized tweets"); // Sending notification to console
  ipcRenderer.send("pulsar", false);

  var datasetName = document.getElementById("twitterCatName").value;
  var datasetPath = document.getElementById("twitterCatPathInput").files[0]
    .path;

  fs.readFile(datasetPath, "utf8", (err, data) => {
    var classifiedData = JSON.parse(data);

    pandodb.open();
    let id = datasetName + date;
    pandodb.doxatype
      .add({
        id: id,
        date: date,
        name: datasetName,
        content: classifiedData,
      })
      .then(() => {
        ipcRenderer.send("coreSignal", "imported categorized tweets"); // Sending notification to console
        ipcRenderer.send("pulsar", true);
        ipcRenderer.send(
          "console-logs",
          "Imported categorized tweets " + datasetName
        ); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      });
  });
};

const twitterThread = () => {
  ipcRenderer.send("coreSignal", "importing thread"); // Sending notification to console
  ipcRenderer.send("pulsar", false);

  var datasetName = document.getElementById("twitterThreadName").value;
  var datasetPath = document.getElementById("twitterThread").files[0].path;
  var thread = [];
  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream(datasetPath),
  });

  lineReader.on("line", (line) => {
    thread.push(JSON.parse(line));
  });

  lineReader.on("close", () => {
    let id = datasetName + date;

    pandodb.filotype
      .add({
        id: id,
        date: date,
        name: datasetName,
        content: thread,
      })
      .then(() => {
        ipcRenderer.send("coreSignal", "imported thread"); // Sending notification to console
        ipcRenderer.send("pulsar", true);
        ipcRenderer.send("console-logs", "Imported thread" + datasetName); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      });
  });
};

const localUpload = () => {
  ipcRenderer.send("coreSignal", "importing local dataset"); // Sending notification to console
  ipcRenderer.send("pulsar", false);

  var datasetPath = document.getElementById("localUploadPath").files[0].path;

  fs.readFile(datasetPath, "utf8", (err, data) => {
    var data = JSON.parse(data, reviver);

    var capList = ["Content", "Id", "Date", "Name"];

    capList.forEach((d) => {
      if (data.hasOwnProperty(d)) {
        let prop = d.toLocaleLowerCase();
        data[prop] = data[d];
        delete data[d];
      }
    });

    pandodb.open();
    pandodb.system
      .add(data)
      .then(() => {
        ipcRenderer.send("coreSignal", "imported local dataset"); // Sending notification to console
        ipcRenderer.send("pulsar", true);
        ipcRenderer.send("console-logs", "Imported local dataset " + data.id); // Sending notification to console
        setTimeout(() => {
          closeWindow();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

//===== Regards Citoyens ======

const regardsBasic = () => {
  var queryContent = document.getElementById("regardsrecherche").value;
  var query =
    "https://www.nosdeputes.fr/recherche/" + queryContent + "?format=json";

  d3.json(query).then((res) => {
    let totalreq = parseInt(res.last_result / 500) + parseInt(res.last_result);
    var previewer = document.getElementById("regards-basic-previewer");
    previewer.innerHTML =
      "<br><p>Total document number:" +
      res.last_result +
      "</p>" +
      "<p>Necessary requests to obtain all document contents:" +
      totalreq +
      "</p>";

    document.getElementById("regards-query").style.display = "flex";

    if (totalreq === 0) {
      document.getElementById("regards-query").disabled = true;
    }
  });
};

//========== STARTING FLUX ==========
ipcRenderer.send("console-logs", "Opening Flux"); // Sending notification to console

const closeWindow = () => {
  ipcRenderer.send("window-manager", "closeWindow", "flux");
};

const refreshWindow = () => {
  location.reload();
};

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

const downloadData = () => {
  var id = document.getElementById("system-dataset-preview").name;

  pandodb.system.get(id).then((data) => {
    ipcRenderer.invoke(
      "saveDataset",
      { defaultPath: id + ".json" },
      JSON.stringify(data, replacer)
    );
  });
};

window.addEventListener("load", (event) => {
  var buttonMap = [
    { id: "showConsole", func: "fluxConsole" },
    { id: "scopus-list-display", func: "ScopusList" },
    { id: "user-button", func: "basicUserData" },
    {
      id: "zoteroAPIValidation",
      func: "checkKey",
      arg: "zoteroAPIValidation",
    },
    { id: "Zotero", func: "updateUserData", arg: "Zotero" },
    { id: "scopusValidation", func: "checkKey", arg: "scopusValidation" },
    { id: "Scopus", func: "updateUserData", arg: "Scopus" },
    { id: "fluxDisplayButton", func: "fluxDisplay", arg: "flux-manager" },
    { id: "fluxCloseButton", func: "closeWindow" },
    { id: "fluxRefreshButton", func: "refreshWindow" },
    { id: "hyphe-checker", func: "hypheCheck" },
    { id: "hyphe-exporter", func: "endpointConnector" },
    {
      id: "hypheDataset",
      func: "datasetDisplay",
      arg: ["hyphe-dataset-list", "hyphe"],
    },
    {
      id: "systemList",
      func: "datasetDisplay",
      arg: ["systemDatasetsList", "system"],
    },
    { id: "load-local", func: "localUpload" },
    { id: "systitret", func: "powerValve", arg: "sysExport" },
    {
      id: "clinical_trials-basic-query",
      func: "clinicTrialBasicRetriever",
    },
    {
      id: "clinical_trials-query",
      func: "powerValve",
      arg: "clinTriRetriever",
    },
    { id: "scopus-basic-query", func: "scopusBasicRetriever", arg: [] },
    { id: "scopus-query", func: "powerValve", arg: "scopusRetriever" },
    { id: "biorxiv-basic-query", func: "biorxivBasicRetriever" },
    { id: "biorxiv-query", func: "powerValve", arg: "biorxivRetriever" },
    { id: "twitterImporter", func: "powerValve", arg: "tweetImporter" },
    { id: "twitterCatImporter", func: "twitterCat" },
    { id: "twitterThreadImporter", func: "twitterThread" },
    { id: "scopusGeolocate", func: "powerValve", arg: "scopusGeolocate" },
    { id: "regards-basic-query", func: "regardsBasic" },
    { id: "regards-query", func: "powerValve", arg: "regards" },
    {
      id: "csljson-display",
      func: "datasetDisplay",
      arg: ["scopus-dataset-list", "scopus"],
    },
    { id: "convert-csl", func: "powerValve", arg: "scopusConverter" },
    {
      id: "scopus-display",
      func: "datasetDisplay",
      arg: ["enriched-dataset-list", "enriched"],
    },
    {
      id: "cslcolret",
      func: "datasetDisplay",
      arg: ["userCsljsonCollections", "csljson"],
    },
    {
      id: "zoteroCollecBuild",
      func: "powerValve",
      arg: "zoteroCollectionBuilder",
    },
    { id: "zotcolret", func: "zoteroCollectionRetriever" },
    { id: "zotitret", func: "powerValve", arg: "zoteroItemsRetriever" },
    {
      id: "issn-prepare",
      func: "powerValve",
      arg: "reqISSN",
    },
    {
      id: "export-cited-by",
      func: "exportCitedBy",
    },
    {
      id: "export-affil-rank",
      func: "affilRank",
    },

    {
      id: "downloadData",
      func: "downloadData",
    },
  ];

  const svg = d3.select("svg");

  ipcRenderer.invoke("checkflux", true).then((result) => {
    const res = JSON.parse(result);

    res.dnslist.forEach((d) => {
      if (d.valid) {
        switch (d.name) {
          case "Scopus":
            addHop(["USER", "SCOPUS", "ENRICHMENT"]);
            break;

          case "BIORXIV":
            addHop(["OPEN", "BIORXIV", "ENRICHMENT"]);
            break;

          case "Zotero":
            addHop(["ENRICHMENT", "CSL-JSON", "ZOTERO", "SYSTEM"]);
            break;

          case "Clinical Trials":
            addHop(["OPEN", "CLINICALㅤTRIALS", "SYSTEM"]);
            break;

          case "Regards Citoyens":
            addHop(["OPEN", "REGARDSCITOYENS", "CSL-JSON"]);
            break;

          default:
            break;
        }
      }
    });

    res.dnsLocalServiceList.forEach((d) => {
      if (d.valid) {
        switch (d.name) {
          case "BnF Solr Nemo 10":
            addHop(["BNF", "SYSTEM"]);
            break;

          default:
            break;
        }
      }
    });

    drawFlux(svg, traces, false, true);
  });

  function funcSwitch(e, but) {
    switch (but.func) {
      case "fluxConsole":
        ipcRenderer.invoke("fluxDevTools", true);

        var id = document.getElementById("system-dataset-preview").name;

        pandodb.system.get(id).then((data) => console.log(data));

        break;

      case "biorxivBasicRetriever":
        biorxivBasicRetriever();
        break;

      case "basicUserData":
        basicUserData();
        break;
      case "checkKey":
        checkKey(but.arg);
        break;

      case "updateUserData":
        updateUserData(but.arg);
        break;

      case "fluxDisplay":
        fluxDisplay(but.arg);
        break;

      case "closeWindow":
        closeWindow();
        break;

      case "refreshWindow":
        refreshWindow();
        break;

      case "regardsBasic":
        regardsBasic();
        break;

      case "hypheCheck":
        hypheCheck(document.getElementById("hypheaddress").value);
        break;

      case "endpointConnector":
        endpointConnector(
          "hyphe",
          document.getElementById("hypheaddress").value
        );
        break;

      case "datasetDisplay":
        datasetDisplay(but.arg[0], but.arg[1]);
        break;

      case "localUpload":
        localUpload();
        break;

      case "powerValve":
        powerValve(but.arg, e.target);
        break;

      case "clinicTrialBasicRetriever":
        clinicTrialBasicRetriever();
        break;

      case "scopusBasicRetriever":
        scopusBasicRetriever();
        break;

      case "twitterCat":
        twitterCat();
        break;

      case "twitterThread":
        twitterThread();
        break;

      case "zoteroCollectionRetriever":
        zoteroCollectionRetriever();
        break;

      case "ScopusList":
        ScopusList();
        break;

      case "exportCitedBy":
        exportCitedBy();
        break;

      case "affilRank":
        affilRank();
        break;

      case "downloadData":
        downloadData();
        break;
    }
  }

  buttonMap.forEach((but) => {
    document.getElementById(but.id).addEventListener("click", (e) => {
      funcSwitch(e, but);

      e.preventDefault();

      return false;
    });
  });
});
