//========== CHÆEROS ==========
//When flux actions are too heavy to be quasi-instantaneous, powerValve sends a message to the main process. This
//message is both the function to be executed, and an object containing its arguments. Once recieved, the main process
//creates a new invisible (never shown) window which calls the chaeros module, and executes one of the functions below,
//depending on what has been called by powerValve and transmitted by the main process. While executing, the chaeros
//module sends messages to the main process informing of the state of the function's execution, which is in turn
//redispatched to the index's "coreCanvas" and "field", which subsequently impacts the core animation and the field's
//value.

const {remote, ipcRenderer} = require('electron');
const keytar = require('keytar');
const rpn = require('request-promise-native');
const bottleneck = require('bottleneck');
const fs = require('fs');
const d3 = require('d3');
const wordTokenizer = require('talisman/tokenizers/words');
const carryStemmer = require('talisman/stemmers/french/carry');
const MultiSet = require('mnemonist/multi-set')
const userDataPath = remote.app.getPath('userData');

//========== scopusConverter ==========
//scopusConverter is only available once scopusDatasetDetail has been called. If triggerred, it creates a new
//CSL-JSON file from the selected dataset and puts it in json/csl-json. This CSL-JSON file should then be ready
//to be imported to Zotero.

const scopusConverter = (dataset) => {                               // dataset is the chosen file to be converted

ipcRenderer.send('console-logs',"Starting scopusConverter on " + dataset);

  let convertedDataset = [];                                         // Create relevant array

  fs.readFile(userDataPath +'/datasets/7scopus/2scopusDatasets/' + dataset, // Read the designated datafile
                                'utf8', (err, data) => {             // Additional options for readFile
    if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};                                              // Throw an error if readFile fails
    try {                                                            // If the file is valid, do the following:
        let doc = JSON.parse(data);                                  // Parse the file as a JSON object
        let readDataset = doc[Object.keys(doc)[0]];                  // Select relevant array
        let articles = readDataset[3].entries;                       // Select articles

        for (var i=0; i<articles.length; ++i){                       // For each article of the array
            let pushedArticle =                                      // Zotero journalArticle format
             {"itemType":"journalArticle","title":"","creators":[{"creatorType":"author","firstName":"","lastName":""}],"abstractNote":"","publicationTitle":"","volume":"","issue":"","pages":"","date":"","series":"","seriesTitle":"","seriesText":"","journalAbbreviation":"","language":"","DOI":"","ISSN":"","shortTitle":"","url":"","accessDate":"","archive":"","archiveLocation":"","libraryCatalog":"","callNumber":"","rights":"","extra":"","tags":[],"collections":[],"relations":{}};

            // Fill the article with the relevant properties
            pushedArticle.itemType = "journalArticle";
            pushedArticle.title = articles[i]['dc:title'];
            pushedArticle.creators[0].lastName = articles[i]['dc:creator'];
            pushedArticle.date = articles[i]['prism:coverDate'];
            pushedArticle.DOI = articles[i]['prism:doi'];
            pushedArticle.publicationTitle = articles[i]['prism:publicationName'];
            pushedArticle.shortTitle = JSON.stringify(articles[i].affiliation);
            convertedDataset.push(pushedArticle);
            }

      } catch(err) {
        ipcRenderer.send('chaeros-failure', err);                               // On failure, send error to main process
        ipcRenderer.send('console-logs',JSON.stringify(err));                   // On failure, send error to console
      }
        finally {
          let data = JSON.stringify(convertedDataset);                           // Prepare data to be written
            fs.writeFile(                                                        // Write data
              userDataPath +'/datasets/8zotero/1csl-json/csl-'+dataset,data,'utf8',// Path/name, data, format
                (err) => {if (err)                                               // On error
                ipcRenderer.send('chaeros-failure', err);                        // Send error to main process for dispatch
                ipcRenderer.send('console-logs',JSON.stringify(err));
                win.close();
            })
         }
     })
     ipcRenderer.send('chaeros-success', 'Success: Scopus dataset converted');   // Else send message to main process
     ipcRenderer.send('console-logs',"scopusConverter successfully converted " + dataset);
}

//========== scopusGeolocate ==========
// scopusGeolocate gets cities/countries from a given scopus Dataset and send them to the OSM Geolocate API function.

