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
const tg = require("@hownetworks/tracegraph");
const rpn = require('request-promise-native');                        // RPN enables to generate requests to various APIs
const fs = require('fs');                                             // FileSystem reads/writes files and directories
const userDataPath = remote.app.getPath('userData');
const {ipcRenderer} = require('electron');                            // ipcRenderer manages messages with Main Process
const d3 = require("d3");
const Dexie = require('dexie');

Dexie.debug = true;

let pandodb = new Dexie("PandoraeDatabase");

let structureV1 = "id,date,name";

pandodb.version(1).stores({
      enriched: structureV1,
      scopus: structureV1,
      csljson:structureV1,
      zotero: structureV1,
      twitter: structureV1,
      anthropotype: structureV1,
      chronotype: structureV1,
      geotype: structureV1,
      pharmacotype: structureV1,
      publicdebate: structureV1,
      gazouillotype: structureV1,
      system:structureV1
  });
  pandodb.open();

  var db = "";

//========== STARTING FLUX ==========
ipcRenderer.send('console-logs',"Opening Flux");           // Sending notification to console
ipcRenderer.send("window-ids","flux",remote.getCurrentWindow().id,true)
ipcRenderer.on('window-close', (event,message) => {
  ipcRenderer.send("window-ids","flux",remote.getCurrentWindow().id,false)
  closeWindow();
});


//========== Tracegraph ==========

let traces = [
  {"hops":[{"root":true},{"info":{"name":"USER"},"name":"USER"},{"info":{"name":"ZOTERO"},"name":"ZOTERO"},{"info":{"name":"SYSTEM"},"name":"SYSTEM"}]},
  {"hops":[{"info":{"name":"DB/API"},"name":"DB/API"},{"info":{"name":"TWITTER"},"name":"TWITTER"},{"info":{"name":"SYSTEM"},"name":"SYSTEM"}]},
   {"hops":[{"info":{"name":"ENRICHMENT"},"name":"ENRICHMENT"},{"info":{"name":"CSL-JSON"},"name":"CSL-JSON"},{"info":{"name":"ZOTERO"},"name":"ZOTERO"},{"info":{"name":"SYSTEM"},"name":"SYSTEM"}]},
   {"hops":[{"info":{"name":"DB/API"},"name":"DB/API"},{"info":{"name":"SCOPUS"},"name":"SCOPUS"},{"info":{"name":"ENRICHMENT"},"name":"ENRICHMENT"}]},
   {"hops":[{"root":true},{"info":{"name":"USER"},"name":"USER"},{"info":{"name":"DB/API"},"name":"DB/API"}]}
  ];

