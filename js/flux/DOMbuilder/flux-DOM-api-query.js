import { fluxSwitch } from "../buttons";
import { fluxButtonClicked } from "../actionbuttons";
import { genHr } from "./flux-DOM-common";
import { availability } from "../cascade";

const addLocalFileSection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Load a local flat dataset to ${tabData.title}</h4>
    Click on the button below to load a file from your computer to the PANDORAE ${tabData.title} database. It accepts ${sectionData.accept} files.`;
  sectionDescription.style.paddingBottom = "1rem";
  const loadFlatFileInput = document.createElement("input");
  loadFlatFileInput.type = "file";
  loadFlatFileInput.className = "fluxInput";
  loadFlatFileInput.accept = sectionData.accept;

  const loadFlatFileButton = document.createElement("button");
  loadFlatFileButton.type = "submit";
  loadFlatFileButton.className = "flux-button";
  loadFlatFileButton.innerText = `Upload local dataset to ${tabData.title}`;

  tabSection.append(sectionDescription, loadFlatFileInput, loadFlatFileButton);

  tab.append(genHr(), tabSection);
};

const addAPIquerySection = (tabData, sectionData, tab) => {
  const tabSection = document.createElement("div");
  tabSection.className = "tabSection";

  const queryPrompt = sectionData.queryField
    ? "Fill in the query in the field below."
    : "";

  const sectionDescription = document.createElement("div");
  sectionDescription.innerHTML = `<h4>Retrieve datasets from ${sectionData.target.toUpperCase()}</h4>
    ${queryPrompt} Click on the button to submit the request.`;
  sectionDescription.style.paddingBottom = "1rem";

  tabSection.append(sectionDescription);

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    helper.style.marginBottom = "1rem";
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    tabSection.append(helper);
  }

  // button to click to load the relevant datasets
  const sendAPIQueryButton = document.createElement("button");
  sendAPIQueryButton.type = "submit";
  sendAPIQueryButton.className = "flux-button";
  sendAPIQueryButton.innerText =
    "Load data from " + sectionData.target.toUpperCase();

  const queryResultDiv = document.createElement("div");
  queryResultDiv.className = "fluxQueryResult";
  queryResultDiv.style.display = "none";

  const functionArgs = sectionData.function.args;
  functionArgs.resultDiv = queryResultDiv;

  const queryField = document.createElement("input");

  sendAPIQueryButton.addEventListener("click", () => {
    fluxButtonClicked(sendAPIQueryButton, sectionData.function.aftermath);
    if (sectionData.queryField) {
      sectionData.function.args.query = queryField.value;
    }
    fluxSwitch(sectionData.function.name, sectionData.function.args);
  });

  if (sectionData.queryField) {
    queryField.type = "text";
    queryField.className = "fluxInput";
    tabSection.append(queryField);

    if (sectionData.hasOwnProperty("placeholder")) {
      queryField.placeholder = sectionData.placeholder;
    }
  }

  tabSection.append(sendAPIQueryButton);

  const functionArguments = Object.values(sectionData.function.args);

  if (functionArguments.length > 0) {
    buildAdditionalArguments(sectionData, tabSection);
  }

  tabSection.append(queryResultDiv);

  tab.append(genHr(), tabSection);
};

const buildAdditionalArguments = (data, sectionDiv) => {
  switch (data.key) {
    case "bnf-solr":
      buildBnFsolrArguments(data, sectionDiv);

      break;

    default:
      break;
  }
};

const buildBnFsolrArguments = (data, sectionDiv) => {
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "fluxRequestOptionDiv";

  sectionDiv.append(optionsDiv);

  for (const key in availability.dnsLocalServiceList) {
    const service = availability.dnsLocalServiceList[key];

    if (service.type === "BNF-SOLR") {
      const solrCont = document.createElement("div");

      solrCont.id = "BNF-SOLR";
      solrCont.style.display = "none";
      solrCont.className = "fluxTabs";

      const sourceRequest = `http://${service.url}/solr/admin/collections?action=LIST&wt=json`;

      // The answer is in the array at r.collections

      var sourceSolrRadio = "";

      var coreSource; // In theory, there is only one core collection

      fetch(sourceRequest)
        .then((r) => r.json())
        .then((r) => {
          console.log(r);

          optionsDiv.innerHTML += "Available sources<br>";
          coreSource = r.collections[0];
          for (let i = 0; i < r.collections.length; i++) {
            const col = r.collections[i];
            let checked = i === 0 ? "checked" : "";

            const collectionContainer = document.createElement("div");

            const collectionRadio = document.createElement("input");
            collectionRadio.type = "radio";
            collectionRadio.name = `bnf-solr-radio-${key}`;
            collectionRadio.id = col;
            collectionRadio.checked = checked;

            const collectionLabel = document.createElement("label");
            collectionLabel.for = col;
            collectionLabel.innerText = col;

            collectionContainer.append(collectionRadio, collectionLabel);

            optionsDiv.append(collectionContainer);
          }
          optionsDiv.append(genHr());
        })
        .then(() =>
          fetch(
            `http://${service.url}/solr/${coreSource}/select?q=*rows=0&facet=on&facet.field=collections`
          )
            .then((facet) => facet.json())
            .then((facets) => {
              console.log(facets);
              console.log(key);

              optionsDiv.innerHTML += "Available collections<br>";

              const facetList = facets.facet_counts.facet_fields.collections;

              var facetCheckBox = "";

              const facetBox = document.createElement("div");

              optionsDiv.append(facetBox);

              for (let i = 0; i < facetList.length; i++) {
                const face = facetList[i];

                if (typeof face === "string") {
                  let checked = i === 0 ? "checked" : "";

                  const facetContainer = document.createElement("div");

                  const facetCheckBox = document.createElement("input");
                  facetCheckBox.type = "checkbox";
                  facetCheckBox.name = `bnf-solr-radio-${key}`;
                  facetCheckBox.id = face;
                  facetCheckBox.checked = checked;

                  const facetLabel = document.createElement("label");
                  facetLabel.for = face;
                  facetLabel.innerText = face;

                  facetContainer.append(facetCheckBox, facetLabel);

                  facetBox.append(facetContainer);
                }
              }
              /*
                    solrCont.innerHTML = `<!-- BNF SOLR TAB -->     
          <span class="flux-title">${service.toUpperCase()}</span>
          <br><br>
          <form id="bnf-solr-form" autocomplete="off">Query:<br>
            <input class="fluxInput" spellcheck="false" id="bnf-solr-query-${key}" type="text" value=""><br><br>
            From: <input type="date" id="bnf-solr-${key}-date-from"> - To: <input type="date" id="bnf-solr-${key}-date-to"><br>
            <br>Selected source:
            ${sourceSolrRadio}<br><br>
             <br>Select collection:
            ${facetCheckBox}<br><br>
            <button type="submit" class="flux-button" id="bnf-solr-basic-query-${key}">Retrieve
              basic info</button>&nbsp;&nbsp;
            <div id="bnf-solr-basic-previewer-${key}" style="position:relative;"></div><br><br>
            <button style="display: none;" type="submit" class="flux-button" id="bnf-solr-fullquery-${key}">Submit Full Query</button>
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
                          fluxSwitch(e, but);

                          return false;
                        });
                    });



                    */
            })
        );
    }
  }
};

export { addLocalFileSection, addAPIquerySection };