const scopusGeolocate = (dataset,user) => {


ipcRenderer.send('console-logs',"Started scopusGeolocate on " + dataset);

fs.readFile(userDataPath +'/datasets/7scopus/2scopusDatasets/' + dataset,      // Read the dataset passed as option
                              'utf8', (err, data) => {                       // It should be encoded as UTF-8
  if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};


  const limiter = new bottleneck({                                      // Create a bottleneck
    maxConcurrent: 1,                                                   // Send one request at a time
    minTime: 200                                                        // Every 200 milliseconds
  });

  var doc = JSON.parse(data);                                       // Parse the file as a JSON object
  let article = doc[Object.keys(doc)[0]][3].entries;                // Find relevant objects in the parsed dataset
  var datasetDetail = {};                                           // Prepare an empty object
  let totalCityArray = [];                                          // Prepare an empty array

try{                                                                // Try requesting the locations

keytar.getPassword("Geocoding",user).then((geocodingApiKey) => {    // Retrieve the stored geocoding API key

    let dataPromises = [];                                          // Prepare empty array to store promises to be sent

for (var i=0; i<(article.length-1); i++){                           // For loop to generate list of cities to be requested
    if (article[i].hasOwnProperty('affiliation') && article[i].affiliation.length>0){ // If item has at least an affiliation
        for (let j=0; j<article[i].affiliation.length; j++){        // Iterate on item's available affiliation
            if (article[i].affiliation[j].hasOwnProperty('affiliation-city')) {       // If affiliation has a city
              let city = article[i].affiliation[j]['affiliation-city'];               // Extract city name
              if (typeof city === "string"){                                          // Making sure it isn't null or undef
              totalCityArray.push(city.replace(/\s/g,"%20"))                          // URL encode and push
              }
            }
     }
   }
 }

let cityRequests = MultiSet.from(totalCityArray);      // Create a multiset from city Array to prevent duplicate requests

let cities = [];

Promise.all(cityRequests.forEachMultiplicity((count, key) => {                  // Generate requests per city (=> key)

    let options = {
        uri: "https://geocoder.tilehosting.com/q/"+key+".js?key="+geocodingApiKey,
        headers: {'User-Agent': 'Request-Promise'},
        json: true
    };
    return limiter.schedule(rpn,options).then((res) => {                        // Enforce bottleneck through limiter
            if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};


for (var j=0; j<(article.length-1); j++){                                       // For each article (last is a stop signal)
  if (article[j].hasOwnProperty('affiliation')){                                // If it has affiliations

        for (var k=0; k<article[j].affiliation.length; k++){                    // Loop on available item's affiliations

          let localKey = article[j].affiliation[k]['affiliation-city'];           // Extract affiliation city

          if (typeof localKey === "object") {localKey = JSON.stringify(localKey)} // Stringify to allow for comparison
          if (typeof key === "object") {key = JSON.stringify(key)}                // Stringify to allow for comparison

          localKey = localKey.replace(/\s/g,"");                                  // Remove space
          key = key.replace(/%20/g,"");                                           // Remove URL encoding

          if(localKey===key){                                                     // If affiliation city has been resolved
            article[j].affiliation[k].lon = res.results[0].lon;                   // Add longitude
            article[j].affiliation[k].lat = res.results[0].lat;                   // Add latitude
        }
    }
  }
}

      doc[Object.keys(doc)[0]][1].articleGeoloc = true;                           // Mark file as geolocated

      let docstring=JSON.stringify(doc);                                          // Stringify to write
          fs.writeFile(                                                                  // Write data
            userDataPath +'/datasets/7scopus/2scopusDatasets/geoloc-'+dataset,docstring,'utf8',
              (err) => {if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};

    ipcRenderer.send('chaeros-success', 'Success: Geolocation added');              //Send success message to main process
    ipcRenderer.send('console-logs',"scopusGeolocate successfully added geolocations on " + dataset);
    win.close();
        }  )
      })
  }))
})
      } catch(e) {
        ipcRenderer.send('chaeros-failure', e);
        ipcRenderer.send('console-logs', e);
      }
      finally{

      }
  })
}


//========== scopusRetriever ==========
// Once a basic scopus query has been made on an expression, the user can choose to perform the actual query.
// This retrieves all the documents corresponding to the same query (basic query only loads one in order to get the
// the total amount of documents). This is sent to chaeros via powerValve because it can be heavy, depending on the
// size of the sample and the power/broadband available on the user's system.

const scopusRetriever = (user, query) => {                          // user argument is passed to get keytar pass

ipcRenderer.send('console-logs',"Started scopusRetriever on " + query + " for user "+ user);

let scopusQuery = query;                                            // query argument is the actual query

keytar.getPassword("Scopus",user).then((scopusApiKey) => {          // Get the password through keytar

// URL Building blocks
let rootUrl = "https://api.elsevier.com/content/search/scopus?query=";
let apiProm = "&apiKey="
let urlCount = "&count=";
let urlStart = "&start="
let docAmount = 0

let optionsRequest = {                              // Prepare options for the Request-Promise-Native Package
    uri: rootUrl + scopusQuery + apiProm + scopusApiKey + urlCount + 1 + urlStart + 0,
    headers: {'User-Agent': 'Request-Promise'},     // User agent to access is Request-promise
    json: true                                      // Automatically parses the JSON string in the response
};

rpn(optionsRequest)                                 // RPN stands for Request-promise-native (Request + Promise)
              .then(function (firstResponse) {      // Once you get the response

    let docAmount = firstResponse['search-results']['opensearch:totalResults']; // Get the total amount of docs

    let output = fs.createWriteStream(userDataPath+'/datasets/7scopus/2scopusDatasets/scopus-data-'+ scopusQuery +'.json'); // Start the stream

// Create the output document's properties
    let date = new Date().toJSON();                 // Create a timestamp
    output.write('{"Scopus-dataset-'+scopusQuery+   // Start the stream with ID info
    '":[{"queryDate":"'+date+
    '"},{"articleGeoloc":false},');
    output.write(JSON.stringify(firstResponse));    // Add the first response (can provide context info)
    output.write(',{"entries":[');                  // Open entries(=docs) array to be filled

var dataPromises = [];                              // Create empty array for the promises to come

for (let countStart = 0; countStart <= docAmount; countStart+=200){ // For each page of 200 documents

// Create a specific promise
let scopusTotalRequest = rootUrl + scopusQuery + apiProm + scopusApiKey + urlCount + 200 + urlStart + countStart ;

let optionsTotalRequest = {                              // Prepare options for the Request-Promise-Native Package
    uri: scopusTotalRequest,                             // URI to be accessed
    headers: {'User-Agent': 'Request-Promise'},          // User agent to access is Request-promise
    json: true                                           // Answer should be parsed as JSON
  };
dataPromises.push(rpn(optionsTotalRequest));             // Push promise in the relevant array
}

Promise.all(dataPromises)                                // Submit requests
    .then(function (scopusResponse) {                    // The response is an array with all pages of results

        for(let i = 0; i < scopusResponse.length; i++){  // For each page of (max 200) results
            let retrievedDocuments = scopusResponse[i]['search-results']['entry']; // Select the docs it contains

            for(let j = 0; j < retrievedDocuments.length; j++){ // For each document
                      output.write(JSON.stringify(retrievedDocuments[j])+",");  // Write it in the "entries" array
                    }
        }
        return
      })
    .then(function(){                                     // Once all entries/documents have been written
        output.write('{}]},{"documentComplete":true}]}'); // Add a signal object and close the "entries" array
        output.end();                                     // Close the stream
        output.on("finish", function () {                 // When the stream emits "finish" event
            ipcRenderer.send('chaeros-success', 'Success: Scopus API data retrieved'); // signal success to main process
            ipcRenderer.send('console-logs',"Scopus dataset on " + query + " for user "+ user +" have been successfully retrieved.");
            win.close();                                   // Close Chaeros
            }
        );
    })
      })
      .catch(function(e) {
        ipcRenderer.send('chaeros-failure', e);           // Send error to main process
        })
    })
}