const drawFlux = (svg, traces, horizontal, showTexts) => {
  function makeText(selection) {
   return selection
     .append("text")
     .attr("font-family", "sans-serif")
     .attr("font-size", 12);
 }

 const tmpSvg = d3.select("body").append("svg").attr("width", 720).attr("height", 500);

 const tmpText = makeText(tmpSvg);

const graph = tg
  .tracegraph()
  .horizontal(horizontal)
  .nodeSize(node => {
    const name = node.hops[0].name;
    if (showTexts && name) {
      const bbox = tmpText
        .text(name)
        .node()
        .getBBox();
      return [bbox.width + 14, bbox.height + 8];
    }
    return name || node.hops[0].root ? [30, 30] : [10, 10];
  })
  .levelMargin(10)
  .hopDefined(hop => hop.name || hop.root)
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
     .attr("gradientUnits", d => d.gradientUnits)
     .attr("x1", d => d.x1)
     .attr("y1", d => d.y1)
     .attr("x2", d => d.x2)
     .attr("y2", d => d.y2)
     .selectAll("stop")
     .data(d => d.stops)
     .enter()
     .append("stop")
     .attr("offset", d => d.offset)
     .attr(
       "stop-color",
       d => d3.schemeSet2[d.traceIndex % d3.schemeSet2.length]
     );
 
   const traceGroup = svg
     .selectAll(".trace")
     .data(layout.traces)
     .enter()
     .append("g")
     .attr("class", "trace")
     .attr("fill", "none");
   traceGroup
     .filter(segment => segment.defined)
     .append("path")
     .attr("stroke-width", d => d.width - 2)
     .attr("stroke", "white")
     .attr("d", tg.traceCurve());
   traceGroup
     .append("path")
     .attr("stroke-width", d => (d.defined ? d.width - 4.5 : d.width - 5))
     .attr(
      "stroke",
      segment => d3.schemeSet2[segment.index % d3.schemeSet2.length]
    )
     .attr("stroke-dasharray", segment => (segment.defined ? "" : "4 2"))
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
     .filter(d => showTexts && d.hops[0].name)
     .datum(d => ({ ...d, bounds: d.bounds.expanded(-2.5) }));
   textNodes
     .append("rect")
     .attr("rx", 2)
     .attr("ry", 2)
     .attr("x", d => d.bounds.x)
     .attr("y", d => d.bounds.y)
     .attr("width", d => d.bounds.width)
     .attr("height", d => d.bounds.height);

   makeText(textNodes)
     .attr("x", d => d.bounds.cx)
     .attr("y", d => d.bounds.cy)
     .attr("stroke", "none")
     .attr("fill", "black")
     .attr("alignment-baseline", "central")
     .attr("text-anchor", "middle")
     .style("cursor","pointer")
     .attr("font-size", 10)
     .text(d => d.hops[0].info.name)
     .on("mouseenter", d => {
       
      //NODEGROUP STYLE
      nodeGroup.transition().duration(200).style("opacity",0.15);
      let selectedTraces = [];
      traces.forEach(f => {
        for (let i = 0; i < f.hops.length; i++) {
          if (f.hops[i].name === d.hops[0].name) {
            selectedTraces.push(f)
          }
        }
      })
      for (let k = 0; k < selectedTraces.length; k++) {
        for (let u = 0; u < selectedTraces[k].hops.length; u++) {
          nodeGroup.filter(d => d.hops[0].name===selectedTraces[k].hops[u].name).transition().duration(250).style("opacity",0.65);
        }
      }

      nodeGroup.filter(e => e===d).transition().duration(300).style("opacity",1);

      //Tracegroup
      traceGroup.transition().duration(200).style("stroke-opacity",0.15);
      selectedTraces.forEach(signal => {
        for (let i = 0; i < traceGroup._groups[0].length; i++) {
          if (traceGroup._groups[0][i].__data__.hops[0] === signal.hops[0]){
          d3.select(traceGroup._groups[0][i]).transition().duration(250).style("stroke-opacity",0.65);
          }
         }
      } )




     })
     .on("mouseout", d => {
      nodeGroup.transition().duration(200).style("opacity",1);
      traceGroup.transition().duration(200).style("stroke-opacity",1);
     })
     .on("click", d => {fluxDisplay(d.hops[0].name.toLowerCase())});

   nodeGroup
     .filter(d => !(showTexts && d.hops[0].name))
     .append("circle")
     .attr("r", d => Math.min(d.bounds.width, d.bounds.height) / 2)
     .attr("cx", d => d.bounds.cx)
     .attr("cy", d => d.bounds.cy);

 }

const svg = d3.select("svg");

drawFlux(svg, traces, false, true);


//========== fluxDisplay ==========
// Display relevant tab when called according to the tab's id.
const fluxDisplay = (tab) => {
    db = tab;

    let tabs = document.getElementsByClassName("fluxTabs");           // Get all content DIVs by their common class

          for (let i = 0; i < tabs.length; i++) {                     // Loop on DIVs
             tabs[i].style.display = "none";                          // Hide the DIVs
          }
          document.getElementById(tab).style.display = "block";             // Display the div corresponding to the clicked button
  
  }
//========== powerValve ==========
// Some of the flux functions are not instantaneous because they can require data streams from remote services (such as
// online databases APIs), or because they are CPU intensive (data management). In order not to freeze the flux modal
// window, the following sequence is triggered through the powerValve Function:
// - those "heavy" functions are sent to the main process through the 'dataFlux' channel (and dispatched to Chæeros)
// - the flux  modal window is closed

