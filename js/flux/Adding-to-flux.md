# Adding a new service to FLUX

Flux is PANDORAE's data retrieving pipeline.

Its main purpose is to retrieve data from an external service (typically by sending API requests), standardize that data to a consistent format, and upload the result under the form of a corpus to the Zotero service.

This file explains how to connect a new service to PANDORAE, that is to enable FLUX to retrieve data from an external API.

Flux can also supports other data retrieval strategies, but those usually require ad-hoc developments.

## What happens for the user in abstract terms when retrieving data from a service

The PANDORAE user is encouraged to retrieve data by :

1. Opening the FLUX window. Only 1 FLUX window can be opened at a given point in time.
2. Selecting the relevant FLUX category using the top-left radio buttons.
3. Clicking on the desired service tab. Tabs are cascade labels with capitalized TITLES and with a unique color border.
4. Filling an API request form. The form is usually a string input, sometimes more options are available.
5. Submitting the API request probe. This first request is a FETCH sent by the flux context itself. It is as light as possible, since its purpose is not to retrieve actual results but result metadata, such as the number of entries yielded by this request.
6. When a probe is deemed satisfactory, submitting the actual request (which typically goes to powervalve and is sent to chaeros).

Once step 6 is triggered, the order is dispatched to PANDORAE's main context which will create a specific CHAEROS context to retrieve the data and close the FLUX context. Whatever happens next (ie, the standardization of that request's result) will be the purpose of another FLUX operation.

## What you need to do in technical terms

Plugging a new service to PANDORAE happens in 5 steps:

1. Add the source to the external dns list to which PANDORAE is allowed to connect.
2. Create a FLUX tab with a form where users can submit requests and ideally consult previously submitted requests.
3. Create a FLUX function that probes a request's yield on the new service.
4. Create a CHAEROS process that retrieves the full content of a request's result.
5. Create a CHAEROS standardization process that transforms that data into something that can be enriched and sent to Zotero.

It is important to keep a consistent naming convention. Please choose a name for your service and hold on to it. In this file, the service is refered to as `ALIEN_SIGHTING_PROJECT`, a fictive data provider that would aggregate notices of extraterrestrial lifeforms sightings. These would come as DOI-marked documents, and be formatted like scientific articles.

### 1. Add the source to the external dns list to which PANDORAE is allowed to connect.

PANDORAE does not connect to random domains. On each app launch, it goes through a list of the domains it expects to be able to retrieve data from, and sends them a request. If the request does reach its target, the FLUX data retrieveal tab will appear. If not, it won't. This helps preventing users from being frustrated by requests that do not seem to yield any result.

To add your service to PANDORAE's dns list, open the `js/main-helpers/network-main.js` file and navigate to the `dnslist` "global" (ie, module-global) object. Add your service as a property:

```js
const dnslist = {
  …
  alien_sighting_project: { name: "ALIEN_SIGHTING_PROJECT", url: "api.alien-sighting.space" },
  …
};
```

### 2. Create a FLUX tab with a form where users can submit requests and ideally consult previously submitted requests.

To create a new FLUX tab, you need to do 2 things:

1. Make this tab part of a cascade category
2. Write the localized FLUX configuration that creates the tab

#### 2.1 Adding a tab to a cascade category

This step is very simple. Open the `js/flux/cascade.js` file, navigate to the `updateCascade()` function. This function has a Hop switch, that is a Javascript switch that correlates categories and tabs. In our case, we would add:

```js
    case "ALIEN_SIGHTING_PROJECT":
        if (
            selections.scientometrics &&
            userData.distantServices.hasOwnProperty("alien_sighting_project")
        ) {
            addHop(["USER", "ALIEN_SIGHTING_PROJECT", "STANDARDIZE"], traces);
        }
        break;
```

As you will read from the code, this makes two checks:

- if the selected category is "scientometrics"
- and if Pandorae managed to reach the distant service (which we designated as `api.alien-sighting.space` above) on app launch

The tab will appear.

#### 2.2 Generating the tab content.

The tab's content is made JavaScript-generated DOM elements. This is all vanilla javascript, and you can have a look at how it is made in the `js/flux/DOMbuilder` folder. However, for the sake of easy configuration and localization, this generation is not up to you but based on a JSON configuration file.