//========== capcoRebuilder ==========
//This function has originally been designed to cater for the public debate organised on a platform designed by
//CapCollectif. It needs both the datafile generated by the platform and a matching file qualifying the core qualitative
//items, called "contributions". Once you've qualified the contributions, you can sort everything out.

const capcoRebuilder = (dataFile,dataMatch) => {

ipcRenderer.send('console-logs',"Rebuilding Capco dataset " + dataFile + " with matching file "+ dataMatch);

ipcRenderer.send('console-logs',"Filepath: " + userDataPath +"/datasets/6publicdebate/");


Promise.all([d3.csv(userDataPath+"/datasets/6publicdebate/1capco/"+dataFile, {credentials: 'include'}),     // Load the main datafile
             d3.csv(userDataPath+"/datasets/6publicdebate/2matching/"+dataMatch, {credentials: 'include'})  // Load secondary datafile with prop eval
          ]).then(datajson => {                                             // Then with the response array
          const rawData = datajson[0];                                      // First array/datafile is rawData var
          const opinionData = datajson[1];                                  // Second is opinionData (-> prop eval)

var data = [];
var links= [];

ipcRenderer.send('console-logs',"Files loaded");


//try{

  ipcRenderer.send('console-logs',"Cleaning and re-arranging data...");


// Nest all arrays in the main datafile by author_id.
var contributions = d3.nest().key(d => {return d.contributions_author_id;}).entries(rawData),
    votes =         d3.nest().key(d => {return d.contributions_votes_author_id;}).entries(rawData),
    args =          d3.nest().key(d => {return d.contributions_arguments_author_id;}).entries(rawData),
    reportings =    d3.nest().key(d => {return d.contributions_reportings_author_id;}).entries(rawData),
    sources =       d3.nest().key(d => {return d.contributions_sources_author_id;}).entries(rawData);

const dataBuffer = [];                                                      // Create empty dataBuffer array

const reKindle = () => {
dataBuffer.push(contributions,votes,args,reportings,sources);               // Push nested arrays in dataBuffer
}

reKindle();

const dataCleaner = () => {                                                 // Clean data by removing quadruplicates
    for (let i = 0; i < dataBuffer.length; i++) {                           // For each of the 5 arrays
      for (let j = 0; j < dataBuffer[i].length; j++) {                      // Loop each element
         if(dataBuffer[i][j].key === "") {                                  // If key (-> item_author_id) is empty
              dataBuffer[i].splice(j, 1);                                   // Splice this item
            }
         }
       }

 }

dataCleaner();                                                              // Run this function (comment out to prevent)

const authDirectory = () => {                                                // Add all authors to the "data" variable
  for (let i = 0; i < dataBuffer.length; i++) {                              // Iterate on the 5 arrays
    for (let j = 0; j < dataBuffer[i].length; j++) {                         // Iterate on all the objects within each array
      if (data.findIndex(d => d.author_id === dataBuffer[i][j].key)<0){      // Add author only if it doesn't already exist
        let auth = {"author_id":"","contributions":[],"votes":[],"args":[],"reportings":[],"sources":[]}; // Create object
        auth.author_id = dataBuffer[i][j].key;                               // data object auth id = dataBuffer object key
        data.push(auth);                                                     // Push object into data array
        }
       }
     }

 }

  ipcRenderer.send('console-logs',"Creating authors directory...");

authDirectory();                                                             // Run this function (comment out to prevent)

const contentPusher = () => {
// In the data array, fill each object's arrays with the relevant items. Each objects has 1 authord_id and 5 arrays
// (check the "auth" object model in the authDirectory function above). Each of those arrays will now to be filled
// with all the objects which have the same key (the same author_id). Each type of contribution is in a different
// array, which allows us to know about and select only the relevant properties.

  var contributionsBuilder = () => {                                         // Add all contributions to relevant objects
    for (let i = 0; i < dataBuffer[0].length; i++) {                         // For each element of dataBuffer's first array
        // The selected element is an array named "item" which contains all objects (here, contributions)
        // that have an indentical key/author_id
        let item = dataBuffer[0][i];
            for (let j = 0; j < item.values.length; j++) {                   // For each element (contrib) in the item array
            let contribItem = {};                                            // Create a new object
            contribItem.contributions_id = item.values[j].contributions_id;  // Fill it with all the relevant properties
            contribItem.contributions_author_id = item.values[j].contributions_author_id;
            contribItem.contributions_section_title = item.values[j].contributions_section_title;
            contribItem.contributions_title = item.values[j].contributions_title;
            contribItem.contributions_bodyText = item.values[j].contributions_bodyText;
            contribItem.contributions_createdAt = item.values[j].contributions_createdAt;
            contribItem.contributions_updatedAt = item.values[j].contributions_updatedAt;
            contribItem.contributions_url = item.values[j].contributions_url;
            contribItem.contributions_expired = item.values[j].contributions_expired;
            contribItem.contributions_published = item.values[j].contributions_published;
            contribItem.contributions_trashed = item.values[j].contributions_trashed;
            contribItem.contributions_trashedAt = item.values[j].contributions_trashedAt;
            contribItem.contributions_trashedReason = item.values[j].contributions_trashedReason;
            contribItem.contributions_votesCount = parseInt(item.values[j].contributions_votesCount);
            contribItem.contributions_votesCountOk = parseInt(item.values[j].contributions_votesCountOk);
            contribItem.contributions_votesCountMitige = parseInt(item.values[j].contributions_votesCountMitige);
            contribItem.contributions_votesCountNok = parseInt(item.values[j].contributions_votesCountNok);
            contribItem.contributions_argumentsCount = parseInt(item.values[j].contributions_argumentsCount);
            contribItem.contributions_argumentsCountFor = parseInt(item.values[j].contributions_argumentsCountFor);
            contribItem.contributions_argumentsCountAgainst = parseInt(item.values[j].contributions_argumentsCountAgainst);
            contribItem.contributions_versionsCount = parseInt(item.values[j].contributions_versionsCount);

            for (let f = 0; f < opinionData.length; f++) {                  // Add opinionData (prop eval) to each contrib
              // If the contribItem id matches an opinionData id, push the property
              if(contribItem.contributions_id === opinionData[f].contributions_id) {contribItem.opinion = opinionData[f].opinion}
            }
          for (let k = 0; k < data.length; k++) {                              // Loop through the data array
              if (data[k].author_id === contribItem.contributions_author_id) { // If the contribItem id matches a data obj
                data[k].contributions.push(contribItem);                       // Push the contrib item in the contrib array
                  }
              }
            }
          }
        }

//Repeat the same for the 5 types of objects
  var votesBuilder = () => {
    for (let i = 0; i < dataBuffer[1].length; i++) {
        let item = dataBuffer[1][i];
            for (let j = 0; j < item.values.length; j++) {
                let voteItem = {};
                voteItem.contributions_votes_author_id = item.values[j].contributions_votes_author_id;
                voteItem.contributions_votes_createdAt = item.values[j].contributions_votes_createdAt;
                voteItem.contributions_votes_expired = item.values[j].contributions_votes_expired;
                voteItem.contributions_votes_id = item.values[j].contributions_votes_id;
                voteItem.contributions_votes_value = item.values[j].contributions_votes_value;
              for (let k = 0; k < data.length; k++) {
                  if (data[k].author_id === voteItem.contributions_votes_author_id) {
                    data[k].votes.push(voteItem);
                  }
              }
            }
          }
        }

  var argBuilder = () => {
    for (let i = 0; i < dataBuffer[2].length; i++) {
        let item = dataBuffer[2][i];
            for (let j = 0; j < item.values.length; j++) {
                let argItem = {};
                argItem.contributions_arguments_author_id = item.values[j].contributions_arguments_author_id;
                argItem.contributions_arguments_body = item.values[j].contributions_arguments_body;
                argItem.contributions_arguments_createdAt = item.values[j].contributions_arguments_createdAt;
                argItem.contributions_arguments_expired = item.values[j].contributions_arguments_expired;
                argItem.contributions_arguments_id = item.values[j].contributions_arguments_id;
                argItem.contributions_arguments_published = item.values[j].contributions_arguments_published;
                argItem.contributions_arguments_related_id = item.values[j].contributions_arguments_related_id;
                argItem.contributions_arguments_related_kind = item.values[j].contributions_arguments_related_kind;
                argItem.contributions_arguments_trashed = item.values[j].contributions_arguments_trashed;
                argItem.contributions_arguments_trashedAt = item.values[j].contributions_arguments_trashedAt;
                argItem.contributions_arguments_trashedReason = item.values[j].contributions_arguments_trashedReason;
                argItem.contributions_arguments_type = item.values[j].contributions_arguments_type;
                argItem.contributions_arguments_updatedAt = item.values[j].contributions_arguments_updatedAt;
                argItem.contributions_arguments_url = item.values[j].contributions_arguments_url;
                argItem.contributions_arguments_votesCount = parseInt(item.values[j].contributions_arguments_votesCount);
              for (let k = 0; k < data.length; k++) {
                  if (data[k].author_id === argItem.contributions_arguments_author_id) {
                    data[k].args.push(argItem);
                  }
              }
            }
          }
        }

        var reportBuilder = () => {
          for (let i = 0; i < dataBuffer[3].length; i++) {
              let item = dataBuffer[3][i];
                  for (let j = 0; j < item.values.length; j++) {
                      let reportItem = {};
                      reportItem.contributions_reportings_author_id = item.values[j].contributions_reportings_author_id;
                      reportItem.contributions_reportings_body = item.values[j].contributions_reportings_body;
                      reportItem.contributions_reportings_createdAt = item.values[j].contributions_reportings_createdAt;
                      reportItem.contributions_reportings_id = item.values[j].contributions_reportings_id;
                      reportItem.contributions_reportings_related_id = item.values[j].contributions_reportings_related_id;
                      reportItem.contributions_reportings_related_kind = item.values[j].contributions_reportings_related_kind;
                      reportItem.contributions_reportings_type = item.values[j].contributions_reportings_type;

                    for (let k = 0; k < data.length; k++) {
                        if (data[k].author_id === reportItem.contributions_reportings_author_id) {
                          data[k].reportings.push(reportItem);
                        }
                    }
                  }
                }
              }

        var sourceBuilder = () => {
          for (let i = 0; i < dataBuffer[4].length; i++) {
              let item = dataBuffer[4][i];
                  for (let j = 0; j < item.values.length; j++) {
                      let sourceItem = {};
                      sourceItem.contributions_sources_author_id = item.values[j].contributions_sources_author_id;
                      sourceItem.contributions_sources_body = item.values[j].contributions_sources_body;
                      sourceItem.contributions_sources_createdAt = item.values[j].contributions_sources_createdAt;
                      sourceItem.contributions_sources_expired = item.values[j].contributions_sources_expired;
                      sourceItem.contributions_sources_id = item.values[j].contributions_sources_id;
                      sourceItem.contributions_sources_published = item.values[j].contributions_sources_published;
                      sourceItem.contributions_sources_related_id = item.values[j].contributions_sources_related_id;
                      sourceItem.contributions_sources_related_kind = item.values[j].contributions_sources_related_kind;
                      sourceItem.contributions_sources_trashed = item.values[j].contributions_sources_trashed;
                      sourceItem.contributions_sources_trashedAt = item.values[j].contributions_sources_trashedAt;
                      sourceItem.contributions_sources_trashedReason = item.values[j].contributions_sources_trashedReason;
                      sourceItem.contributions_sources_updatedAt = item.values[j].contributions_sources_updatedAt;
                      sourceItem.contributions_sources_votesCount = item.values[j].contributions_sources_votesCount;
                    for (let k = 0; k < data.length; k++) {
                        if (data[k].author_id === sourceItem.contributions_sources_author_id) {
                          data[k].sources.push(sourceItem);
                        }
                    }
                  }
                }
              }
// Trigger all functions - comment out those you don't need (this can be long according to the shape of the data)
contributionsBuilder();
votesBuilder();
argBuilder();
reportBuilder();
sourceBuilder();
}

ipcRenderer.send('console-logs',"Pushing content in directory...");

contentPusher();                                                            // Run function

const scoreBuilder = () => {                                                // Build an impact score for each author_id
data.forEach(d => {                                                         // For each item in data
      let contribAmount = d.contributions.length;                           // Amount of contributions submitted
      let voteAmount = d.votes.length;                                      // Amount of votes submitted
      let argAmount = d.args.length;                                        // Amount of arguments submitted
      let scoreBuffer = [];

      let contribVotes = () => {                                            // Amount of votes recieved on all contributions
        let votes = 0;
        for (let i = 0; i < contribAmount; i++) {
          votes = votes + d.contributions[i].contributions_votesCount;
        }
        scoreBuffer.push(votes);
      }

      let contribArgs = () => {                                             // Amount of args recieved on all contributions
        let args = 0;
        for (let i = 0; i < contribAmount; i++) {
          args = args + d.contributions[i].contributions_argumentsCount;
        }
        scoreBuffer.push(args);
      }

      let voteArgs = () => {                                                // Amount of votes recieved on all contributions
        let votes = 0;
        for (let i = 0; i < argAmount; i++) {
          votes = votes + d.args[i].contributions_arguments_votesCount;
        }
        scoreBuffer.push(votes);
      }

      contribVotes();
      contribArgs();
      voteArgs();

      let totalVotesReceivedOnContributions = scoreBuffer[0];
      let totalArgsReceivedOnContributions = scoreBuffer[1];
      let totalVotesReceivedOnArguments = scoreBuffer[2];

      d.score = {};
      d.score.contribScore = (contribAmount*5) + totalVotesReceivedOnContributions + (totalArgsReceivedOnContributions*2);
      d.score.voteScore = voteAmount*3;
      d.score.argScore = (argAmount*2) + (totalVotesReceivedOnArguments/3);
      d.score.totalScore = d.score.contribScore + d.score.voteScore + d.score.argScore;

  });

}

ipcRenderer.send('console-logs',"Building score...");
scoreBuilder();                                                            // Trigger score function

const opinionBuilder = () => {                                             // Build an opinion Score
// In this function, a score whose limit is -∞ is considered "c" (conservative) and a score whose limit is +∞ is
// considered "l" (liberal). The absolute value of the score isn't qualitative but quantitative, which means it doesn't
// show how conservative/liberal the person is on a value spectrum, but rather on which side of the debate the person
// falls when making the sum of all its interactions with the available material. That means abscissa data gets more
// and more interesting and relevant as its related ordinate data increases, and/or it is significantly deviating from 0.
// Its main limit is that it is binary: you're either going towards A or towards B. This doesn't allow for more precise
// belonging to a cluster.

  data.forEach(d => {                                                      // For each author object

    let opinionBuffer = [];                                                // Create an empty opinion Buffer

    let contribWeight = () => {                                            // Opinion score per contribution
      let contribOpinionScore = 0;                                         // Start at 0
      let coeff = 10;                                                      // Each contribution is worth X points
      for (let i = 0; i < d.contributions.length; i++) {                   // For each contribution
        if      (d.contributions[i].opinion === "c") {contribOpinionScore -= coeff} // if contrib is "c", minus coeff points
        else if (d.contributions[i].opinion === "l") {contribOpinionScore += coeff} // if contrib is "l", add coeff points

      }
      opinionBuffer.push(contribOpinionScore);                             // Once done, push result to opinion Buffer
    }

    let argWeight = () => {
// Do the same for arguments, which is a tiny bit harder because opinion has to be infered from both the contributions
// it comments and the overall orientation of the argument (FOR/AGAINST). Depending on the data, this can be
// CPU intensive.
       let argOpinionScore = 0;
       let coeff = 4;

      const linkPusher = (argSource,contribTarget) => {                               // Design a function to push links
         let link = {};                                                               // Create empty link object
           link.source = argSource.contributions_arguments_author_id;
           link.target = contribTarget.contributions_author_id;
           link.type = argSource.contributions_arguments_type;
           link.opacity = 0.01;                                                       // Opacity starts low
           if (link.source !== link.target){                                          // If source != target
            if (links.length===0) { links.push(link);}                                // If first link, push it
            else if (links.length>0) {                                                // If it isn't
                     for (let i = 0; i < links.length; i++) {                         // Loop on existing links
                       let e = links[i];                                              // Check if it is the same
                             if ((links.findIndex(e => e.source === link.source))<0) {// If isn't, push new link
                                     links.push(link);
                                   }
                             else if ((links.findIndex(e => e.target === link.target))<0) {
                               e.opacity = parseFloat(e.opacity+=0.01);               // Else add opacity to existing
                             }
                         }
                       }
                     }
                   }


      for (let i = 0; i < d.args.length; i++) {                            // Loop each argument of the selected author
        for (let j = 0; j < data.length; j++) {                            // Then loop each object in the data
          for (let k = 0; k < data[j].contributions.length; k++) {         // Then loop each contrib of each object
          // If the id of the contribution equals the id of the contribution to which the argument is related
          if(data[j].contributions[k].contributions_id === d.args[i].contributions_arguments_related_id){
            if      (data[j].contributions[k].opinion === "c") {           // If the contribution is "c"
              if (d.args[i].contributions_arguments_type === "FOR")        // And the argument is "FOR"
                                                {argOpinionScore -= coeff; // Substract coeff points
                                                linkPusher(d.args[i],data[j].contributions[k]);}
              else if (d.args[i].contributions_arguments_type === "AGAINST") // else if the argument is "AGAINST"
                                                {argOpinionScore += coeff; // Add coeff points
                                                linkPusher(d.args[i],data[j].contributions[k]);}
            }
            else if (data[j].contributions[k].opinion === "l") {           // If the contribution is "l"
              if (d.args[i].contributions_arguments_type === "FOR")        // And the argument is "FOR"
                                                {argOpinionScore += coeff; // Add coeff points
                                                 linkPusher(d.args[i],data[j].contributions[k]);}
              else if (d.args[i].contributions_arguments_type === "AGAINST") // Else if argument is "AGAINST"
                                                {argOpinionScore -= coeff; // Substract coeff points
                                                  linkPusher(d.args[i],data[j].contributions[k]);}
                }
              }
          }
        }
      }
      opinionBuffer.push(argOpinionScore);                                 // Push argument opinion score to item
    }

    contribWeight();
    argWeight();

    let contribTotalOpinionScore =  opinionBuffer[0];
    let contribTotalArgScore =  opinionBuffer[1];

    d.opinionSpectrum = {};
    d.opinionSpectrum.contribOpinionScore = contribTotalOpinionScore;
    d.opinionSpectrum.contribArgScore = contribTotalArgScore;
    d.opinionSpectrum.score = d.opinionSpectrum.contribOpinionScore + d.opinionSpectrum.contribArgScore;
  });
}

ipcRenderer.send('console-logs',"Building opinion...");

opinionBuilder();

const amountCalc = (e,f) => {                                   // Create a function to compute the total amount of items
  let amount = 0;
  for (let i=0; i<e.length; i++){                               // Loop through all elements
    amount = amount + e[i][f].length;                           // Check how many objects are in the [f] argument array
  }
  return amount                                                 // Return result
}

const contribTotalAmount = amountCalc(data,"contributions");
const argsTotalAmount = amountCalc(data,"args");
const votesTotalAmount = amountCalc(data,"votes");
const reportTotalAmount = amountCalc(data,"reportings");
const sourcesTotalAmount = amountCalc(data,"sources");

const totalEngagement = {"Contributions":contribTotalAmount, "Arguments":argsTotalAmount, "Votes":votesTotalAmount,"Reports":reportTotalAmount, "Sources":sourcesTotalAmount};

ipcRenderer.send('console-logs',totalEngagement);

let bestScore = () => {                                                    // Establish who's the best score
  let topOne = {};
  topOne.score = {};
  topOne.score.totalScore = 0;
  for (let i=0; i<data.length; i++){
    if (data[i].score.totalScore>topOne.score.totalScore){                 // If the next object has a bigger score
      topOne.score.totalScore = data[i].score.totalScore;                  // Replace previous score by this one
      topOne.id = data[i].author_id;                                       // Store its author_id
    }
  }
  ipcRenderer.send('console-logs',topOne);                                 // Useful for visualisation calibration
  for (let i=0; i<data.length; i++){
    if (data[i].author_id===topOne.id){
      data[i].score.totalScore = -200;
      data[i].opinionSpectrum.score = 0;

    }
  }
}

bestScore();

//========== lexicAnalysis ==========
// lexicAnalysis is a way to generate keywords (tokens) used by the participants of a qualitative survey
// or set of interviews, and then see what kind of keywords each participants has been using to establish their
// belonging to a group using TF-IDF.

const lexicAnalysis = (data,dataset) => {

var totalFreqs = new MultiSet();

data.forEach(d=>{

    for (let i=0; i<d.contributions.length;i++) {                   // Generate total text, though this is capco spec
        d.text += d.contributions[i].contributions_title +" "+ d.contributions[i].contributions_bodyText;
      }
    for (let j=0; j<d.args.length;j++) {
        d.text += d.args[j].contributions_arguments_body;
      }
  //  totalText = totalText+d.text;
    let tokens = wordTokenizer(d.text);                                                   // Generate tokens
    let carryStemmed = tokens.map(word => carryStemmer(word.replace("undefined","")));    // CarryStem tokens (for FR)
    d.freqs = MultiSet.from(carryStemmed);                                                // Make a multiset out of that
    d.freqs.forEachMultiplicity((count,key)=>{                                            // For each stem
      totalFreqs.add(key);                                                                // Add to totalText
    })
    delete d.text;                                                                        // Remove text property
})

totalFreqs.forEachMultiplicity((count,key) => {                         // For each totalFreqs item (key AND count)
  let editedCount = Math.log10(data.length/count);                      // Apply IDF formula (using log10)
  if (key.length>3){                                                    // Only if radical is longer than 3 characters
        totalFreqs.set(key,editedCount);                                // Replace item's count by IDF count
      } else {
        totalFreqs.delete(key);                                         // Else delete item
      }
});

var idf = totalFreqs.top(totalFreqs.dimension);                         // Order freqs for dev purpose

var communitySet = new MultiSet();                                      // Create communitySet

data.forEach(d=>{                                                       // For each "person"
  d.realFreqs = new MultiSet();                                         // Create realFreqs multiset
  d.freqs.forEachMultiplicity((count,key) => {                          // For each freqs item
    let editedKey = key.replace('undefined','');                        // Remove undefineds (shouldn't exist)
    let editedCount = 1+(count/d.freqs.dimension);                      // Edit count (TF)
    if (editedKey.length>3){                                            // If radical is longer than 3 characters
          d.realFreqs.add(editedKey,editedCount);                       // Add to realFreqs
      }
    })

    delete d.freqs;                                                     // Remove freqs
    d.terms = [];                                                       // Create terms

    totalFreqs.forEachMultiplicity((count,key) => {                     // For each item in the total radical corpus
            d.realFreqs.forEachMultiplicity((realCount, realKey)=>{     // For each radical in this person
              if (realKey===key){                                       // If their is a match
                let item = {"value":"","count":"","tfIdf":""};          // Create item and fill it
                item.value = realKey;
                item.count = realCount;
                item.tfIdf = realCount*count;
                d.terms.push(item);                                     // Push term in the "terms" array
                }
            })
        })
    delete d.realFreqs;                                                 // Remove realFreqs, since terms exist

    d.terms.sort((a,b)=>b.tfIdf-a.tfIdf);                               // Sort terms by tfidf "score"

    d.topTerms = [];                                                    // Create top terms array

    if (d.terms.length > 4){                                            // If the radical is longer than 3 characters
        for (var i = 0; i < 5; i++) {                                   // For the top 5 radicals
          communitySet.add(d.terms[i].value);                           // Add to community MultiSet
          d.topTerms.push(d.terms[i].value);                            // Add to topTerms
          }
  }
    });

var communitySet = communitySet.top(50);                                // Limit community MultiSet to the top 50 terms

    var dataToWrite = JSON.stringify(data);
console.log(data)
        fs.writeFile(
          userDataPath+'/datasets/6publicdebate/3pubdeb/lexi-'+dataset+".json",
          dataToWrite,
          'utf8',
          (err) => {if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};
        });
console.log(communitySet)
        communitySet = JSON.stringify(communitySet);

          fs.writeFile(
            userDataPath+'/datasets/6publicdebate/5commun/commun-'+dataset+".json",
            communitySet,
            'utf8',
            (err) => {if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};
          });
}

ipcRenderer.send('console-logs',"Starting lexical analysis...");

lexicAnalysis(data,dataFile.substring(0,dataFile.length-4));

ipcRenderer.send('console-logs',"Lexical analysis on " + dataFile + "complete. Writing files ...");
//}
//finally{
console.log(links)
        let datalink = JSON.stringify(links);
          fs.writeFile(
            userDataPath +'/datasets/6publicdebate/4links/'+dataMatch.substring(0,dataMatch.length-4)+'.json',datalink,'utf8',
              (err) => {if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};
          });
    ipcRenderer.send('console-logs',"CapCo " + dataFile + " links has been successfully written.");
          ipcRenderer.send('chaeros-success', 'Success: dataset rebuilt');
        //  win.close();
        //}
  });
}