const powerValve = (fluxAction,item) => {                                  // powerValve main function

ipcRenderer.send('console-logs',"Actioning powerValve on " +JSON.stringify(item.name)+ " through the " +fluxAction+ " procedure.");

let fluxArgs = {};                                                         // Arguments are stored in an object
let message = "";                                                          // Creating the default message variable
let itemname = item.name;                                                  // item argument is usually stored in "this"

switch (fluxAction) {                                                      // According to function name ...

   case 'altmetricRetriever' : fluxArgs.altmetricRetriever = {};
                                fluxArgs.altmetricRetriever.id = document.getElementById("altmetricRetriever").name;
                                fluxArgs.altmetricRetriever.user = document.getElementById("userNameInput").value;
                                break; 

  case 'scopusConverter' : fluxArgs.scopusConverter = {"dataset":""};
                           fluxArgs.scopusConverter.dataset = itemname;
                           message = "Converting to CSL-JSON" ;
                           break; 

   case 'scopusGeolocate' : fluxArgs.scopusGeolocate = {};
                           fluxArgs.scopusGeolocate.dataset = itemname;
                           message = "Geolocating Affiliations";
                           break; 

  case 'scopusRetriever' : fluxArgs.scopusRetriever = {"user":"","query":""};
                           fluxArgs.scopusRetriever.user = document.getElementById("userNameInput").value;
                           fluxArgs.scopusRetriever.query = document.getElementById("scopuslocalqueryinput").value;
                           message = "Retrieving data from Scopus" ;
                           break;

  case 'capcoRebuilder' : fluxArgs.capcoRebuilder = {"dataFile":"","dataMatch":""};
                          fluxArgs.capcoRebuilder.dataFile = pubDebDatasetLoader();
                          fluxArgs.capcoRebuilder.dataMatch = pubDeblinkDatasetLoader();
                          message = "Rebuilding Public Debate dataset" ;
                          break;

  case 'sysExport' : fluxArgs.sysExport = {};
                          fluxArgs.sysExport.id = document.getElementById("system-dataset-preview").name;
                          fluxArgs.sysExport.name = document.getElementById('systemToType').value;
                          fluxArgs.sysExport.dest = [];
                          var dest = document.getElementsByClassName('sysDestCheck');
                          for (let i =0; i<dest.length; i++){
                            if (dest[i].checked)
                             {
                               fluxArgs.sysExport.dest.push(
                                dest[i].value
                               )
                             }
                          }
                          message = "Exporting "+ fluxArgs.sysExport.name;
                          break;

case 'zoteroItemsRetriever' :  if (document.getElementById("zotitret").name ==="block") {
      fluxButtonAction ("zotcolret",false,"Zotero Collections Successfully Retrieved","Please select a destination");
                          }
                          else {

                            fluxArgs.zoteroItemsRetriever = {"collections" : [],"destination":[]};
                          var collecs = document.getElementsByClassName('zotColCheck');
                          for (let i =0; i<collecs.length; i++){
                            if (collecs[i].checked)
                             {
                               fluxArgs.zoteroItemsRetriever.collections.push(
                                 {"key":collecs[i].value,"name":collecs[i].name}
                               )
                             }
                          }
                         /*  var dest = document.getElementsByClassName('zotDestCheck');
                          for (let i =0; i<dest.length; i++){
                            if (dest[i].checked)
                             {
                               fluxArgs.zoteroItemsRetriever.destination.push(
                                dest[i].value
                               )
                             }
                          } */

                          fluxArgs.zoteroItemsRetriever.zoteroUser = document.getElementById("zoterouserinput").value;
                          fluxArgs.zoteroItemsRetriever.importName = document.getElementById("zoteroImportName").value.replace(/\s/g,"");
                          message = "Retrieving user collections" ;
                          }                        
                          break;

case 'zoteroCollectionBuilder' : fluxArgs.zoteroCollectionBuilder = {};
                                 fluxArgs.zoteroCollectionBuilder.id = document.getElementById("csljson-dataset-preview").name;
                                 fluxArgs.zoteroCollectionBuilder.collectionName = document.getElementById("zoteroCollecName").value;
                                 fluxArgs.zoteroCollectionBuilder.zoteroUser = document.getElementById("zoterouserinput").value;
                                 break;

  case 'tweetImporter' : fluxArgs.tweetImporter = {};
                fluxArgs.tweetImporter.dataset = document.getElementById("twitterDataset").files[0].path;
                fluxArgs.tweetImporter.query = document.getElementById("twitterQuery").files[0].path;
                fluxArgs.tweetImporter.datasetName = document.getElementById("twitterDatasetName").value;
                message = "loading twitter dataset" ;
                break; 

}

// Send a carbon-copy of the orders sent to chaeros to the logs
ipcRenderer.send('console-logs',"Sending to CHÆROS action "+fluxAction+ " with arguments "+JSON.stringify(fluxArgs)+" "+message);
ipcRenderer.send('dataFlux',fluxAction,fluxArgs,message);                         // Send request to main process
ipcRenderer.send("window-ids","flux",remote.getCurrentWindow().id,false);
remote.getCurrentWindow().close();                                                 // Close flux modal window
};

