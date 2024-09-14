//===== Solr BNF ======

// These are helpers to visualize the first results from the test request.
// Turn a solr faect field into an actual array of objects
const parseSolrFacetFields = (arr) => {
  // This is an array, odd is key, even is value
  // key would have to be asserted as string
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push({ key: arr[i], value: arr[i + 1] });
  }
  return result;
};

// convert the crawl_year facet into actual JS dates
const crawlYearData = (data) => {
  var dates = [];

  data.forEach((d) => {
    const date = new Date();
    const year = parseInt(d.key);
    date.setFullYear(year);
    dates.push({ key: date, value: d.value });
  });
  dates = dates.sort((a, b) => a.key - b.key);
  return dates;
};

const generateSolrExplorationChart = (data, type) => {
  // two possible types:
  //- distribution by crawl years
  //- distribution by collection

  if (type === "crawl_year") {
    data = crawlYearData(data);
  }

  const width = 650;
  const height = 150;
  const marginTop = 30;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = d3
    .scaleBand()
    .domain(
      d3.groupSort(
        data,
        (d) => d.value,
        (d) => d.key
      )
    ) // descending frequency
    .range([marginLeft, width - marginRight])
    .padding(0.1);

  // Declare the y (vertical position) scale.
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height - marginBottom, marginTop]);

  // Create the SVG container.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add a rect for each bar.
  svg
    .append("g")
    .attr("fill", "black")
    .selectAll()
    .data(data)
    .join("rect")
    .attr("x", (d) => x(d.key))
    .attr("y", (d) => y(d.value))
    .attr("height", (d) => y(0) - y(d.value))
    .attr("width", x.bandwidth());

  // Add the x-axis and label.

  var xAxis = d3.axisBottom(x).tickSizeOuter(0);

  if (type === "crawl_year") {
    xAxis = d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y"));
  }

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  // Add the y-axis and label, and remove the domain line.
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .text("↑ Snapshots")
    );

  // Return the SVG element.
  return svg.node();
};

// This is the actual request
var solrbnfcount = {};

const queryBnFSolr = (but) => {
  const previewer = document.getElementById(
    "bnf-solr-basic-previewer-" + but.serv
  );

  previewer.innerHTML = `<br><p> Loading...</p> `;

  const queryContent = document.getElementById(
    `bnf-solr-query-${but.serv}`
  ).value;

  const dateFrom = document.getElementById(
    `bnf-solr-${but.serv}-date-from`
  ).value;

  const dateTo = document.getElementById(`bnf-solr-${but.serv}-date-to`).value;

  const collections = document.getElementsByClassName(
    `bnf-solr-radio-${but.serv}`
  );

  const facets = document.getElementsByClassName(
    `bnf-solr-checkbox-${but.serv}`
  );

  let targetfacets = "";

  for (let i = 0; i < facets.length; i++) {
    const facet = facets[i];

    if (facet.checked) {
      if (targetfacets.length > 0) {
        targetfacets += "%20OR%20";
      }
      console.log(facet.id);

      // solr needs a " for two words or more, and no " if not;

      if (facet.id.split(" ").length > 1) {
        targetfacets += `"${facet.id}"`;
      } else {
        targetfacets += facet.id;
      }
    }
  }

  solrbnfcount.targetCollections = targetfacets;

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
        "/select?facet.field=crawl_year&facet=on" +
        "&fq=collections:(" +
        targetfacets +
        ")&fq=crawl_date:[" +
        dateFrom +
        "T00:00:00Z" +
        "%20TO%20" +
        dateTo +
        "T00:00:00Z]&" +
        "q=" +
        queryContent +
        "&rows=0&sort=crawl_date%20desc&group=true&group.field=url" +
        "&group.limit=1&group.sort=score+desc%2Ccrawl_date+desc&start=0" +
        "&rows=0&sort=score+desc&group.ngroups=true&facet.field=collections" +
        "&facet.field=domain&facet.limit=10";

      // logging the request
      window.electron.send("console-logs", `Sending request: ${query}`);
    }
  }

  // This is an arbitrary document limit hardcoded for alpha/beta testing
  // purposes. Ideally, this limit should be echoed by the host system, not
  // hardcoded in PANDORAE.

  const document_limit = 50000;

  d3.json(query)
    .then((r) => {
      let numFound = r.grouped.url.ngroups;

      let byCollection = r.facet_counts.facet_fields;

      solrbnfcount[queryContent] = {
        count: numFound,
        but,
        selectedCollection,
        countByCollection: parseSolrFacetFields(byCollection.collections),
      };

      previewer.innerHTML = `<br><p>  ${numFound} unique documents found</p> `;

      if (numFound > 0 && numFound < document_limit) {
        document.getElementById(
          "bnf-solr-fullquery-" + but.serv
        ).style.display = "flex";

        const yearChart = generateSolrExplorationChart(
          parseSolrFacetFields(byCollection.crawl_year),
          "crawl_year"
        );
        const collectionChart = generateSolrExplorationChart(
          parseSolrFacetFields(byCollection.collections)
        );

        const domainList = parseSolrFacetFields(byCollection.domain);

        const domainDiv = document.createElement("div");

        domainDiv.innerHTML =
          "<strong>Captures found for the top 10 domains:</strong><br>";

        domainList.forEach((dom) => {
          domainDiv.innerHTML += `${dom.key} - ${dom.value}</br>`;
        });

        previewer.append(yearChart, collectionChart, domainDiv);
      } else if (numFound >= document_limit) {
        previewer.innerHTML = `You cannot request more than ${document_limit} documents.`;
      }
    })
    .catch((e) => {
      console.log(e);
      window.electron.send("console-logs", `Solr error: ${JSON.stringify(e)}`);
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
