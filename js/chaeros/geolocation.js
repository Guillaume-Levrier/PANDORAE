//========== GEOLOCATION ==========
// Several strategies are applicable. One is to take data from most populated cities,

// another is to ask a services such as geocode.earth.

// It now makes more sense to first uniformize the document and then enrich it.

const geolocateAffiliations = (dataset) => {
  const geocode_api_key = "";
  pandodb.enriched.get(dataset).then((data) => {
    const documents = doc.content.entries;

    // map affiliations

    /* fetch(
        `https://api.geocode.earth/v1/search?api_key=${geocode_api_key}&text=${affiliation}`
      ).then((response) => response.json()); 
      */
  });
};

//========== scopusGeolocate ==========
// scopusGeolocate gets cities/countries geographical coordinates from affiliations.

const scopusGeolocate = (dataset) => {
  geolocationActive = true;
  window.electron.send("chaeros-notification", "Geolocating affiliations");
  window.electron.send("console-logs", "Started scopusGeolocate on " + dataset);

  pandodb.enriched.get(dataset).then((doc) => {
    fs.readFile(
      appPath + "/json/cities.json", // Read the dataset passed as option
      "utf8",
      (err, locatedCities) => {
        // It should be encoded as UTF-8

        var coordinates = JSON.parse(locatedCities);

        let article = doc.content.entries; // Find relevant objects in the parsed dataset
        let totalCityArray = []; // Prepare an empty array

        for (var i = 0; i < article.length - 1; i++) {
          // For loop to generate list of cities to be requested
          if (
            article[i].hasOwnProperty("affiliation") &&
            article[i].affiliation.length > 0
          ) {
            // If item has at least an affiliation
            for (let j = 0; j < article[i].affiliation.length; j++) {
              // Iterate on item's available affiliation
              if (
                article[i].affiliation[j].hasOwnProperty("affiliation-country")
              ) {
                // If affiliation has a city
                let location = {};
                location.country =
                  article[i].affiliation[j]["affiliation-country"];
                location.city = article[i].affiliation[j]["affiliation-city"]; // Extract city name
                totalCityArray.push(JSON.stringify(location));
              }
            }
          }
        }
        let cityRequests = MultiSet.from(totalCityArray); // Create a multiset from city Array to prevent duplicate requests

        let cityIndex = [];

        cityRequests.forEachMultiplicity((count, key) => {
          cityIndex.push(JSON.parse(key));
        });

        cityIndex.forEach((d) => {
          for (let l = 0; l < coordinates.length; l++) {
            if (d.country === coordinates[l].country) {
              if (d.city === coordinates[l].name) {
                d.lon = coordinates[l].lon;
                d.lat = coordinates[l].lat;
              }
            }
          }
        });

        article.forEach((d) => {
          for (let l = 0; l < cityIndex.length; l++) {
            if (d.hasOwnProperty("affiliation")) {
              for (var k = 0; k < d.affiliation.length; k++) {
                // Loop on available item's affiliations

                let city = d.affiliation[k]["affiliation-city"]; // Extract affiliation city
                let country = d.affiliation[k]["affiliation-country"]; // Extract affiliation city

                if (typeof city === "object") {
                  city = JSON.stringify(city);
                } // Stringify to allow for comparison
                if (typeof country === "object") {
                  country = JSON.stringify(country);
                } // Stringify to allow for comparison

                if (country === cityIndex[l].country) {
                  if (city === cityIndex[l].city) {
                    window.electron.send(
                      "chaeros-notification",
                      "Located " + d.affiliation[k]["affilname"] + " in " + city
                    );
                    d.affiliation[k].lon = cityIndex[l].lon;
                    d.affiliation[k].lat = cityIndex[l].lat;
                  }
                }
              }
            }
          }
        });

        let unlocatedCities = [];

        article.forEach((d) => {
          if (d.hasOwnProperty("affiliation")) {
            for (let i = 0; i < d.affiliation.length; i++) {
              if (d.affiliation[i].lon === undefined) {
                unlocatedCities.push(
                  d.affiliation[i]["affiliation-city"] +
                    ", " +
                    d.affiliation[i]["affiliation-country"]
                );
              }
            }
          }
        });

        window.electron.send(
          "console-logs",
          "Unable to locale the " +
            unlocatedCities.length +
            " following cities " +
            JSON.stringify(unlocatedCities)
        );
        doc.content.articleGeoloc = true; // Mark file as geolocated
        pandodb.enriched.put(doc);

        window.electron.send("chaeros-notification", "Affiliations geolocated"); //Send success message to main process
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "scopusGeolocate successfully added geolocations on " + dataset
        );

        setTimeout(() => {
          window.electron.send("win-destroy", winId);
        }, 2000);
      }
    );
  });
};

