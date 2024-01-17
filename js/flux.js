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
const { distance, closest } = require("fastest-levenshtein");

var CM = CMT["EN"];

var db = "";

var ISSNarr = [];

const date = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

//===== Adding a new local service ======

const accessUserID = () =>
  ipcRenderer.send("openPath", userDataPath + "/PANDORAE-DATA/userID/");

const changeUserID = () => ipcRenderer.send("change-udp", "change");

//========== Tracegraph ==========

let traces = [];

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

  if (tab === "flux-manager") {
    document.getElementById("selectCascade").style.display = "block";
  } else {
    document.getElementById("selectCascade").style.display = "none";
  }

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
    case "wosBuild":
      fluxArgs.wosquery = wosReq;
      fluxArgs.user = document.getElementById("userNameInput").value;
      message = "Connecting to WoS";
      break;
    case "BNF-SOLR":
      const fieldId = item.id.replace("full", "");
      fluxArgs.bnfsolrquery = document.getElementById(fieldId).value;
      fluxArgs.meta = solrbnfcount[fluxArgs.bnfsolrquery];

      const serv = item.id.replace("bnf-solr-fullquery-", "");

      const collections = document.getElementsByClassName(
        `bnf-solr-checkbox-${serv}`
      );

      fluxArgs.collections = [];

      // This is a WIP committed to be saved.

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];

        if (collection.checked) {
          fluxArgs.collections.push(collection.id);
        }
      }

      fluxArgs.dateFrom = document.getElementById(
        `bnf-solr-${serv}-date-from`
      ).value;

      fluxArgs.dateTo = document.getElementById(
        `bnf-solr-${serv}-date-to`
      ).value;

      message = "Connecting to BNF-SOLR";
      break;

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
      fluxArgs.legislature = document.getElementById("legislature").value;
      message = "Connecting to Regards Citoyens";
      break;

    case "cslConverter":
      fluxArgs.dataset = itemname;
      fluxArgs.corpusType = item.dataset.corpusType;
      fluxArgs.normalize = document.getElementById("crossEnrich").checked;
      fluxArgs.userMail = document.getElementById("userMailInput").value;
      message = "Converting to CSL-JSON";
      break;

    case "scopusGeolocate":
      fluxArgs.scopusGeolocate = { dataset: itemname };

      message = "Geolocating Affiliations";
      break;

    case "webofscienceGeolocate":
      fluxArgs.webofscienceGeolocate = { dataset: itemname };
      //fluxArgs.webofscienceGeolocate.
      message = "Geolocating Affiliations";
      break;

    case "istexRetriever":
      fluxArgs.istexQuery = document.getElementById(
        "istexlocalqueryinput"
      ).value;

      message = "Retrieving data from ISTEX";
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