//========== zoteroItemsRetriever ==========
// zoteroItemsRetriever retrieves all the documents from one or more zotero collections. A zotero API request can only
// retrieve 100 items, which can easily trigger the rate limiting.

const zoteroItemsRetriever = (collections,zoteroUser,importName,path) => {

  ipcRenderer.send('console-logs',"Started retrieving collections " + collections + "for user "+zoteroUser+" under the import name "+ importName + " and under the path "+path);

let zoteroPromises = [];

let stamp = new Date().toJSON().replace(/:/g, '-');                               // Prepare a timestamp

keytar.getPassword("Zotero", zoteroUser).then((zoteroApiKey) => {                 // Open keytar

for (let j = 0; j < collections.length; j++) {                                    // Loop on collections

  // URL Building blocks
  let rootUrl = "https://api.zotero.org/groups/";
  let urlBase = "/collections/"+collections[j].key;
  let collectionComp = "&v=3&key=";

  let zoteroCollectionRequest = rootUrl + zoteroUser + urlBase + "?" + collectionComp + zoteroApiKey;   // Build the url

  var optionsCollecsRequest = {                      // Prepare options for the Request-Promise-Native Package
      uri: zoteroCollectionRequest,                  // URI to be accessed
      headers: {'User-Agent': 'Request-Promise'},    // User agent to access is Request-promise
      json: true                                     // Automatically parses the JSON string in the response
    };
  zoteroPromises.push(rpn(optionsCollecsRequest));   // Push promise in the relevant array
  }

  Promise.all(zoteroPromises)
      .then((zoteroItemsResponse)=>{

        zoteroItemsResponse.forEach(f=>{

        f.name = f.data.name;
        f.items = [];

        let itemRequests = [];

          for (var i = 0; i < f.meta.numItems; i+=100) {

            let rootUrl = "https://api.zotero.org/groups/";
            let urlBase = "/collections/"+ f.data.key;
            var zoteroVersion = "/items/top?&v=3&format=csljson&start="+ i +"&limit=100&key=";
            let zoteroItemsRequest = rootUrl + zoteroUser + urlBase + zoteroVersion + zoteroApiKey;

            var optionsItemsRequest = {
                uri: zoteroItemsRequest,
                headers: {'User-Agent': 'Request-Promise'},
                json: true
              };

            itemRequests.push(rpn(optionsItemsRequest))
          }
       Promise.all(itemRequests).then((response)=> {
         for (var i = 0; i < response.length; i++) {
           response[i].items.forEach(d=>f.items.push(d))
           fs.writeFile(                                                 // Write data
             userDataPath+path+importName+'-'+stamp+'.json',JSON.stringify(zoteroItemsResponse),'utf8',         // Options
               (err) => {if (err)
               ipcRenderer.send('chaeros-failure', err);                 // On failure, send error to main process
           })
         }
      })
  })
    ipcRenderer.send('console-logs',"Retrieval successful. "+importName+ " zotero dataset imported in "+path);
    ipcRenderer.send('chaeros-success', 'Zotero dataset imported');
    win.hide();
  })
}) // closing Keytar
}