//========== fluxButtonAction ==========
// fluxButtonAction makes flux button change shape on click. It takes 4 arguments:
// - buttonID is the id of the DOM input button to be modified
// - success is a boolean, true means the action succeeded, false that it failed
// - successPhrase is the string to be displayed as button value (the text of the button) if success = true
// - errorPhrase is the same thing if success = false

const fluxButtonAction = (buttonID,success,successPhrase,errorPhrase) => {

  document.getElementById(buttonID).style.transition = "all 1s ease-out";         // Animate button
  document.getElementById(buttonID).style.backgroundPosition = "left bottom";     // Move background white->black
  document.getElementById(buttonID).style.color = "white";                        // Change button font color to white

    if (success){                                                                 // If success = true
          document.getElementById(buttonID).innerText = successPhrase;            // Display success phrase
    } else {                                                                      // If success = false
          document.getElementById(buttonID).innerText = errorPhrase;              // Display error phrase
      }

  // Disable button after request to prevent external request spamming and subsequent API throttling.
  document.getElementById(buttonID).disabled = true;
}

//========== datasetDisplay ==========
// datasetDisplay shows the datasets (usually JSON or CSV files) available in the relevant /datasets/ subdirectory.

const datasetDisplay = (divId,kind) => {              // This function displays the available datasets

  
  try {                                                          // Try the following block
    let datasets = [];                                           // Start from an empty array
   pandodb[kind].toArray(files=>{
       files.forEach(file => {                                    // For each file in the directory                               
        datasets.push(                                           // Push the file in the array
          "<li id='"+file.id+"' >"+"<span style='cursor:pointer;' onclick=datasetDetail('"+kind+"-dataset-preview','"+kind+"',"+JSON.stringify(file.id)+",'"+kind+"-dataset-buttons')>"+file.name+"</span>"+
          "<i class='fluxDelDataset material-icons' onclick=datasetRemove("+JSON.stringify(kind)+","+JSON.stringify(db)+","+JSON.stringify(file.id)+")>close</i></li>"
        )
    });

  var datasetList = "";                                          // Create the list as a string

  for (var i=0; i<datasets.length; ++i){                         // For each element of the array
      datasetList = datasetList + datasets[i];                   // Add it to the string
    }
    if (datasetList.length===0) {
      document.getElementById(divId).innerHTML = 'No dataset available in the system';
    } else {
    document.getElementById(divId).innerHTML = '<ul>'+datasetList+'</ul>';         // The string is a <ul> list
  }
  })
    } catch(err){
          document.getElementById(divId).innerHTML = err;        // Display error in the result div
        }
}

const datasetRemove = (kind,db,id)=> {
  pandodb[db].get(id).then(dataset=>{
      if (dataset.content.hasOwnProperty("path")) {
          fs.unlink(dataset.content.path, (err) => {if (err) throw err;});
      }
      document.getElementById(id).parentNode.removeChild(document.getElementById(id));
      pandodb[db].delete(id);
      ipcRenderer.send('console-logs',"Removed "+id+" from database: "+db);
      datasetDetail(null,kind,null,null);
  })
}
//========== datasetDetail ==========
// Clicking on a dataset displayed by the previous function displays some of its metadata and allows for further actions
// to be triggered (such as sending a larger request to Chæros).

