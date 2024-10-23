import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";

import { dataDownload } from "../data-manager-type";

var whois;

// =========== WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.

// If the SharedWorker doesn't exist yet
/* 
var multiThreader = new Worker("mul[type]threader.js"); // Create a SharedWorker named multiThreader based on that file

multiThreader.postMessage({
  type: "checkup",
  validation: "MULTITHREADING ENABLED",
});

multiThreader.onmessage = (res) => {
  // If multiThreader sends a message
  if (res.data.type === "notification") {
    // And the type property of this message is "notification"
    window.electron.send(res.data.dest, res.data.msg); // Send the notification to the main process for dispatch
  }
};

multiThreader.onerror = (err) => {
  // If the multiThreader reports an error
  window.electron.send("audio-channel", "error");

  window.electron.send("console-logs", "ERROR - MULTITHREADING DISABLED"); // Send an error message to the console
  window.electron.send("console-logs", JSON.stringify(err)); // Send the actual error content to the console
}; */

// ========= HYPHOTYPE =========
const hyphe = (datajson) => {
  console.log(datajson);
  //  SVG VIEW
  var svg = d3
    .select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG")
    .style("cursor", "move"); // Creating the SVG DOM node

  svg.style("background-color", "#e6f3ff");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view");

  //zoom extent

  const zoom = d3.zoom().on("zoom", zoomed);

  zoom
    .scaleExtent([0.2, 20]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-width * 2, -height * 2],
      [width * 3, height * 3],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    }); // Trigger the "zoomed" function on "zoom" behaviour

  var color = d3
    .scaleOrdinal()
    .domain([0, 1])
    .range([
      "#1d302a",
      "#d971db",
      "#76b940",
      "#4a238b",
      "#4abe73",
      "#965bd3",
      "#c2ae3b",
      "#5a6bd7",
      "#cf7f2f",
      "#5e8adb",
      "#d24a34",
      "#59beaf",
      "#dc4492",
      "#55812f",
      "#9f3094",
      "#85b789",
      "#342564",
      "#aaaa6c",
      "#86519a",
      "#816e2a",
      "#ba93d4",
      "#364e25",
      "#c53a5c",
      "#43815e",
      "#d574a8",
      "#5cafce",
      "#863a23",
      "#97a0c4",
      "#4a2023",
      "#d1976f",
      "#381d3d",
      "#aca393",
      "#802c58",
      "#4e7a7c",
      "#d6756d",
      "#576095",
      "#604b30",
      "#d699ac",
      "#3c4b63",
      "#8c5f6b",
    ]);

  var colorFill = d3
    .scaleLog() // Color is determined on a log scale
    .domain(d3.extent(d3.range(1, 11))) // Domain ranges from 1 to 15
    .interpolate((d) => d3.interpolateOranges); // Interpolate is the color spectrum

  var x = d3
    .scaleLinear() // x is a linear scale
    .domain([-width, width]) // Domain means value range on the graph onload
    .range([0, width - toolWidth]); // Range is pixel display size

  var y = d3
    .scaleLinear() // y is a linear scale
    .domain([height, -height]) // Domain is negative to allow contour display
    .range([0, height]); // Range is total height

  var xAxis = d3.axisBottom(x); // xAxis is the abscissa axis
  var xAxis2 = xAxis; // xAxis2 is its white contour for lisiblity
  var yAxis = d3.axisRight(y); // yAxis is the yordinate axis
  var yAxis2 = yAxis; // yAxis white contour for lisiblit
  var xGrid = d3.axisBottom(x).tickSize(height); // xGrid is actually axis ticks without axis
  var yGrid = d3.axisRight(y).tickSize(width); // Same but for horizontal ticks

  //======== DATA CALL & SORT =========

  var tooltipTop = "<strong>" + datajson.name.toUpperCase() + "</strong></br>";

  dataDownload(datajson);

  var links = [];

  if (datajson.hasOwnProperty("presentationStep")) {
    presentationStep = datajson.narrative;
  }

  console.log(datajson);

  let corpusStatus = datajson.data.corpusStatus;

  let weStatus = datajson.data.weStatus;

  let nodeData = datajson.data.nodeData;

  let networkLinks = datajson.data.networkLinks;

  let tags = datajson.data.tags;

  for (var subTag in tags) {
    let taggedNodes = 0;

    for (let tagVal in tags[subTag]) {
      taggedNodes = taggedNodes + tags[subTag][tagVal];
    }
    tags[subTag].NA = parseInt(nodeData.length - taggedNodes);
  }

  var tagDiv = "";

  for (var prop in tags) {
    tagDiv = tagDiv + '<option value="' + prop + '">' + prop + "</option>";
  }
  tagDiv = tagDiv + "</select>";

  for (let j = 0; j < nodeData.length; j++) {
    for (let i = 0; i < networkLinks.length; i++) {
      let link = {};
      if (nodeData[j].id === networkLinks[i][0]) {
        for (let f = 0; f < nodeData.length; f++) {
          if (nodeData[f].id === networkLinks[i][1]) {
            link.source = networkLinks[i][0];
            link.target = networkLinks[i][1];
            link.weight = networkLinks[i][2];
            links.push(link);
          }
        }
      }
    }
  }

  weStatus = weStatus[weStatus.length - 1];

  tooltipTop =
    tooltipTop +
    "<br> Corpus ID: " +
    corpusStatus.corpus_id +
    "<br> Corpus status: " +
    corpusStatus.status +
    "<li> Total: " +
    weStatus.total +
    "</li>" +
    "<li> Discovered: " +
    weStatus.discovered +
    "</li>" +
    "<li> Undecided: " +
    weStatus.undecided +
    "</li>" +
    "<li> Out: " +
    weStatus.out +
    "</li>" +
    "<li> In: " +
    weStatus.in +
    "</li>" +
    "</ul><br>Filtrer par tags<br><select id='tagDiv'>" +
    tagDiv +
    "<br><div id='tagList'></div>" +
    "<br><br><div id='weDetail'></div><br><br><br><div id='whois'></div><br><br><br><br><br>";

  /* multiThreader.postMessage({
    type: "hy",
    nodeData: nodeData,
    links: links,
    tags: tags,
    width: width,
    height: height,
  });

  multiThreader.onmessage = (hyWorkerAnswer) => { */

  console.log("got there1");

  nodeData.forEach((node) => {
    for (let tag in tags) {
      if (node.tags.hasOwnProperty("USER")) {
      } else {
        node.tags.USER = {};
      }

      if (node.tags.USER.hasOwnProperty(tag)) {
      } else {
        node.tags.USER[tag] = ["NA"];
      }
    }
  });

  var simulation = d3
    .forceSimulation(nodeData) // Start the force graph
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(0)
        .strength(1)
    )
    .force("charge", d3.forceManyBody().strength(-600))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .stop();

  for (
    var i = 0,
      n = Math.ceil(
        Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())
      );
    i <= n;
    ++i
  ) {
    simulation.tick();
    let prog = (i / n) * 100;
    postMessage({ type: "tick", prog: prog });
  }

  var contours = d3
    .contourDensity()
    .size([width, height])
    .weight((d) => d.indegree)
    .x((d) => d.x)
    .y((d) => d.y)
    .bandwidth(9)
    .thresholds(d3.max(nodeData, (d) => d.indegree))(nodeData);

  //  nodeData = hyWorkerAnswer.data.nodeData;
  //      links = hyWorkerAnswer.data.links;
  //     contours = hyWorkerAnswer.data.contours;

  var densityContour = view
    .insert("g") // Create contour density graph
    .attr("fill", "none") // Start by making it empty/transparent
    .attr("class", "contours")
    .attr("stroke", "GoldenRod") // Separation lines color
    .attr("stroke-width", 0.5) // Line thickness
    .attr("stroke-linejoin", "round") // Join style
    .selectAll("path")
    .data(contours)
    .enter()
    .append("path")
    .attr("stroke-width", 0.5)
    .attr("fill", (d) => colorFill(d.value * 100))
    .attr("d", d3.geoPath());

  const drawAltitudeLevel = (selectedData) => {
    var thresholds = [];

    selectedData.forEach((thisContour) =>
      thresholds.push(parseInt(thisContour.value * 10000))
    );

    function addlabel(text, xy, angle) {
      angle += Math.cos(angle) < 0 ? Math.PI : 0;

      labels_g
        .append("text")
        .attr("fill", "#fff")
        .attr("stroke", "none")
        .attr("class", "labels")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr(
          "transform",
          `translate(${xy})rotate(${parseInt(angle * (180 / Math.PI))})`
        )
        .style("font-weight", "bolder")
        .text(text)
        .style("font-size", ".5px");
    }

    var labels_g = view.append("g").attr("id", "labels_g");

    for (const cont of selectedData) {
      cont.coordinates.forEach((polygon) =>
        polygon.forEach((ring, j) => {
          const p = ring.slice(1, Infinity),
            possibilities = d3.range(
              cont.coordinates.length,
              cont.coordinates.length * 5
            ),
            scores = possibilities.map((d) => -((p.length - 1) % d)),
            n = possibilities[d3.leastIndex(scores)],
            start =
              1 +
              (d3.leastIndex(p.map((xy) => (j === 0 ? -1 : 1) * xy[1])) % n),
            margin = 2;

          p.forEach((xy, i) => {
            if (
              i % n === start &&
              xy[0] > margin &&
              xy[0] < width - margin &&
              xy[1] > margin &&
              xy[1] < height - margin
            ) {
              const a = (i - 2 + p.length) % p.length,
                b = (i + 2) % p.length,
                dx = p[b][0] - p[a][0],
                dy = p[b][1] - p[a][1];
              if (dx === 0 && dy === 0) return;

              addlabel(parseInt(cont.value * 10000), xy, Math.atan2(dy, dx));
            }
          });
        })
      );
    }
  };

  console.log("got there2");

  drawAltitudeLevel(contours);

  var nodes = view
    .insert("g")
    .selectAll("circle")
    .data(nodeData)
    .enter()
    .append("circle")
    .style("fill", (d) => color(d.tags.USER))
    .attr("stroke", "black")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .style("cursor", "pointer")
    .attr("stroke-width", 0.2)
    .attr("r", (d) => 1 + Math.log(d.indegree + 1))
    .attr("id", (d) => d.id)
    .on("click", (event, d) => {
      var weDetail = "<h3>WE Detail</h3>";

      for (var prop in d) {
        weDetail = weDetail + "<br><strong>" + prop + "</strong>: " + d[prop];
      }

      document.getElementById("weDetail").innerHTML = weDetail;
      document.getElementById("whois").innerHTML = "";

      (async function () {
        var whoisDetails = await whois(d.name);

        var whoisResult = "<h3>Whois result</h3>";
        for (var prop in whoisDetails) {
          whoisResult =
            whoisResult +
            "<br><strong>" +
            prop +
            "</strong>: " +
            whoisDetails[prop];
        }

        document.getElementById("whois").innerHTML = whoisResult;
      })();
    });

  const addWeTitle = () => {
    var webEntName = view
      .selectAll(".webEntName")
      .data(nodeData)
      .enter()
      .append("text")
      .attr("class", "webEntName")
      .attr("id", (d) => d.name)
      .style("font-size", "2px")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", -0.5)
      .style("font-family", "sans-serif")
      .text((d) => d.name);

    document
      .querySelectorAll(".webEntName")
      .forEach((d) => (d.__data__.dx = -d.getBBox().width / 2));
    webEntName.attr("dx", (d) => d.dx);

    nodeData.forEach(
      (d) => (d.box = document.getElementById(d.name).getBBox())
    );

    var webEntNameRect = view
      .selectAll("rect")
      .data(nodeData)
      .enter()
      .append("rect")
      .attr("class", "contrastRect")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 0.1)
      .attr("x", (d) => d.box.x)
      .attr("y", (d) => d.box.y)
      .attr("width", (d) => d.box.width + 1)
      .attr("height", (d) => d.box.height + 0.2);

    nodes.raise();
    webEntName.raise();
  };

  addWeTitle();

  const resetContourGraph = () => {
    d3.selectAll(".contours").remove();
    d3.select("#labels_g").remove();

    view
      .insert("g") // Create contour density graph
      .attr("fill", "none") // Start by making it empty/transparent
      .attr("class", "contours")
      .attr("stroke", "GoldenRod") // Separation lines color
      .attr("stroke-width", 0.5) // Line thickness
      .attr("stroke-linejoin", "round") // Join style
      .selectAll("path")
      .data(contours)
      .enter()
      .append("path")
      .attr("stroke-width", 0.5)
      .attr("fill", (d) => colorFill(d.value * 100))
      .attr("d", d3.geoPath());

    console.log("got there3");
    drawAltitudeLevel(contours);

    d3.selectAll(".contours").lower();
    d3.selectAll("circle").attr("opacity", "1");
    d3.selectAll(".contrastRect").attr("opacity", "1");
    d3.selectAll(".webEntName").attr("opacity", "1");
    d3.selectAll(".labels").attr("opacity", "1");
  };

  const displayContour = () => {
    let checkTags = document.querySelectorAll("input.tagCheckbox");

    let cat = document.getElementById("tagDiv").value;

    let tags = [];

    checkTags.forEach((box) => {
      if (box.checked) {
        tags.push(box.value);
      }
    });

    d3.selectAll(".contours").remove();

    view
      .insert("g") // Create contour density graph
      .attr("fill", "none") // Start by making it empty/transparent
      .attr("class", "contours")
      .attr("id", "oldContour")
      .attr("stroke", "GoldenRod") // Separation lines color
      .attr("stroke-width", 0.5) // Line thickness
      .attr("stroke-linejoin", "round") // Join style
      .attr("opacity", 0.25)
      .selectAll("path")
      .data(contours)
      .enter()
      .append("path")
      .attr("stroke-width", 0.5)
      .attr("fill", (d) => colorFill(d.value * 100))
      .attr("d", d3.geoPath());
    d3.selectAll(".contours").lower();

    var tagNodes = [];

    tags.forEach((tag) => {
      let thisTagNodes = nodeData.filter(
        (item) => item.tags.USER[cat][0] === tag
      );
      thisTagNodes.forEach((node) => tagNodes.push(node));
    });

    var thisContour = d3
      .contourDensity()
      .size([width, height])
      .weight((d) => d.indegree)
      .x((d) => d.x)
      .y((d) => d.y)
      .bandwidth(9)
      .thresholds(d3.max(tagNodes, (d) => d.indegree))(tagNodes);

    d3.select("#labels_g").remove();

    var thisContourPath = view
      .insert("g") // Create contour density graph
      .attr("fill", "none") // Start by making it empty/transparent
      .attr("class", "contours")
      .attr("stroke", "GoldenRod") // Separation lines color
      .attr("stroke-width", 0.5) // Line thickness
      .attr("stroke-linejoin", "round") // Join style
      .selectAll("path")
      .data(thisContour)
      .enter()
      .append("path")
      .attr("stroke-width", 0.5)
      .attr("fill", (d) => colorFill(d.value * 100))
      .attr("d", d3.geoPath());

    drawAltitudeLevel(thisContour);

    d3.selectAll(".contours").lower();
    d3.select("#oldContour").lower();
    d3.selectAll("circle").attr("opacity", ".1");
    d3.selectAll(".contrastRect").attr("opacity", ".1");
    d3.selectAll(".webEntName").attr("opacity", ".1");
    tags.forEach((tag) => {
      d3.selectAll("circle")
        .filter((item) => item.tags.USER[cat][0] === tag)
        .attr("opacity", "1");
      d3.selectAll(".contrastRect")
        .filter((item) => item.tags.USER[cat][0] === tag)
        .attr("opacity", "1");
      d3.selectAll(".webEntName")
        .filter((item) => item.tags.USER[cat][0] === tag)
        .attr("opacity", "1");
    });

    d3.select("#legend").remove();

    var legend = svg.insert("g").attr("id", "legend");

    var shownTags = "";

    for (let i = 0; i < tags.length; i++) {
      shownTags = shownTags + tags[i] + " ";
    }

    var legendText = legend.append("text").text(cat + " - " + shownTags);

    let textBound = document.querySelector("#legend").getBBox();

    legend
      .append("rect")
      .attr("id", "legend")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("x", width - toolWidth - parseInt(textBound.width) - 20)
      .attr("y", height - 30)
      .attr("width", parseInt(textBound.width) + 20)
      .attr("height", 30);

    legendText
      .attr("x", width - toolWidth - parseInt(textBound.width) - 15)
      .attr("y", height - 30)
      .attr("dx", 5)
      .attr("dy", 20);

    legendText.raise();
  };

  console.log("got there3");

  const showTags = (tag, list) => {
    let tagList = document.getElementById(list);
    tagList.innerHTML = "";
    let thisTagList = document.createElement("DIV");
    let tagsArray = [];

    for (var prop in tags) {
      if (prop === tag) {
        for (let thisTag in tags[prop]) {
          // let criteria = prop;
          var thisTagCheckbox = document.createElement("INPUT");
          thisTagCheckbox.type = "checkbox";
          thisTagCheckbox.className = "tagCheckbox";
          //thisTagCheckbox.id = "chck"+thisTag;
          thisTagCheckbox.value = thisTag;
          thisTagCheckbox.addEventListener("change", (e) => {
            displayContour();
          });

          var thisTagOption = document.createElement("SPAN");
          thisTagOption.innerText = thisTag + ":" + tags[prop][thisTag];
          thisTagOption.style.color = color(thisTag);

          var thisTagLine = document.createElement("DIV");
          thisTagLine.value = parseInt(tags[prop][thisTag]);
          thisTagLine.appendChild(thisTagCheckbox);
          thisTagLine.appendChild(thisTagOption);

          tagsArray.push(thisTagLine);
        }
      }
    }

    tagsArray.sort((a, b) => d3.descending(a.value, b.value));
    tagsArray.forEach((d) => thisTagList.appendChild(d));
    tagList.appendChild(thisTagList);
    nodes.style("fill", (d) => color(d.tags.USER[tag][0]));
    nodes.raise();
  };

  setTimeout(() => {
    document.getElementById("tagDiv").addEventListener("change", (e) => {
      resetContourGraph();
      console.log("got there4");
      showTags(document.getElementById("tagDiv").value, "tagList");
      console.log("got there5");
    });
  }, 200);

  loadType();
  document.getElementById("tooltip").innerHTML = tooltipTop;
  //    }
  //}; // end of HY worker answer

  //    })  // end of get webentities data

  //  }) // end of start corpus

  //======== ZOOM & RESCALE ===========

  var gXGrid = svg.append("g").call(xGrid);

  var gYGrid = svg.append("g").call(yGrid);

  let upHeight = parseInt(height - 50);

  var gX2 = svg
    .append("g")
    .attr("transform", "translate(0," + upHeight + ")")
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .call(xAxis2);

  var gY2 = svg
    .append("g")
    .attr("transform", "translate(" + 50 + ",0)")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .call(yAxis2);

  var gX = svg
    .append("g")
    .attr("transform", "translate(0," + upHeight + ")")
    .call(xAxis);

  var gY = svg
    .append("g")
    .attr("transform", "translate(" + 50 + ",0)")
    .call(yAxis);

  d3.selectAll(".tick:not(:first-of-type) line").attr(
    "stroke",
    "rgba(100,100,100,.5)"
  );

  svg.call(zoom).on("dblclick.zoom", null);

  // ===== NARRATIVE =====

  zoomed = (thatZoom, transTime) => {
    //currentZoom = thatZoom;
    view.transition().duration(transTime).attr("transform", thatZoom);
    gXGrid
      .transition()
      .duration(transTime)
      .call(xGrid.scale(thatZoom.rescaleX(x)));
    gYGrid
      .transition()
      .duration(transTime)
      .call(yGrid.scale(thatZoom.rescaleY(y)));
    gX2
      .transition()
      .duration(transTime)
      .call(xAxis2.scale(thatZoom.rescaleX(x)));
    gY2
      .transition()
      .duration(transTime)
      .call(yAxis2.scale(thatZoom.rescaleY(y)));
    gX.transition()
      .duration(transTime)
      .call(xAxis.scale(thatZoom.rescaleX(x)));
    gY.transition()
      .duration(transTime)
      .call(yAxis.scale(thatZoom.rescaleY(y)));
    d3.transition()
      .duration(transTime)
      .selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "rgba(100,100,100,.5)");
  };

  // Presentation Recorder

  function zoomed({ transform }) {
    view.attr("transform", transform);
  }

  window.electron.send("console-logs", "Starting Hyphotype");
};

export { hyphe };