//========== webofscienceGeolocate ==========
// webofscienceGeolocate gets cities/countries geographical coordinates from affiliations.

const webofscienceGeolocate = (dataset) => {
  geolocationActive = true;
  window.electron.send("chaeros-notification", "Geolocating affiliations");
  window.electron.send(
    "console-logs",
    "Started webofscienceGeolocate on " + dataset
  );

  pandodb.enriched.get(dataset).then((doc) => {
    fs.readFile(
      appPath + "/json/cities.json", // Read the dataset passed as option
      "utf8",
      (err, locatedCities) => {
        // It should be encoded as UTF-8

        var coordinates = JSON.parse(locatedCities);

        let article = doc.content.entries; // Find relevant objects in the parsed dataset
        let totalCityArray = []; // Prepare an empty array

        for (var i = 0; i < article.length - 1; i++) {
          // For loop to generate list of cities to be requested
          if (
            article[i].hasOwnProperty("affiliation") &&
            article[i].affiliation.length > 0
          ) {
            // If item has at least an affiliation
            for (let j = 0; j < article[i].affiliation.length; j++) {
              // Iterate on item's available affiliation
              if (
                article[i].affiliation[j].hasOwnProperty("affiliation-country")
              ) {
                // If affiliation has a city
                let location = {};
                location.country =
                  article[i].affiliation[j]["affiliation-country"];
                location.city = article[i].affiliation[j]["affiliation-city"]; // Extract city name
                totalCityArray.push(JSON.stringify(location));
              }
            }
          }
        }
        let cityRequests = MultiSet.from(totalCityArray); // Create a multiset from city Array to prevent duplicate requests

        let cityIndex = [];

        cityRequests.forEachMultiplicity((count, key) => {
          cityIndex.push(JSON.parse(key));
        });

        cityIndex.forEach((d) => {
          for (let l = 0; l < coordinates.length; l++) {
            if (d.country === coordinates[l].country) {
              if (d.city === coordinates[l].name) {
                d.lon = coordinates[l].lon;
                d.lat = coordinates[l].lat;
              }
            }
          }
        });

        article.forEach((d) => {
          for (let l = 0; l < cityIndex.length; l++) {
            if (d.hasOwnProperty("affiliation")) {
              for (var k = 0; k < d.affiliation.length; k++) {
                // Loop on available item's affiliations

                let city = d.affiliation[k]["affiliation-city"]; // Extract affiliation city
                let country = d.affiliation[k]["affiliation-country"]; // Extract affiliation city

                if (typeof city === "object") {
                  city = JSON.stringify(city);
                } // Stringify to allow for comparison
                if (typeof country === "object") {
                  country = JSON.stringify(country);
                } // Stringify to allow for comparison

                if (country === cityIndex[l].country) {
                  if (city === cityIndex[l].city) {
                    window.electron.send(
                      "chaeros-notification",
                      "Located " + d.affiliation[k]["affilname"] + " in " + city
                    );
                    d.affiliation[k].lon = cityIndex[l].lon;
                    d.affiliation[k].lat = cityIndex[l].lat;
                  }
                }
              }
            }
          }
        });

        let unlocatedCities = [];

        article.forEach((d) => {
          if (d.hasOwnProperty("affiliation")) {
            for (let i = 0; i < d.affiliation.length; i++) {
              if (d.affiliation[i].lon === undefined) {
                unlocatedCities.push(d.affiliation[i]);
              }
            }
          }
        });

        window.electron.send(
          "console-logs",
          "Unable to locale the following cities " +
            JSON.stringify(unlocatedCities)
        );
        doc.content.articleGeoloc = true; // Mark file as geolocated
        pandodb.enriched.put(doc);

        window.electron.send("chaeros-notification", "Affiliations geolocated"); //Send success message to main process
        window.electron.send("pulsar", true);
        window.electron.send(
          "console-logs",
          "scopusGeolocate successfully added geolocations on " + dataset
        );

        setTimeout(() => {
          window.electron.send("win-destroy", winId);
        }, 2000);
      }
    );
  });
};

export { scopusGeolocate };