const datasetDetail = (prevId,kind,id,buttonId) => {   // This function provides info on a specific dataset

  var datasetDetail = {};                                  // Create the dataDetail object
  let dataPreview = "";                                    // Created dataPreview variable

if (prevId === null){
  document.getElementById(kind+"-dataset-preview").innerText = "Dataset deleted";
  document.getElementById(kind+"-dataset-buttons").style.display = "none";
}
else{

try {
  pandodb[kind].get(id).then(doc=>{

switch (kind) {

          case 'scopus' :
                dataPreview = "<strong>"+ doc.name +"</strong>"+ // dataPreview is the displayed information in the div
                "<br>Origin: Scopus" +
                "<br>Query: " + doc.content.query+
                "<br>Total results: " + doc.content.entries.length+
                "<br>Query date: "+ doc.date;
                
                  document.getElementById(prevId).innerHTML = dataPreview; // Display dataPreview in a div
                  document.getElementById(buttonId).style.display = "block";            
                  document.getElementById("scopusGeolocate").name = doc.id;
                  document.getElementById("altmetricRetriever").name = doc.id;

                break;

          case 'enriched':
                  dataPreview = "<strong>"+ doc.name +"</strong>"+ // dataPreview is the displayed information in the div
                  "<br>Origin: Scopus" +
                  "<br>Query: " + doc.content.query+
                  "<br>Total results: " + doc.content.entries.length+
                  "<br>Query date: "+ doc.date+
                  "<br>Affiliations geolocated: " + doc.content.articleGeoloc+
                  "<br>Altmetric metadata retrieved: " + doc.content.altmetricEnriched;     
                  document.getElementById(prevId).innerHTML = dataPreview;
                  document.getElementById(buttonId).style.display = "block";
                  document.getElementById("convert-csl").style.display = "inline-flex";
                  document.getElementById("convert-csl").name = doc.id;
                break;

            case 'csljson':
                dataPreview = "<strong>"+ doc.name +"</strong><br>Item amount : " + doc.content.length;         
                document.getElementById(prevId).innerHTML = dataPreview;
                document.getElementById(prevId).name = doc.id;
                document.getElementById(buttonId).style.display = "inline-flex";
              break;

              case 'system':
              let subArrayContent = "";
              if (doc.content.isArray) {
              doc.content.forEach(d=>{
                let subContent = "<tr><td>"+d.name+"</td><td>"+d.items.length+" </td><td>"+d.library.name+"</td></tr>";
                subArrayContent+=subContent;
              });
              dataPreview = "<br><strong>"+ doc.name +"</strong><br>" + 
              "Dataset date: "+doc.date+
              "<br><br>Arrays contained in the dataset"+
              "<br><table style='border-collapse: collapse;'><thead><tr style='border:1px solid #141414;'><th>Name</th><th>#</th><th>Origin</th></tr></thead>"+
              "<tbody>"+
              subArrayContent+
              "</tbody></table>";
            } else {
              dataPreview = "<br><strong>"+ doc.name +"</strong><br>" + 
              "Dataset date: "+doc.date+"<br>"
              "Dataset type: "+doc.content.type+"<br>"
              

            }
              document.getElementById(prevId).innerHTML = dataPreview;
              document.getElementById(prevId).name = doc.id;
              document.getElementById(buttonId).style.display = "unset";
              document.getElementById(buttonId).style.flex = "auto";
              document.getElementById("systemToType").value = doc.id;

            break;
                  }
                   
  })
                  
              }
              
  catch(error) {                                                // If it fails at one point
        document.getElementById(prevId).innerHTML =  error;   // Display error message
        ipcRenderer.send('console-logs',error);               // Log error
      }
    }
};

//========== scopusBasicRetriever ==========
// Send a single request for a single document to Scopus in order to retrieve the request's metadata and give the user a
// rough idea of how big (and therefore how many requests) the response represents. The user is then offered to proceed
// with the actual request, which will then be channeled to Chæros.