//========== zoteroCollectionBuilder ==========
// zoteroCollectionBuilder creates a new collection from a CSL-JSON dataset.

const zoteroCollectionBuilder = (collectionName,zoteroUser,path) => {

ipcRenderer.send('console-logs',"Building collection" + collectionName + " for user " + zoteroUser +" in path "+path);

  fs.readFile(userDataPath + path,'utf8', (err, data) => {                // Read the designated datafile
    if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};      // Throw an error if readFile fails
    try {                                                                 // If the file is valid, do the following:

    let file = JSON.parse(data);                                          // Parse data as JSON array

    const limiter = new bottleneck({                                      // Create a bottleneck to prevent API rate limit
      maxConcurrent: 1,                                                   // Only one request at once
      minTime: 150                                                        // Every 150 milliseconds
    });

keytar.getPassword("Zotero", zoteroUser).then((zoteroApiKey) => {         // Retrieve password through keytar

// URL Building blocks
var rootUrl = "https://api.zotero.org/groups/";
var collectionCreationUrl = rootUrl + zoteroUser + "/collections?&v=3&key="+zoteroApiKey;

var collectionItem = [{"name" : "","parentCollection" : ""}];             // Create the Collection item to be sent
collectionItem[0].name = collectionName;

var optionsCollectionCreation = {                                // Prepare options for the Request-Promise-Native Package
    method: 'POST',                                              // Use POST method
    uri: collectionCreationUrl,                                  // URI to be accessed
    headers: {'User-Agent': 'Request-Promise'},                  // Headers (some options can be added here)
    body: collectionItem,                                        // Bundle the Collection Item with the request
    json: true                                                   // Automatically parses the JSON string in the response
  };

let collectionCode = {"code":""};

    rpn(optionsCollectionCreation).then((collectionName) => {    // Send the request through RPN

    collectionCode.code =collectionName.success['0'];            // Retrieve name from the response

    let fileArrays = [];                                         // Create empty array

    file.forEach(file=>{                                         // For each file object
      file.collections = [];                                     // Create a "collections" property
      file.collections.push(collectionCode.code);                // Push the collection code attributed by Zotero
    })
          for (let i=0; i<file.length; i+=50){                   // Only 50 items can be sent per request
            let subArray = {"items":[]};                         // Create subArray item
            let limit = i+50;                                    // The upper limit is start + 50 items
            for (let j=i; j<limit; j++){                         // Iterate on items to be sent
              subArray.items.push(file[j]);                      // Push files in subarray
            }
            fileArrays.push(subArray);                           // Push subArray in fileArrays
          }

    Promise.all(fileArrays.forEach((d)=>{                        // Send all requests as promises (bottlenecked)

        let subArrayUpload = {                                   // Designing promises
            method: 'POST',
            uri: rootUrl + zoteroUser + "/items?&v=3&key="+zoteroApiKey,
            headers: {'User-Agent': 'Request-Promise'},
            body: d.items,
            json: true
          };

        return limiter.schedule(rpn,subArrayUpload).then((res) => {                   // Enforce bottleneck
                if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};      // Send error to console

        })


   }))
ipcRenderer.send('console-logs',"Collection "+JSON.stringify(collectionName)+" built.");              // Send success message to console

}); //end of keytar

})    } catch(e) {
        ipcRenderer.send('console-logs',e);
      }
      finally{
        ipcRenderer.send('chaeros-success', 'Success: Zotero collection created');   // Send success message to main Display
      }
  })
}