This configuration happens in the `js/locales/EN.js`. This very large JSON object is much more than a locale, it's also a configuration file for many things that happen in PANDORAE.

One of the top-level properties of that object is the `flux` property, which itself has a `tab` property. That is where you are going to add your tab configuration object. See the example below.

```js
const EN = {
    …,
    flux:{
        …,
        tabs:{
            …,
            "alien_sighting_project": {
                    id: "alien_sighting_project", // id of the main div
                    title: "Alien Sighting Project", // title of the tab (displayed on the page)
                    // Property below is the description at the top of the tab
                    description: `The Alien Sighting Project is a very serious scientific endeavour that aims at producing scientific notices for each and every sighting report of extraterrestrial lifeform existence.`,

                    sections: [ // The different sections in the tab
                    {
                        type: "tabDatasets", // Dataset list of requests that have already been submitted and retrieved - don't change this
                        data: {
                        id: "alien_sighting_project", // Name of the data source
                        table: "flux",                // This data will be stored in the flux table
                        source: ["alien_sighting_project"], // The source of the data we want to display is this
                        },
                    },
                    {
                        type: "APIquery", // Request submission form - don't change this
                        data: {
                        target: "alien_sighting_project", // Name of the data source - keep it consistent
                        key: "alien_sighting_project",    // This is only used for services that need advanced config
                        queryField: true,                 // This has a query field
                        placeholder: "roswell",           // Placeholder string for the query field
                        function: {
                            name: "alienSightBasic", // This will redirect to the actual probing function
                            args: {},                            // This has no native arguments
                            aftermath: "timeout",                // You can only send one probe every 2.5 seconds
                        },
                        },
                    },
                    ],
                },
            …
        },
        …
    },
    …
};
```

### 3. Create a FLUX function that probes a request's yield on the new service.

This comes in 5 sub-steps:

1. Create the file that will contain your probe function.
2. Write the probe function.
3. Connect to the FLUX & CHAEROS switches.

When this is done, you will be able to move to the data retrieval on the CHAEROS side.

#### 3.1 Create the file that will contain your probe function.

In our example, we would create a file as `js/flux/sources/scientometrics/alienSighting.js`. As a rule, your file needs to be in the right folder category in the `js/flux/sources/[category]` directory. In our fictive case, this would go in the `scientometrics` folder.

#### 3.2 Write the probe function.

The file you just created contains something like that. You can copy-paste this code block and adapt to your needs.

```js
import {
  basicQueryResultDiv,
  addFullQueryButton,
} from "../../DOMbuilder/flux-DOM-common";

//========== Alien Sighting Probe Retriever ==========
// Send a single request for a single document to the Alien Sighting database in order to retrieve the request's
// metadata and give the user a rough idea of how big (and therefore how many requests) the response represents.
// The user is then offered to proceed with the actual request, which will then be channeled to Chæros.

// Note that the function name is the same as in the locale JSON config
const alienSightBasic = (data) =>
  fetch(`https://api.alien-sighting.space/document/?q=${data.query}&size=1`) // follow the service's requirements
    .then((res) => res.json())
    .then((r) => {
      // get the total number of results
      const numberOfResults = r.total; // This depends on how the metadata is given to you by the API service

      // purge previous results.
      displayInErrorDiv("", "alien_sighting_project");

      // generate the response preview
      basicQueryResultDiv(data, r.total);

      // add a full query button
      addFullQueryButton(
        data,
        "Submit full Alien Sighting API query",
        "alienSightRetriever",
        {
          alienSightQuery: data.query,
        }
      );
    })
    .catch(function (e) {
      basicQueryResultDiv(data, 0, true);
      displayInErrorDiv(e, "alien_sighting_project");
      window.electron.send("console-logs", "Query error : " + e); // Log error
      throw e;
    });

export { alienSightBasic };
```

#### 3.3 Connect to the FLUX & CHAEROS switches

The function you wrote based on what was given to you just above in [3.2] does a few things behind the scenes, but it doesn't do everything.

**[but it should & this needs to be refactored]**