const scopusBasicRetriever = (checker) => {

//document.getElementById("scopus-basic-query").innerText = "Loading ...";

let scopusQuery = document.getElementById("scopuslocalqueryinput").value;             // Request Content

ipcRenderer.send('console-logs',"Sending Scopus the following query : "+scopusQuery); // Log query

keytar.getPassword("Scopus",document.getElementById("userNameInput").value).then((scopusApiKey) => {

let rootUrl = "https://api.elsevier.com/content/search/scopus?query=";
let apiProm = "&apiKey="
let urlCount = "&count=";
let urlStart = "&start="
let docAmount = 0

let optionsRequest = {                             // Prepare options for the Request-Promise-Native Package
    uri: rootUrl + scopusQuery + apiProm + scopusApiKey + urlCount + 1 + urlStart + 0,     // URI to be accessed
    headers: {'User-Agent': 'Request-Promise'},    // User agent to access is Request-promise
    json: true                                     // Automatically parses the JSON string in the response
};

    rpn(optionsRequest)                            // RPN stands for Request-promise-native (Request + Promise)
            .then(function (firstResponse) {       // Then, once the response is retrieved
              if (checker) {
                if (firstResponse["search-results"]){
                  checkKey("scopusValidation",true)
                } else {
                  checkKey("scopusValidation",false)
                }
              } else {

    // Extract relevant metadata
    let searchTerms = firstResponse["search-results"]["opensearch:Query"]["@searchTerms"];
    let totalResults = firstResponse['search-results']['opensearch:totalResults'];
    let requestAmount = (totalResults) => {if (totalResults>200) {return parseInt(totalResults/200)+1} else {return 2}};
    let date = new Date();

    // Display metadata in a div
    let dataBasicPreview = "<strong>"+ searchTerms+"</strong>"+
                           "<br>Expected results at request time : " + totalResults+
                           "<br>Amount of requests needed to retrieve full response : " + requestAmount(totalResults) +
                           "<br>Query date: "+ date+"<br>[Reload this window to submit a different query.]<br><br>";

    document.getElementById('scopus-basic-previewer').innerHTML = dataBasicPreview;

    // Display success in request button
    fluxButtonAction ("scopus-basic-query",true,"Query Basic Info Retrieved","errorPhrase");

    // Display next step option: send full request to Chæros
    document.getElementById("scopus-query").style.display = "block";
          }
        })
        .catch(function(e) {
            fluxButtonAction ("scopus-basic-query",false,"Query Basic Info Error",e.message);
            ipcRenderer.send('console-logs',"Query error : "+e); // Log error
          
        });
    })
}

//========== zoteroCollectionRetriever ==========
// Retrieve collections from a Zotero user code. To be noted that a user code can be something else than a user: it can
// also be a group library ID, allowing for group or even public work on a same Zotero/PANDORÆ corpus.