//========== chaerosSwitch ==========
// Switch used to choose the function to execute in CHÆROS.

const chaerosSwitch = (fluxAction,fluxArgs) => {

ipcRenderer.send('console-logs',"CHÆROS started a "+ fluxAction +" process with the following arguments : " + JSON.stringify(fluxArgs));

      switch (fluxAction) {

          case 'lexicAnalysis' : lexicAnalysis(fluxArgs.lexicAnalysis.dataset);
          break;

          case 'scopusConverter' : scopusConverter(fluxArgs.scopusConverter.dataset);
          break;

          case 'scopusGeolocate' : scopusGeolocate(fluxArgs.scopusGeolocate.dataset,fluxArgs.scopusGeolocate.user);
          break;

          case 'scopusRetriever' : scopusRetriever(fluxArgs.scopusRetriever.user,fluxArgs.scopusRetriever.query);
          break;

          case 'capcoRebuilder' : capcoRebuilder(fluxArgs.capcoRebuilder.dataFile,fluxArgs.capcoRebuilder.dataMatch);
          break;

          case 'zoteroItemsRetriever' : zoteroItemsRetriever(fluxArgs.zoteroItemsRetriever.collections,fluxArgs.zoteroItemsRetriever.zoteroUser,fluxArgs.zoteroItemsRetriever.importName,fluxArgs.zoteroItemsRetriever.path);
          break;

          case 'zoteroCollectionBuilder' : zoteroCollectionBuilder(fluxArgs.zoteroCollectionBuilder.collectionName,fluxArgs.zoteroCollectionBuilder.zoteroUser,fluxArgs.zoteroCollectionBuilder.path);
          break;

      }

}

module.exports = {chaerosSwitch: chaerosSwitch};                            // Export the switch as a module
