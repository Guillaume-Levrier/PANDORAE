import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";

import { dataDownload } from "../data-manager-type";

const fieldotype = (id) => {
  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node
  d3.select(xtype).style("overflow", "scroll");
  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([0.2, 15]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    });

  let palette = ["#820206", "#3c5e00", "#00379d"];

  var color = d3.scaleOrdinal(palette);

  pandodb.fieldotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      const data = datajson.content;

      const keywordMap = {};
      var minYear = 9999;
      var maxYear = 0;

      var keyCountMap = { 0: 0 };
      var areaKeyCountMap = { EU: { 0: 0 }, CN: { 0: 0 }, US: { 0: 0 } };

      for (const cat in data) {
        // console.log(cat);
        data[cat].forEach((doc) => {
          let year = doc.Issued["date-parts"][0][0];
          let y = parseInt(year);
          if (y < minYear) minYear = y;
          if (y > maxYear) maxYear = y;

          if (doc.JournalKeywords === null) {
            keyCountMap[0]++;
            areaKeyCountMap[cat][0]++;
          } else {
            let jnum = JSON.stringify(doc.JournalKeywords.length);

            if (keyCountMap.hasOwnProperty(jnum)) {
              keyCountMap[jnum]++;
            } else {
              keyCountMap[jnum] = 1;
            }

            if (areaKeyCountMap[cat].hasOwnProperty(jnum)) {
              areaKeyCountMap[cat][jnum]++;
            } else {
              areaKeyCountMap[cat][jnum] = 1;
            }

            doc.JournalKeywords.forEach((kw) => {
              if (keywordMap.hasOwnProperty(kw["@abbrev"])) {
                if (keywordMap[kw["@abbrev"]].hasOwnProperty(kw["$"])) {
                } else {
                  keywordMap[kw["@abbrev"]][kw["$"]] = {};
                }
              } else {
                keywordMap[kw["@abbrev"]] = {};
                keywordMap[kw["@abbrev"]][kw["$"]] = {};
              }
              if (keywordMap[kw["@abbrev"]][kw["$"]][year]) {
              } else {
                keywordMap[kw["@abbrev"]][kw["$"]][year] = {};
              }

              if (
                keywordMap[kw["@abbrev"]][kw["$"]][year].hasOwnProperty(cat)
              ) {
              } else {
                keywordMap[kw["@abbrev"]][kw["$"]][year][cat] = {
                  num: 0,
                  count: 0,
                };
              }

              keywordMap[kw["@abbrev"]][kw["$"]][year][cat].num++;
              // Adding 1 to all to prevent 0 counts from disappearing
              keywordMap[kw["@abbrev"]][kw["$"]][year][cat].count +=
                doc.Count + 1;
            });
          }
        });
      }
      /*
        console.log(JSON.stringify(keyCountMap));
        console.log(JSON.stringify(areaKeyCountMap));
        console.log(keywordMap);
  */
      var dateDomain = [Date.parse(minYear), Date.parse(maxYear)];

      let dataArea = {};

      const fillEmpty = (cat, i, area, subj) => {
        let itemVal = {
          date: i,
          key: cat + " published",
          value: 0,
        };

        let itemCount = {
          date: i,
          key: cat + " cited",
          value: 0,
        };

        dataArea[area + "-" + subj].push(itemVal);
        dataArea[area + "-" + subj].push(itemCount);
      };

      for (const area in keywordMap) {
        for (const subj in keywordMap[area]) {
          dataArea[area + "-" + subj] = [];
          //for (const year in keywordMap[area][subj]) {
          for (let i = minYear; i <= maxYear; i++) {
            if (keywordMap[area][subj].hasOwnProperty(i)) {
              for (const cat in data) {
                if (keywordMap[area][subj][i].hasOwnProperty(cat)) {
                  let itemVal = {
                    date: i,
                    key: cat + " published",
                    value: keywordMap[area][subj][i][cat].num,
                  };

                  let itemCount = {
                    date: i,
                    key: cat + " cited",
                    value: keywordMap[area][subj][i][cat].count,
                  };

                  dataArea[area + "-" + subj].push(itemVal);
                  dataArea[area + "-" + subj].push(itemCount);
                } else {
                  fillEmpty(cat, i, area, subj);
                }
              }
            } else {
              for (const cat in data) {
                fillEmpty(cat, i, area, subj);
              }
            }
          }
        }
      }

      const graphAmount = Object.getOwnPropertyNames(dataArea).length;
      const graphHeight = 200;
      svg.attr("height", (graphHeight + 100) * graphAmount + 200);

      var graphWidth = 400;

      var x = d3.scaleUtc().domain(dateDomain).range([0, graphWidth]);

      var area = d3
        .area()
        .x((d) => x(d.data[0]))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

      var order = d3.stackOrderNone;

      var graphCount = 0;

      for (const field in dataArea) {
        var keys = Array.from(d3.group(dataArea[field], (d) => d.key).keys());

        var values = Array.from(
          d3.rollup(
            dataArea[field],
            ([d]) => d.value,
            (d) => Date.parse(d.date),
            (d) => d.key
          )
        );

        var series = d3
          .stack()
          .keys(keys)
          .value(([, values], key) => values.get(key))
          .order(order)(values);

        var topScale = d3.max(series, (d) => d3.max(d, (d) => d[1]));

        yMax = 0;
        if (topScale > 20000) {
          yMax = 40000;
        } else if (topScale > 5000) {
          yMax = 20000;
        } else if (topScale > 1000) {
          yMax = 5000;
        } else {
          yMax = 1000;
        }

        var y = d3
          .scaleLinear()
          .domain([0, yMax])
          .nice()
          .range([graphHeight, 0]);

        var xAxis = (g) =>
          g.attr("transform", `translate(0,${graphHeight})`).call(
            d3
              .axisBottom(x)
              .ticks(width / 80)
              .tickSizeOuter(0)
          );

        var yAxis = (g) =>
          g
            // .attr("transform", `translate(${width - 50},0)`)
            .call(d3.axisRight(y).tickSize(graphWidth + 20))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
              g
                .selectAll(".tick:not(:first-of-type) line")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-dasharray", "2,2")
            )
            .call((g) =>
              g
                .select(".tick:last-of-type text")
                .clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y)
            );

        var graph = view.append("g").attr("id", field);

        graph
          .append("text")
          .attr("x", 0)
          .attr("y", -14)
          .style("font-family", "sans-serif")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .text(field.toLocaleUpperCase());

        graph
          .append("g")
          .selectAll("path")
          .data(series)
          .join("path")
          //.attr("fill", ({ key }) => color(key))
          .attr("fill", ({ key }) => {
            switch (key.substring(0, 2)) {
              case "EU":
                return "#00379d";
                break;

              case "US":
                return "#3c5e00";
                break;

              case "CN":
                return "#820206";
                break;

              default:
                return color(d.cat);
                break;
            }
          })
          .attr("opacity", ({ key }) =>
            key.substring(3, 8) === "cited" ? 0.5 : 1
          )
          .attr("d", area)
          .append("title")
          .text(({ key }) => key);

        graph.append("g").call(xAxis);

        graph.append("g").call(yAxis);

        graph.attr(
          "transform",
          "translate(0," + graphCount * (graphHeight + 100) + ")"
        );

        graphCount++;
      }

      view.attr("transform", "translate(100,100)");

      loadType();
      document.getElementById("tooltip").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Fieldotype error: dataset " + id + " is invalid."
      );
    });

  zoomed = (thatZoom, transTime) => {
    console.log("zooming");
    view.attr("transform", thatZoom);
  };

  window.electron.send("console-logs", "Starting fieldotype");
};

export { fieldotype };