const zoteroCollectionRetriever = () => {

let zoteroUser = document.getElementById("zoterouserinput").value;               // Get the Zotero user code to request

ipcRenderer.send('console-logs',"Retrieving collections for Zotero id "+ zoteroUser); // Log collection request

// Ask keytar for zotero API key
keytar.getPassword("Zotero",zoteroUser).then((zoteroApiKey) => {

// URL Building blocks
let rootUrl = "https://api.zotero.org/groups/";
let urlCollections = "/collections";
var zoteroVersion = "&v=3&key=";

//build the url
let zoteroCollectionRequest = rootUrl + zoteroUser + urlCollections + "?" + zoteroVersion + zoteroApiKey;

// Prepare options for the Request-Promise-Native Package
var optionsGlobalRequest = {
    uri: zoteroCollectionRequest,                  // URI to be accessed
    headers: {'User-Agent': 'Request-Promise'},    // User agent to access is Request-promise
    json: true                                     // Automatically parses the JSON string in the response
};

rpn(optionsGlobalRequest)                          // RPN stands for Request-promise-native (ES6)

    .then(function(zoteroColResponse) {            // With the response

      let collections=[];                          // Create empty 'collections' array

      for(let i = 0; i < zoteroColResponse.length; i++){   // Loop on the response
        let coll = {};                                     // Create an empty object
        coll.key = zoteroColResponse[i].data.key;          // Fill it with this collection's key
        coll.name = zoteroColResponse[i].data.name;        // Fill it with this collection's name
        collections.push(                                  // Push a string (HTML input list) in the collections array
         "<input class='zotColCheck' value='"+coll.key+"' name='"+coll.name+"' type='checkbox'/><label> " +coll.key+" - "+ coll.name +"</label><br> ");
      }

      var collectionList = "" ;                                      // Create the list as a string
        for (var k=0; k< collections.length; ++k){                   // For each element of the array
            collectionList = collectionList + collections[k];        // Add it to the string
          }

// Display full list in div
document.getElementById("userZoteroCollections").innerHTML = "<form style='line-height:1.5'>"+collectionList+"</form>";

// Show success on button
fluxButtonAction ("zotcolret",true,"Zotero Collections Successfully Retrieved","errorPhrase");

// Preparing and showing additional options
      document.getElementById("zotitret").style.display = "inline-flex";
      document.getElementById("zoteroResults").style.display = "flex";
      document.getElementById("zoteroImportName").style.display = "inline-flex";
      document.getElementById("zoteroImportInstruction").style.display = "inline-flex";

      checkKey("zoteroAPIValidation",true);

        }
    )
    .catch(function (err) {
      fluxButtonAction ("zotcolret",false,"Zotero Collections Successfully Retrieved",err);
      ipcRenderer.send('console-logs',"Error in retrieving collections for Zotero id "+ zoteroUser + " : "+err); // Log error
    });
  })
}

//========== datasetLoader ==========
// datasetLoader allows user to load datasets from a local directory into a PANDORAE target subdirectory.

const datasetLoader = () => {

let uploadedFiles = document.getElementById("dataset-upload").files;               // Uploaded file as a variable

let targets=[];

var dest = document.getElementsByClassName('locDestCheck');

for (let i =0; i<dest.length; i++){
  if (dest[i].checked) {
    targets.push(
      dest[i].value
     )
   }
}

  try {
        uploadedFiles.forEach(dataset=>{
          targets.forEach(target=>{
              pandodb[target].put(dataset);
              ipcRenderer.send('console-logs',"Dataset "+ dataset.name + " loaded into "+JSON.stringify(target)+"."); // Log action
            });
        });
  } catch(e) {
        ipcRenderer.send('console-logs',e); // Log error
  }finally{
        fluxButtonAction ("load-local",true,"Uploaded","");
      }

};

//========== datasetsSubdirList ==========
// List available directories for the user to upload the datasets in.
const datasetsSubdirList = (kind,dirListId) => {
  let datasetDirArray = [];

if (kind="local") {
  datasetDirArray = ['altmetric','scopus','csljson','zotero','twitter','anthropotype','chronotype','geotype','pharmacotype','publicdebate','gazouillotype'];
} else{
  datasetDirArray = kind;
}

  var datasetDirList = "";                                                   // Create the list as a string
  for (var i=0; i<datasetDirArray.length; ++i){                              // For each element of the array
      datasetDirList = datasetDirList + datasetDirArray[i];                  // Add it to the string
    }
    document.getElementById(dirListId).innerHTML = datasetDirList;           // The string is a <ul> list
}

//========== scopusGeolocate ==========
// scopusGeolocate gets cities/countries from a given scopus Dataset and send them to the OSM Geolocate API function.

const geoTest = () => {

  ipcRenderer.send('console-logs',"Testing geocoder API");
  
  keytar.getPassword("Geocoding",document.getElementById("userNameInput").value).then((geocodingApiKey) => {    // Retrieve the stored geocoding API key
  
  let options = {
    uri: "https://geocoder.tilehosting.com/q/paris.js?key="+geocodingApiKey,
    headers: {'User-Agent': 'Request-Promise'},
    json: true }
      
    rpn(options).then((res) => {                        // Enforce bottleneck through limiter
              checkKey("mapTilerValidation",true)
        }) .catch(function (err) {
          checkKey("mapTilerValidation",false)
        })
  })
}