const datasetDisplay = (divId, kind, altkind) => {
  try {
    // Try the following block

    // The altkind thing is a hack. Normally, 1 flux tab equals to 1 db.
    // With manual, we find ourselves editing/updating csl-json data.
    // Might walk this one back in the future, seems the lesser of two
    // evils right now.

    if (!altkind) {
      altkind = kind;
    }

    let list = document.createElement("UL");

    pandodb[kind].toArray((files) => {
      files.forEach((file) => {
        let line = document.createElement("LI");
        line.id = file.id;

        let button = document.createElement("SPAN");
        button.addEventListener("click", (e) => {
          datasetDetail(
            altkind + "-dataset-preview",
            kind,
            file.id,
            altkind + "-dataset-buttons"
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
    console.log(err);
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

  //var datasetDetail = {}; // Create the dataDetail object
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
          case "webofscience":
            dataPreview = `<strong> ${doc.name} </strong>
              <br>Origin: ${doc.content.type}
              <br>Query: ${doc.content.query} 
              <br>Total results: ${doc.content.entries.length} 
              <br>Query date: ${doc.date}`;

            document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
            // document.getElementById(buttonId).style.display = "block";
            document.getElementById("webofscienceGeolocate").style.display =
              "block";
            document.getElementById("webofscienceGeolocate").name = doc.id;
            //document.getElementById("altmetricRetriever").name = doc.id;

            break;
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
            //document.getElementById(buttonId).style.display = "block";
            document.getElementById("scopusGeolocate").style.display = "block";
            document.getElementById("scopusGeolocate").name = doc.id;
            //document.getElementById("altmetricRetriever").name = doc.id;

            break;

          case "enriched":
            dataPreview = `<strong>${doc.name} </strong>
              <br>Origin: ${doc.content.type}
              <br>Query: ${doc.content.query}
              <br>Total results: ${doc.content.entries.length}
              <br>Query date: ${doc.date}
              <br>Affiliations geolocated:${doc.content.articleGeoloc}
              <br>Altmetric metadata retrieved: ${doc.content.altmetricEnriched}`;

            document.getElementById(prevId).innerHTML = dataPreview;
            document.getElementById(buttonId).style.display = "block";
            const convertButton = document.getElementById("convert-csl");
            convertButton.style.display = "inline-flex";
            convertButton.name = doc.id;
            convertButton.dataset.corpusType = doc.content.type;
            break;

          case "manual":
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

//========== istexBasicRetriever ==========
// Send a single request for a single document to ISTEX in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const istexBasicRetriever = (checker) => {
  //document.getElementById("scopus-basic-query").innerText = "Loading ...";

  let query = document.getElementById("istexlocalqueryinput").value; // Request Content

  ipcRenderer.send(
    "console-logs",
    "Sending ISTEX the following query : " + query
  ); // Log query

  const target = `https://api.istex.fr/document/?q=${query}&size=1`;

  fetch(target)
    .then((res) => res.json())
    .then((r) => {
      // Then, once the response is retrieved

      let date = date();

      // Display metadata in a div
      let dataBasicPreview = `<br><strong>Query: ${query}</strong><br>
      Expected results at request time: ${r.total}<br>
      Query date: ${date}`;

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
      ipcRenderer.send("console-logs", "Query error : " + e); // Log error
    });
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
      ipcRenderer.send("console-logs", "Query error : " + e); // Log error
    });*/
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
      console.log(e);
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
      date: date(),
      id: "scopus-citedby_" + date(),
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
    date: date(),
    name: target,
    content: target,
  });

  document.getElementById(service + "-exporter").innerText =
    "Added to " + service + " endpoints";
};

//======== Hyphe Endpoint Chercker ======
var hyphetarget;
const hypheCheck = (target) => {
  let chk = document.getElementById("hyphe-checker");

  if (target.indexOf("/#/login") > -1) {
    target = target.replace("/#/login", "");
  }

  fetch(target + "/api/", {
    method: "POST",
    body: { method: "get_status", params: [null] },
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => {
      if (res.ok) {
        hyphetarget = target + "/api/";
        chk.style.color = "DarkOliveGreen";
        chk.innerText = "Hyphe enpoint reached";
        document.getElementById("hyphe-exporter").style.display = "block";
      } else {
        fetch(target + "-api/", {
          method: "POST",
          body: { method: "get_status", params: [null] },
          headers: { "Content-Type": "application/json" },
        }).then((res2) => {
          if (res2.ok) {
            hyphetarget = target + "-api/";
            chk.style.color = "DarkOliveGreen";
            chk.innerText = "Hyphe enpoint reached";
            document.getElementById("hyphe-exporter").style.display = "block";
          } else {
            chk.style.color = "DarkRed";
            chk.innerText = "Failure";
          }
        });
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
  fetch(target, {
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
                id: corpus + date(),
                date: date(),
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
    let id = datasetName + date();
    pandodb.doxatype
      .add({
        id: id,
        date: date(),
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
    let id = datasetName + date();

    pandodb.filotype
      .add({
        id: id,
        date: date(),
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
  const legislature = document.getElementById("legislature").value;
  var query = `https://${legislature}.nosdeputes.fr/recherche/${encodeURI(
    queryContent
  )}?format=json`;

  fetch(query)
    .then((r) => r.json())
    .then((res) => {
      let totalreq =
        parseInt(res.last_result / 500) + parseInt(res.last_result);
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

//===== Solr BNF ======
var solrbnfcount = {};

const queryBnFSolr = (but) => {
  const queryContent = document.getElementById(
    `bnf-solr-query-${but.serv}`
  ).value;

  const dateFrom = document.getElementById(
    `bnf-solr-${but.serv}-date-from`
  ).value;

  const dateTo = document.getElementById(`bnf-solr-${but.serv}-date-to`).value;

  const collections = document.getElementsByClassName(
    `bnf-solr-checkbox-${but.serv}`
  );

  // As it happens, the solr endpoint chosen by the user can have several collections
  // in it which can have different names. Rather than letting the user enter the
  // name of the target collection in the config file, a request is sent on FLUX
  // generation to check for available collections in the target SOLR. This means
  // that the user might want to send the same request to several collections.
  //
  // De facto, in the first use of that system, there is 1 collection per SOLR in
  // production, so the user won't have much of a choice. This is more of a "let's
  // help the user by not making them input something" choice than a future proofing
  // though it acts like it too.

  var query;
  var selectedCollection;

  // This is a WIP committed to be saved.

  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];

    if (collection.checked) {
      // Ici, ne prendre que la dernière capture connue
      selectedCollection = collection.id;

      query =
        "http://" +
        but.args.url +
        ":" +
        but.args.port +
        "/solr/" +
        selectedCollection +
        "/select?facet.field=crawl_year&facet=on&fq=crawl_date:[" +
        dateFrom +
        "T00:00:00Z" +
        "%20TO%20" +
        dateTo +
        "T00:00:00Z]&" +
        "q=" +
        queryContent +
        "&rows=0&sort=crawl_date%20desc&group=true&group.field=url" +
        "&group.limit=1&group.sort=score+desc%2Ccrawl_date+desc&start=0" +
        "&rows=0&sort=score+desc&group.ngroups=true";
    }
  }

  const previewer = document.getElementById(
    "bnf-solr-basic-previewer-" + but.serv
  );

  // This is an arbitrary document limit hardcoded for alpha/beta testing
  // purposes. Ideally, this limit should be echoed by the host system, not
  // hardcoded in PANDORAE.

  const document_limit = 50000;

  d3.json(query)
    .then((r) => {
      let numFound = r.grouped.url.ngroups;

      solrbnfcount[queryContent] = { count: numFound, but, selectedCollection };

      previewer.innerHTML = `<br><p>  ${numFound} documents found</p> `;

      if (numFound > 0 && numFound < document_limit) {
        document.getElementById(
          "bnf-solr-fullquery-" + but.serv
        ).style.display = "flex";
      } else if (numFound >= document_limit) {
        previewer.innerHTML = `You cannot request more than ${document_limit} documents.`;
      }
    })
    .catch((e) => {
      console.log(e);
      previewer.innerHTML = `<br><p>Error - do you have a missing argument?</p> `;
    });
};

const generateLocalServiceConfig = () => {
  const newServiceType = document.getElementById("newServiceType");

  switch (newServiceType.value) {
    case "BNF-SOLR":
      const divs = ["newServiceName", "newServiceLocation", "newArkViewer"];

      divs.forEach((d) => (document.getElementById(d).style.display = "block"));

      break;

    default:
      break;
  }
};

//==== Manual Merging of Authors ====
// This one is a bit trick because it can be quite computationnaly intensive and yet has to stay in FLUX.
// Maybe some chaeros-led hand curation will have to happen at some point, maybe not.
// Might be worth it making FLUX bigger for that purpose. (upsize then downsize when over)

const manualMergeAuthors = () => {
  // find the dataset name
  const dataname = document.getElementById("manual-dataset-preview").name;

  // DOM interface (buttons)
  const mergeCont = document.getElementById("mergeCont");
  mergeCont.style = "border:1px solid #141414;padding:5px;";

  var authors = 0;

  const downloadMerged = document.createElement("div");
  downloadMerged.id = "dlmerged";
  downloadMerged.style = "margin:5px";
  downloadMerged.className = "flux-button";
  downloadMerged.innerText = "Download Merged Authors";

  const saveMerged = document.createElement("div");
  saveMerged.id = "saveMerged";
  saveMerged.style = "margin:5px";
  saveMerged.className = "flux-button";
  saveMerged.innerText = "Update dataset with merged authors";

  // merging data
  var authorMergeMap = {};

  // this function is for saving only;
  //rebuild the author merge map when saving using the longest name
  //and the attribute this to all articles;

  const updateArticles = (dataset, authorMergeMap) => {
    const completeMap = {};
    // step 1 - rebuild merge map;
    for (const author in authorMergeMap) {
      // list all possibilities
      const thisAuthor = authorMergeMap[author];
      const thisAuthorList = [author];
      for (const alias in thisAuthor) {
        thisAuthorList.push(alias);
      }
      const sortedList = thisAuthorList.sort((a, b) => b.length - a.length);
      const mainAlias = sortedList[0];
      sortedList.forEach((auth) => (completeMap[auth] = mainAlias));
    }

    // step 2 - attribute to articles
    dataset.content.forEach((article) => {
      article.creators.forEach((author) => {
        const concat = author.lastName + " | " + author.firstName;
        if (
          completeMap.hasOwnProperty(concat) &&
          authors[completeMap[concat]]
        ) {
          author.lastName = authors[completeMap[concat]].lastName;

          author.firstName = authors[completeMap[concat]].firstName;
        }
        delete author.concat;
        delete author.alias;
        delete author.artlist;
        delete author.distances;
      });
    });
  };

  var dataset;

  saveMerged.addEventListener("click", (e) => {
    e.preventDefault();

    dataset.id = "merged_" + dataset.name + date();
    dataset.name = "merged_" + dataset.name;

    dataset.date = date();

    if (!dataset.hasOwnProperty("mergeMap")) {
      dataset.mergeMap = {};
    }
    dataset.mergeMap.authorMergeMap = authorMergeMap;

    updateArticles(dataset, authorMergeMap);

    pandodb.csljson
      .add(dataset)
      .then(() => {
        ipcRenderer.send("coreSignal", "Saved author merging"); // Sending notification to console
        ipcRenderer.send("console-logs", "Saved author merging " + dataset.id); // Sending notification to console
        setTimeout(() => {
          console.log("closing window");
          closeWindow();
        }, 500);
      })
      .catch((err) => console.log(err));
  });

  const uploadMergeMapCont = document.createElement("div");
  uploadMergeMapCont.style = "margin:5px";
  const uploadMergeMapLabel = document.createElement("label");
  const br = document.createElement("br");
  uploadMergeMapLabel.innerText = "Add an author merge directory";
  const uploadMergeMapInput = document.createElement("input");
  uploadMergeMapInput.type = "file";
  uploadMergeMapInput.id = "authorMergeDirectory";
  uploadMergeMapInput.name = "authorMergeDirectory";
  uploadMergeMapInput.accept = "application/json";

  uploadMergeMapInput.addEventListener("change", () => {
    const curFiles = uploadMergeMapInput.files;
    const doc = curFiles[0];

    fs.readFile(doc.path, "utf8", (err, data) => {
      const dataparsed = JSON.parse(data);
      for (const auth in dataparsed) {
        authorMergeMap[auth] = dataparsed[auth];
      }
      refreshMergeMap();
    });
  });

  uploadMergeMapCont.append(uploadMergeMapLabel, br, uploadMergeMapInput);

  const mergeMapList = document.createElement("ul");

  document
    .getElementById("mergeMap")
    .append(uploadMergeMapCont, downloadMerged, saveMerged, mergeMapList);

  const dist = (a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      return distance(a.toLowerCase(), b.toLowerCase());
    } else {
      return 0;
    }
  };

  function sortAuthors(data) {
    var nameMap = {};

    data.content.forEach((article) => {
      article.creators.forEach((author) => {
        if (author.lastName) {
          if (!author.firstName) {
            author.firstName = "";
          }

          const concat = author.lastName + " | " + author.firstName;
          author.concat = concat;
          author.alias = [
            { concat, lastName: author.lastName, firstName: author.firstName },
          ];

          if (!nameMap.hasOwnProperty(concat)) {
            author.artlist = [];
            nameMap[concat] = author;
          }
          nameMap[concat].artlist.push(article.DOI);
        }
      });
    });

    const nameList = [];

    for (const nm in nameMap) {
      nameList.push(nameMap[nm]);
    }

    nameMap = {};

    nameList.forEach((author) => {
      const distances = [];
      nameList.forEach((other) => {
        const score =
          dist(author.lastName, other.lastName) +
          Math.ceil(dist(author.firstName, other.firstName) / 3);

        distances.push({ name: other.concat, score });
      });

      const sorted = distances.sort((a, b) => a.score - b.score);

      const limitedlist = [];

      let len = 10;

      if (nameList.length <= 50) {
        len = nameList.length;
      } else {
        if (author.lastName.length < 6) {
          len = 250;
        } else {
          len = 50;
        }
      }

      for (let i = 0; i < len; i++) {
        if (sorted[i].score < 10) {
          limitedlist.push(sorted[i]);
        }
      }

      author.distances = limitedlist;
      nameMap[author.concat] = author;
    });

    return nameMap;
  }

  const listAuthors = (nameMap) => {
    const list = [];
    for (const n in nameMap) {
      const p = nameMap[n];
      list.push({ name: p.concat, articles: p.artlist.length });
    }

    return list.sort((a, b) => b.articles - a.articles);
  };

  function displayAuthor(auth, distanced) {
    const cont = document.createElement("div");

    const merge = document.createElement("button");
    merge.innerText = "Merge";

    if (auth) {
      const name = auth.name;

      cont.style =
        "height:500px;overflow-y:scroll;border : 1px solid #141414;padding:5px;font-family:sans-serif";
      const title = document.createElement("h3");
      title.innerText = auth.concat;
      const articles = document.createElement("ul");
      articles.style = "font-family:monospace;font-size:10px";
      for (let i = 0; i < 5; ++i) {
        const art = auth.artlist[i];
        if (art) {
          const article = document.createElement("li");
          article.innerHTML = `<a target="_blank" href="https://doi.org/${art}">${art}</a>`;
          articles.append(article);
        }
      }

      const names = document.createElement("div");

      for (let i = 0; i < auth.distances.length; ++i) {
        const p = auth.distances[i];
        if (p.score > 0) {
          const namecont = document.createElement("div");
          namecont.style.display = "flex";
          const namebox = document.createElement("input");
          namebox.type = "checkbox";
          namebox.className = "checkbox";
          namebox.id = p.name;
          namebox.name = p.name;

          const nameLabel = document.createElement("label");
          nameLabel.for = p.name;
          nameLabel.style =
            "display: flex;width: 300px;justify-content: space-between;padding:3px";

          let refs = "";

          if (distanced[p.name]) {
            const autharticles = distanced[p.name].artlist;

            for (let j = 0; j < 5; ++j) {
              if (autharticles[j]) {
                refs += `[<a target="_blank" href="https://doi.org/${
                  autharticles[j]
                }">${j + 1}</a>] `;
              }
            }
          }
          nameLabel.innerHTML = `<div style="display:flex">${p.name} &nbsp;<div style="font-size:10px"> ${refs}</div></div><div> ${p.score}</div>`;

          namecont.append(namebox, nameLabel);
          names.append(namecont);
        }
      }

      merge.addEventListener("click", (e) => {
        e.preventDefault();

        const res = {};

        // do not add this because this will be the main alias, and
        // it will have to be kept in the main auth directory, the
        // other ones will be deleted
        //res[auth.concat] = 1;
        const boxes = document.getElementsByClassName("checkbox");

        for (let i = 0; i < boxes.length; ++i) {
          if (boxes[i].checked) {
            res[boxes[i].id] = 1;
          }
        }
        authorMergeMap[auth.concat] = res;

        cont.innerHTML = "";

        refreshMergeMap();
      });

      cont.append(title, articles, merge, names);
    } else {
      cont.innerText = "Choose an author to start";
    }
    return cont;
  }

  function regenAuthorList() {
    const manselect = document.getElementById("manualSelector");
    manselect.innerHTML = "";
    const field = document.createElement("fieldset");
    field.style =
      "display: flex;flex-direction: column;height:180px;overflow-y:scroll;padding:5px;border:1px solid #141414;";

    const list = listAuthors(authors);

    list.forEach((auth) => {
      try {
        const div = document.createElement("div");
        div.style.display = "inline-flex";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "author";

        const thisAuthor = authors[auth.name];

        input.addEventListener("click", () => {
          const details = document.getElementById("detailSelector");
          details.innerHTML = "";

          details.append(displayAuthor(thisAuthor, authors));
        });

        const color = authorMergeMap.hasOwnProperty(auth.name)
          ? "blue"
          : "black";

        const label = document.createElement("label");
        label.style = `display: inline-flex;justify-content: space-between;width: 100%;flex-direction: row;color:${color}`;
        label.innerHTML = `<div>${auth.name}</div><div>${auth.articles}</div>`;

        div.append(input, label);
        field.append(div);
      } catch (error) {
        console.log(error);
      }
    });

    manselect.append(field);
  }

  const refreshMergeMap = () => {
    mergeMapList.innerHTML = "";

    for (const name in authorMergeMap) {
      const point = document.createElement("li");
      point.innerText = name + " - aliases: ";

      // getting slightly mad over here

      for (const d in authorMergeMap[name]) {
        point.innerText += " [" + d + "] ";

        if (authors.hasOwnProperty(d)) {
          authors[name].alias.push({
            concat: authors[d].concat,
            firstName: authors[d].firstName,
            lastName: authors[d].lastName,
          });
          authors[name].artlist = [
            ...authors[name].artlist,
            ...authors[d].artlist,
          ];
          delete authors[d];
        }
      }

      mergeMapList.append(point);
    }

    regenAuthorList();
  };

  pandodb.csljson
    .get(dataname)
    .then((data) => {
      dataset = data;
      downloadMerged.addEventListener("click", (e) => {
        e.preventDefault();

        ipcRenderer.invoke(
          "saveDataset",
          { defaultPath: "authors_" + data.name + ".json" },
          JSON.stringify(authorMergeMap)
        );
      });

      authors = sortAuthors(data);

      if (data.hasOwnProperty("mergeMap")) {
        if (data.mergeMap.hasOwnProperty("authorMergeMap")) {
          authorMergeMap = data.mergeMap.authorMergeMap;
        }
      }

      document.getElementById("manualCsljsonCollections").style.display =
        "none";
      document.getElementById("manual-merge-authors").style.display = "none";

      refreshMergeMap();
    })
    .catch((err) => console.log(err));
};

//===== Clarivate Web of Science ======

var wosReq;

const wosBasicRetriever = () => {
  const query = document.getElementById("wosbasicqueryinput").value;

  const wosKey = getPassword(
    "WebOfScience",
    document.getElementById("userNameInput").value
  );

  const getpublishTimeSpan = () => {
    const from = document.getElementById("wos-from-date").value;
    const to = document.getElementById("wos-to-date").value;

    if (from && to) {
      return `${from}+${to}`;
    } else {
      return null;
    }
  };

  const publishTimeSpan = getpublishTimeSpan();

  wosReq = {
    databaseId: "WOK",
    lang: "en",
    usrQuery: query,
    edition: null,
    publishTimeSpan,
    //loadTimeSpan: "string",
    //createdTimeSpan: "string",
    //modifiedTimeSpan: "string",
    count: 1,
    firstRecord: 1,
    //sortField: "ASC",
    //viewField: "string",
    optionView: "FR",
    //optionOther: "string",
  };

  const apiTarget = `https://wos-api.clarivate.com/api/wos/`;

  fetch(apiTarget, {
    method: "POST",
    body: JSON.stringify(wosReq),
    headers: { "Content-Type": "application/json", "X-ApiKey": wosKey },
  })
    .then((res) => res.json())
    .then((res) => {
      const numFound = res.QueryResult.RecordsFound;
      document.getElementById(
        "wos-basic-previewer"
      ).innerHTML = `Number of records found: ${numFound}.`;
      if (numFound > 0) {
        document.getElementById("wos-query").style.display = "block";
        //powerValve
      }
    });
};

//===== Adding a new local service ======

const addLocalService = () => {
  const serviceName = document.getElementById("newServiceName").value;
  const serviceLocation = document.getElementById("newServiceLocation").value;
  const serviceType = document.getElementById("newServiceType").value;

  const serviceArkViewer = document.getElementById("newArkViewer").value;

  const service = {
    serviceName,
    serviceLocation,
    serviceType,
    serviceArkViewer,
  };

  ipcRenderer.invoke("addLocalService", service);

  const serviceBut = document.getElementById("new-service-button");

  serviceBut.style.transition = "all 1s ease-out";
  serviceBut.style.backgroundPosition = "right bottom";
  serviceBut.style.color = "black";
  serviceBut.innerText = "Service added - please reload this page";
};

const removeLocalService = (serviceName) =>
  ipcRenderer.invoke("removeLocalService", serviceName);

//========== STARTING FLUX ==========
ipcRenderer.send("console-logs", "Opening Flux"); // Sending notification to console

const closeWindow = () =>
  ipcRenderer.send("window-manager", "closeWindow", "flux");

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
  var buttonList = [
    { id: "change-user-id", func: "changeUserID" },
    { id: "manual-merge-authors", func: "manualMergeAuthors" },
    { id: "wos-basic-query", func: "wosBasicRetriever" },
    {
      id: "wos-query",
      func: "powerValve",
      arg: "wosBuild",
    },
    { id: "new-service-button", func: "addLocalService" },
    { id: "showConsole", func: "fluxConsole" },
    { id: "scopus-list-display", func: "ScopusList" },
    { id: "user-button", func: "basicUserData" },
    { id: "access-user-id", func: "accessUserID" },
    {
      id: "zoteroAPIValidation",
      func: "checkKey",
      arg: "zoteroAPIValidation",
    },
    { id: "Zotero", func: "updateUserData", arg: "Zotero" },
    { id: "scopusValidation", func: "checkKey", arg: "scopusValidation" },
    { id: "Scopus", func: "updateUserData", arg: "Scopus" },
    { id: "WebOfScience", func: "updateUserData", arg: "WebOfScience" },
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
    { id: "istex-basic-query", func: "istexBasicRetriever", arg: [] },
    { id: "scopus-query", func: "powerValve", arg: "scopusRetriever" },
    { id: "istex-query", func: "powerValve", arg: "istexRetriever" },
    { id: "biorxiv-basic-query", func: "biorxivBasicRetriever" },
    { id: "biorxiv-query", func: "powerValve", arg: "biorxivRetriever" },
    { id: "twitterImporter", func: "powerValve", arg: "tweetImporter" },
    { id: "twitterCatImporter", func: "twitterCat" },
    { id: "twitterThreadImporter", func: "twitterThread" },
    { id: "scopusGeolocate", func: "powerValve", arg: "scopusGeolocate" },
    {
      id: "webofscienceGeolocate",
      func: "powerValve",
      arg: "webofscienceGeolocate",
    },
    { id: "regards-basic-query", func: "regardsBasic" },
    { id: "regards-query", func: "powerValve", arg: "regards" },
    {
      id: "sci-api-retrieve-display",
      func: "datasetDisplay",
      arg: ["scopus-dataset-list", "scopus"],
    },
    {
      id: "sci-api-retrieve-display",
      func: "datasetDisplay",
      arg: ["webofscience-dataset-list", "webofscience"],
    },
    { id: "convert-csl", func: "powerValve", arg: "cslConverter" },
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
      id: "mancolret",
      func: "datasetDisplay",
      arg: ["manualCsljsonCollections", "csljson", "manual"],
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
      id: "newServiceType",
      func: "generateLocalServiceConfig",
    },

    {
      id: "downloadData",
      func: "downloadData",
    },
  ];

  const svg = d3.select("svg");

  var availability;

  const selections = {
    scientometricsSelect: true,
    clinicalTrialsSelect: false,
    parliamentsSelect: false,
    twitterSelect: false,
    hypheSelect: false,
    localSelect: false,
  };

  function configureCascade() {
    for (const theme in selections) {
      const select = document.getElementById(theme);
      select.addEventListener("change", () => {
        selections[theme] = select.checked;
        document.getElementById("cascade").innerHTML = "";

        updateCascade();
      });
    }
  }

  configureCascade();

  function updateCascade() {
    traces = [];
    document.getElementById("cascade").innerHTML = "";
    availability.dnslist.forEach((d) => {
      if (d.valid) {
        switch (d.name) {
          case "Scopus":
            if (selections.scientometricsSelect) {
              addHop(["USER", "SCOPUS", "ENRICHMENT"]);
            }
            break;

          case "Web Of Science":
            if (selections.scientometricsSelect) {
              addHop(["USER", "WEBㅤOFㅤSCIENCE", "ENRICHMENT"]);
            }
            break;

          case "BIORXIV":
            if (selections.scientometricsSelect) {
              addHop(["OPEN", "BIORXIV", "ZOTERO"]);
            }
            break;

          case "Zotero":
            addHop([
              "USER",
              "ENRICHMENT",
              "CSL-JSON",
              "MANUAL",
              "ZOTERO",
              "SYSTEM",
            ]);
            break;

          case "Clinical Trials":
            if (selections.clinicalTrialsSelect) {
              addHop(["OPEN", "CLINICALㅤTRIALS", "SYSTEM"]);
            }
            break;

          case "Regards Citoyens":
            if (selections.parliamentsSelect) {
              addHop(["OPEN", "REGARDSCITOYENS", "CSL-JSON"]);
            }
            break;

          case "ISTEX":
            if (selections.scientometricsSelect) {
              addHop(["OPEN", "ISTEX", "ENRICHMENT"]);
            }
            break;

          default:
            break;
        }
      }
    });

    if (selections.twitterSelect) {
      addHop(["USER", "TWITTER", "SYSTEM"]);
    }
    if (selections.hypheSelect) {
      addHop(["OPEN", "HYPHE", "SYSTEM"]);
    }

    if (selections.localSelect) {
      for (const service in availability.dnsLocalServiceList) {
        switch (availability.dnsLocalServiceList[service].type) {
          case "BNF-SOLR":
            const serv = service.toUpperCase().replace(" ", "-");

            addHop([serv, "ZOTERO"]);
            break;
        }
      }
    }

    drawFlux(svg, traces, false, true);

    buttonList.forEach((but) => {
      document.getElementById(but.id).addEventListener("click", (e) => {
        funcSwitch(e, but);
        e.preventDefault();
        return false;
      });
    });
  }

  ipcRenderer.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);
    updateCascade();

    const buttonList = [];

    const localServicePreviewer = document.getElementById(
      "localservices-basic-previewer"
    );

    const table = document.createElement("UL");

    localServicePreviewer.append(table);

    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          const serv = service.toUpperCase().replace(" ", "-");

          const serviceLine = document.createElement("li");
          serviceLine.style = "display:flex;justify-content: space-between;";
          const serviceName = document.createElement("div");
          serviceName.innerHTML = `- ${availability.dnsLocalServiceList[service].type} - ${service}`;
          const serviceRemove = document.createElement("div");
          serviceRemove.style = "font-weight:bold;";
          serviceRemove.innerText = "x";
          serviceRemove.addEventListener("click", () => {
            serviceLine.remove();
            removeLocalService(service);
          });
          serviceLine.append(serviceName, serviceRemove);

          table.append(serviceLine);

          const solrCont = document.createElement("div");

          solrCont.id = serv.toLowerCase();
          solrCont.style.display = "none";
          solrCont.className = "fluxTabs";

          // Here, get the available SOLR collections
          // SERVICE_LOCATION/solr/admin/collections?action=LIST&wt=json

          const collectionRequest =
            "http://" +
            availability.dnsLocalServiceList[service].url +
            ":" +
            availability.dnsLocalServiceList[service].port +
            "/solr/admin/collections?action=LIST&wt=json";

          // The answer is in the array at r.collections

          fetch(collectionRequest)
            .then((r) => r.json())
            .then((r) => {
              var collectionCheck = "";

              for (let i = 0; i < r.collections.length; i++) {
                const col = r.collections[i];
                let checked = i === 0 ? "checked" : "";

                collectionCheck += `<div>
              <input type="radio" name="bnf-solr-checkbox-${serv}" class="bnf-solr-checkbox-${serv}" id="${col}"  ${checked}  />
              <label for="${col}">${col}</label>
            </div>`;
              }

              solrCont.innerHTML = `<!-- BNF SOLR TAB -->     
            <span class="flux-title">${service.toUpperCase()}</span>
            <br><br>
            <form id="bnf-solr-form" autocomplete="off">Query:<br>
              <input class="fluxInput" spellcheck="false" id="bnf-solr-query-${serv}" type="text" value=""><br><br>
              From: <input type="date" id="bnf-solr-${serv}-date-from"> - To: <input type="date" id="bnf-solr-${serv}-date-to"><br>
              <br>Select collection:<br>
              ${collectionCheck}<br><br>
              <button type="submit" class="flux-button" id="bnf-solr-basic-query-${serv}">Retrieve
                basic info</button>&nbsp;&nbsp;
              <div id="bnf-solr-basic-previewer-${serv}" style="position:relative;"></div><br><br>
              <button style="display: none;" type="submit" class="flux-button" id="bnf-solr-fullquery-${serv}">Submit Full Query</button>
              <br><br>
            </form>`;

              document.body.append(solrCont);

              buttonList.push({
                id: "bnf-solr-basic-query-" + serv,
                serv,
                func: "queryBnFSolr",
                args: availability.dnsLocalServiceList[service],
              });

              buttonList.push({
                id: "bnf-solr-fullquery-" + serv,
                serv,
                func: "powerValve",
                arg: "BNF-SOLR",
              });

              buttonList.forEach((but) => {
                document
                  .getElementById(but.id)
                  .addEventListener("click", (e) => {
                    e.preventDefault();
                    funcSwitch(e, but);

                    return false;
                  });
              });
            });

          break;

        default:
          break;
      }
    }
  });

  function funcSwitch(e, but) {
    switch (but.func) {
      case "queryBnFSolr":
        queryBnFSolr(but);
        break;
      case "addLocalService":
        addLocalService();
        break;
      case "fluxConsole":
        ipcRenderer.invoke("fluxDevTools", true);

        var id = document.getElementById("system-dataset-preview").name;

        //pandodb.system.get(id).then((data) => console.log(data));

        break;

      case "wosBasicRetriever":
        wosBasicRetriever();
        break;

      case "biorxivBasicRetriever":
        biorxivBasicRetriever();
        break;

      case "accessUserID":
        accessUserID();
        break;

      case "changeUserID":
        changeUserID();
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

      case "generateLocalServiceConfig":
        generateLocalServiceConfig();
        break;

      case "regardsBasic":
        regardsBasic();
        break;

      case "hypheCheck":
        hypheCheck(document.getElementById("hypheaddress").value);
        break;

      case "endpointConnector":
        endpointConnector("hyphe", hyphetarget);
        break;

      case "datasetDisplay":
        datasetDisplay(but.arg[0], but.arg[1], but.arg[2]);
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

      case "istexBasicRetriever":
        istexBasicRetriever();
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

      case "manualMergeAuthors":
        manualMergeAuthors();
        break;

      case "downloadData":
        downloadData();
        break;
    }
  }
});
