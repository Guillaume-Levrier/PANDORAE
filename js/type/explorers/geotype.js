import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";
import { pandodb } from "../../db";
import { dataDownload } from "../data-manager-type";

// =========== GEOTYPE =========
const geotype = (id) => {
  // ========== SVG VIEW ==========
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view")
    .attr("id", "view"); // CSS viewfinder properties

  //globe properties and beginning aspect
  const projection = d3
    .geoOrthographic()
    .scale(800)
    .translate([width - toolWidth * 2, height / 2])
    .clipAngle(90)
    .precision(0.01)
    .rotate([-20, -40, 0]);

  const loftedProjection = d3
    .geoOrthographic()
    .scale(850)
    .translate([width - toolWidth * 2, height / 2])
    .clipAngle(90)
    .precision(0.01)
    .rotate([-20, -40, 0]);

  //globe, as well as surface projects
  var path = d3.geoPath().projection(projection);

  //graticule
  const graticule = d3.geoGraticule();

  var velocity = 0.02;

  zoom
    .scaleExtent([0, 50])
    .translateExtent([
      [0, 0],
      [1200, 900],
    ])
    .extent([
      [0, 0],
      [1200, 900],
    ])
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  //globe outline and background
  view
    .append("circle")
    .style("fill", "#e6f3ff")
    .style("stroke", "#333")
    .style("stroke-width", 1)
    .attr("cx", width - toolWidth * 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());

  // ===== FLYING ARCS
  var swoosh = d3
    .line()
    .curve(d3.curveNatural)
    .defined((d) => projection.invert(d));

  const flyingArc = (link) => {
    // start with multiline links

    var globeCenter = projection.invert([
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
    ]);

    if (typeof link.coordinates[0][0] === "object") {
      var returnPath = [];
      link.coordinates.forEach((subLink) => {
        let source = subLink[0];
        let target = subLink[1];
        let middle = d3.geoInterpolate(source, target)(0.5);
        returnPath.push(
          projection(source),
          loftedProjection(middle),
          projection(target)
        );
      });

      return returnPath;
    } else {
      let source = link.coordinates[0];
      let target = link.coordinates[1];
      let middle = d3.geoInterpolate(source, target)(0.5);

      return [projection(source), loftedProjection(middle), projection(target)];
    }
  };

  //versor insertion signal for interactive exports

  //Calling data
  pandodb.geotype
    .get(id)
    .then((datajson) => {
      regenPrevSteps(datajson);
      dataDownload(datajson);

      var data = [];

      for (let i = 0; i < datajson.content.length; i++) {
        datajson.content[i].items.forEach((d) => data.push(d));
      }

      var collabDir = {};
      // Affiliation collaboration compute
      data.forEach((art) => {
        if (art.hasOwnProperty("enrichment")) {
          d = art.enrichment;
          if (d.hasOwnProperty("affiliations")) {
            // check if doc has affiliations
            if (d.affiliations.length > 1) {
              // check for more than 1 aff
              d.affiliations.forEach((aff) => {
                // iterate over affils
                affname = aff.affilname;
                if (collabDir.hasOwnProperty(affname)) {
                } else {
                  // if this aff doesn't exist in dir
                  // create this entry in dir
                  collabDir[affname] = {
                    name: affname,
                    city: aff["affiliation-city"],
                    country: aff["affiliation-country"],
                    collab: {},
                  };
                }

                d.affiliations.forEach((oaff) => {
                  // then iterate on art aff
                  oaffname = oaff.affilname;
                  if (oaffname === affname) {
                  } else {
                    // if aff isn't the current aff
                    let thisCollab = collabDir[affname]["collab"];
                    if (thisCollab.hasOwnProperty(oaffname)) {
                      // check current aff's existing links
                    } else {
                      thisCollab[oaffname] = 0; // create new link if doesn't exist
                    }

                    thisCollab[oaffname]++; // increment link by 1
                  }
                });
              });
            }
          }
        }
      });

      //  console.log(collabDir);

      //dataDownload(collabDir);
      // end of Affiliation collaboration compute

      Promise.all([d3.json("json/world-countries.json")]).then((geo) => {
        var geoData = geo[0];

        const links = [];

        var brushContent;

        var linksBuffer = [];

        const dataArray = [];

        data.forEach((d) => {
          if (
            d.hasOwnProperty("enrichment") &&
            d.enrichment.hasOwnProperty("affiliations")
          ) {
            if (d.hasOwnProperty("issued")) {
              // there is clearly an issue here

              let year = d.issued["date-parts"][0][0];
              let month = d.issued["date-parts"][0][1];
              let day = d.issued["date-parts"][0][2];

              if (month === undefined) {
                // if month isn't registered
                month = 1;
              }

              if (day === undefined) {
                // if day isn't registered
                day = 1;
              }

              d.rebuildDate = year + "-" + month + "-" + day;

              d.parsedDate = parseTime(d.rebuildDate);

              d.date = year + "," + month;
            }

            d.authors = [];
            if (d.hasOwnProperty("author")) {
              for (let j = 0; j < d.author.length; j++) {
                let element = d.author[j].given + " " + d.author[j].family;
                d.authors.push(element);
              }
            }
            let link = { DOI: "", points: [] };
            link.DOI = d.DOI;
            for (var k = 0; k < d.enrichment.affiliations.length; k++) {
              if (d.enrichment.affiliations[k].lon != undefined) {
                d.enrichment.affiliations[k].affilId =
                  d.enrichment.affiliations[k]["affiliation-city"] +
                  "-" +
                  d.enrichment.affiliations[k]["affiliation-country"];

                dataArray.push(d.enrichment.affiliations[k]);

                let thisCity = {
                  cityname: "",
                  lon: "",
                  lat: "",
                  affilId: "",
                };
                thisCity.cityname =
                  d.enrichment.affiliations[k]["affiliation-city"];
                thisCity.lon = d.enrichment.affiliations[k].lon;
                thisCity.lat = d.enrichment.affiliations[k].lat;
                thisCity.affilId = d.enrichment.affiliations[k].affilId;
                link.points.push(thisCity);
              }
            }
            linksBuffer.push(link);
          } else {
            data.splice(d.index, 1);
          }
        });

        for (var i = 0; i < linksBuffer.length; i++) {
          if (linksBuffer[i].points.length > 1) {
            links.push(linksBuffer[i]);
          }
        }

        links.forEach((d) => {
          if (d.points.length < 3) {
            d.type = "LineString";
            d.coordinates = [[], []];
            d.coordinates[0].push(d.points[0].lon, d.points[0].lat);
            d.coordinates[1].push(d.points[1].lon, d.points[1].lat);
          } else {
            d.type = "MultiLineString";
            d.coordinates = [];
            for (var i = 0; i < d.points.length - 1; i++) {
              let indexCoord = [];
              let subarrayOne = [];
              subarrayOne.push(d.points[i].lon, d.points[i].lat);
              let subarrayTwo = [];
              subarrayTwo.push(d.points[i + 1].lon, d.points[i + 1].lat);
              indexCoord.push(subarrayOne, subarrayTwo);
              d.coordinates.push(indexCoord);
            }
          }
        });

        for (var i = 0; i < data.length; i++) {
          data[i].index = i;
        } // id = item index

        var citiesGroup = d3.group(dataArray, (d) => d.affilId);

        var cities = [];

        citiesGroup.forEach((d) => {
          let valuesBuffer = [];

          let affiliationsBuffer = [];

          for (var j = 0; j < data.length; j++) {
            if (
              data[j].hasOwnProperty("enrichment") &&
              data[j].enrichment.hasOwnProperty("affiliations")
            ) {
              for (var k = 0; k < data[j].enrichment.affiliations.length; k++) {
                if (data[j].enrichment.affiliations[k].affilId === d.key) {
                  affiliationsBuffer.push(
                    data[j].enrichment.affiliations[k].affilname
                  );
                  valuesBuffer.push(data[j]);
                }
              }
            }
          }

          cities.push({
            lon: d[0].lon,
            lat: d[0].lat,
            country: d[0]["affiliation-country"],
            city: d[0]["affiliation-city"],
            affiliations: [],
            values: valuesBuffer,
          });
        });

        for (var i = 0; i < cities.length; i++) {
          cities[i].id = i;
        } // id = item index

        const affilFinder = (city) => {
          // purge existing tooltip content
          let geoToolTip = document.getElementById("tooltip");
          while (geoToolTip.firstChild) {
            geoToolTip.removeChild(geoToolTip.firstChild);
          }

          let cityTitle = document.createElement("h2");
          cityTitle.innerText = city.city;

          let country = document.createElement("h3");
          country.innerText = city.country;

          geoToolTip.appendChild(cityTitle);
          geoToolTip.appendChild(country);

          let institutions = [];

          for (var j = 0; j < city.affiliations.length; j++) {
            let institution = { name: "", papers: [] };

            institution.name = city.affiliations[j];

            for (var k = 0; k < city.values.length; k++) {
              for (
                var l = 0;
                l < city.values[k].enrichment.affiliations.length;
                l++
              ) {
                if (
                  city.values[k].enrichment.affiliations[l].affilname ===
                  city.affiliations[j]
                ) {
                  let link = {};
                  if (
                    institution.papers.findIndex(
                      (paper) => paper.title === city.values[k].title
                    ) < 0
                  ) {
                    institution.papers.push({
                      title: city.values[k].title,
                      DOI: city.values[k].DOI,
                      OA: city.values[k].enrichment.OA,
                      visibility: city.values[k].visibility,
                    });
                  }
                }
              }
            }
            if (
              institutions.findIndex((f) => f.name === city.affiliations[j]) < 0
            ) {
              institutions.push(institution);
            }
          }

          institutions.forEach((e) => {
            var list = document.createElement("UL");
            let inst = document.createElement("SPAN");

            for (var i = 0; i < e.papers.length; i++) {
              if (e.papers[i].visibility) {
                inst.innerHTML = "<strong>" + e.name + "</strong>";
                break;
              }
            }

            for (var i = 0; i < e.papers.length; i++) {
              let url = "https://dx.doi.org/" + e.papers[i].DOI;
              let docDOM = document.createElement("LI");

              if (e.papers[i].visibility) {
                if (e.papers[i].OA) {
                  docDOM.innerHTML =
                    "<img src='././svg/OAlogo.svg' height='16px'/>&nbsp;" +
                    e.papers[i].title;
                  list.appendChild(docDOM);
                } else {
                  docDOM.innerHTML = e.papers[i].title;
                  list.appendChild(docDOM);
                }
              }

              docDOM.addEventListener("click", (e) =>
                window.electron.invoke("openEx", url)
              );
            }
            document.getElementById("tooltip").appendChild(inst);
            document.getElementById("tooltip").appendChild(list);
          });
        };

        // countries
        var countryMap = view.append("g").attr("id", "countryMap");

        countryMap
          .selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .style("fill", "white")
          .style("stroke", "#c6c6c6")
          .style("stroke-width", 0.5)
          .attr("id", (d) => d.id)
          .attr("d", path);

        //graticule
        countryMap
          .append("path")
          .datum(graticule)
          .style("fill", "transparent")
          .style("stroke", "white")
          .style("stroke-width", 0.7)
          .attr("d", path);

        var locGroup = view.append("g").attr("id", "cityLocations"); // Create a group for cities + links (circles + arcs)

        cities.forEach((city) =>
          city.values.forEach((paper) => (paper.visibility = true))
        ); // Make all cities visible at first
        links.forEach((link) => (link.visibility = true)); // Make all links visibile at first

        const linkLoc = () => {
          // generate links and cities

          document
            .getElementById("view")
            .removeChild(document.getElementById("cityLocations")); // remove all cities & links

          var locGroup = view.append("g").attr("id", "cityLocations"); // recreate the cities & links svg group

          cities.forEach((city) => {
            // for each city
            let radius = 1; // base radius is 1
            for (let i = 0; i < city.values.length; i++) {
              // for each article in each city
              if (city.values[i].visibility) {
                // if the article has been published in this timeframe
                radius = radius + 1; // add a unit to the radius
              }
            }
            if (radius === 1) {
              city.radius = 0;
            } // if it stays at 1, no articles published
            else {
              // else, the radius is log(article number) + 1
              city.radius = Math.log(radius) + 1.5;
            }
          });

          cities.sort((a, b) => d3.descending(a.radius, b.radius)); // Make sure smaller nodes are above bigger nodes

          var areaList = new Object();

          cities.forEach((city) => {
            city.cluster =
              JSON.stringify(parseInt(city.lon)) +
              "|" +
              JSON.stringify(parseInt(city.lat));

            if (areaList[city.cluster] === undefined) {
              areaList[city.cluster] = 1;
            } else {
              areaList[city.cluster] = areaList[city.cluster] + 1;
            }
          });

          for (var key in areaList) {
            let count = areaList[key];

            let currentCluster = [];
            if (count > 1) {
              for (let i = 0; i < cities.length; i++) {
                if (cities[i].cluster === key) {
                  currentCluster.push(i);
                }
              }
              currentCluster.forEach(
                (cityIndex) => (cities[cityIndex].smallInCluster = true)
              );
              currentCluster.sort((a, b) => d3.descending(a.radius, b.radius)); // Make sure smaller nodes are above bigger nodes
              cities[currentCluster[0]].smallInCluster = false;
            }
          }

          // =====

          var affilLinks = locGroup
            .selectAll("lines") // add the links
            .data(links)
            .enter()
            .append("path")
            .attr("class", "arc fly_arcs")
            .style("fill", "none")
            .style("stroke-width", ".1")
            .style("stroke-linecap", "round")
            .style("stroke", (d) => {
              if (d.visibility) {
                return "crimson";
              } else {
                return "transparent";
              }
            })
            .attr("d", (d) => swoosh(flyingArc(d)));

          var affilShadows = locGroup
            .selectAll("lines") // add the links
            .data(links)
            .enter()
            .append("path")
            .style("fill", "none")
            .attr("class", "arc")
            .style("stroke-width", ".15")
            .style("stroke-linecap", "round")
            .style("stroke", (d) => {
              if (d.visibility) {
                return "rgba(200,200,200,.6)";
              } else {
                return "transparent";
              }
            }) // links always exist, they just become transparent if the articles are not in the timeframe

            .attr("d", path);
          affilLinks.raise();

          var locNames = locGroup
            .selectAll("text")
            .data(cities)
            .enter()
            .append("text")

            .style("fill", "black")
            .style("font-family", "sans-serif")
            .style("user-select", "none")
            .style("display", (d) => {
              if (
                d.hasOwnProperty("smallInCluster") &&
                d.smallInCluster === true
              ) {
                return "none";
              } else {
                return "block";
              }
            })
            .style("font-size", (d) => {
              if (d.radius > 0) {
                return d.radius + 0.1 + "px";
              } else {
                return "0";
              }
            })
            .attr("transform", (d) => {
              var loc = projection([d.lon, d.lat]),
                x = loc[0];
              y = loc[1];
              return "translate(" + (x + d.radius) + "," + y + ")";
            })
            .text((d) => d.city);

          // ADDING THE CITIES

          var locations = locGroup
            .selectAll(".locations")
            .data(cities)
            .enter()
            .append("path")
            .attr("id", (d) => d.city)
            .attr("class", "locations")
            .style("fill", "rgba(0, 82, 158, 0.55)")
            .style("stroke", "none")
            .style("cursor", "help");

          locations
            .datum((d) =>
              d3
                .geoCircle()
                .center([d.lon, d.lat])
                .radius(d.radius * 0.05)()
            )
            .attr("d", path);

          locations.on("mouseover", (event, d) => {
            d3.selectAll(".arc").style("opacity", ".15");
            d3.selectAll(".locations").style("opacity", ".4");

            for (var i = 0; i < locations._groups[0].length; i++) {
              if (
                d.coordinates[0][0] ===
                locations._groups[0][i].__data__.coordinates[0][0]
              ) {
                d3.select(locations._groups[0][i]).style("opacity", "1");

                affilFinder(cities[i]);

                d3.selectAll(".arc")._groups[0].forEach((lk) => {
                  if (lk.__data__.points[0].cityname === cities[i].city) {
                    d3.select(lk).style("opacity", "1");
                  }

                  if (lk.__data__.points[1].cityname === cities[i].city) {
                    d3.select(lk).style("opacity", "1");
                  }
                });
              }
            }
          });

          locations.on("mouseout", () => {
            d3.selectAll(".arc").style("opacity", "1");
            d3.selectAll(".locations").style("opacity", "1");
          });
        };

        linkLoc(); // start it a first time
        // Brush Data

        // === Bar Range Slider ===
        // adapted from https://observablehq.com/@bumbeishvili/data-driven-range-sliders

        const barRangeSlider = (
          initialDataArray,
          accessorFunction,
          aggregatorFunction,
          paramsObject
        ) => {
          const chartWidth = width - toolWidth - 40;
          let chartHeight = 100;
          let startSelection = 100;

          const argumentsArr = [initialDataArray];

          const initialData = initialDataArray;
          const accessor = accessorFunction;
          const aggregator = aggregatorFunction;
          let params = argumentsArr.filter(isPlainObj)[0];
          if (!params) {
            params = {};
          }
          params.minY = params.yScale ? 0.0001 : 0;
          params.yScale = params.yScale || d3.scaleLinear();
          chartHeight = params.height || chartHeight;
          params.yTicks = params.yTicks || 4;
          params.freezeMin = params.freezeMin || false;

          var accessorFunc = (d) => d;
          if (initialData[0].value != null) {
            accessorFunc = (d) => d.value;
          }
          if (typeof accessor == "function") {
            accessorFunc = accessor;
          }

          const grouped = d3.group(data, (d) => +d.parsedDate);

          //const isDate = true;
          var dateExtent,
            dateScale,
            scaleTime,
            dateRangesCount,
            dateRanges,
            scaleTime;
          //        if (isDate) {

          dateExtent = d3.extent(data.map((d) => d.parsedDate));

          console.log(dateExtent);

          dateRangesCount = Math.round(width / 5);
          dateScale = d3
            .scaleTime()
            .domain(dateExtent)
            .range([0, dateRangesCount]);
          scaleTime = d3.scaleTime().domain(dateExtent).range([0, chartWidth]);
          dateRanges = d3
            .range(dateRangesCount)
            .map((d) => [dateScale.invert(d), dateScale.invert(d + 1)]);
          //      }

          d3.selection.prototype.patternify = function (params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container
              .selectAll("." + selector)
              .data(data, (d, i) => {
                if (typeof d === "object") {
                  if (d.id) {
                    return d.id;
                  }
                }
                return i;
              });
            selection.exit().remove();
            selection = selection.enter().append(elementTag).merge(selection);
            selection.attr("class", selector);
            return selection;
          };

          const handlerWidth = 2,
            handlerFill = "#E1E1E3",
            middleHandlerWidth = 10,
            middleHandlerStroke = "#8E8E8E",
            middleHandlerFill = "#EFF4F7";

          const svg = d3.select("#xtypeSVG");

          let sliderOffsetHeight = document.body.offsetHeight - 120;

          const chart = svg
            .append("g")
            .attr("transform", "translate(30," + sliderOffsetHeight + ")");

          var values = [];

          grouped.forEach((val, key) => {
            if (isNaN(key)) {
              //log amount of missing elements
            } else {
              values.push({ date: key, value: val.length });
            }
          });

          values = values.slice().sort((a, b) => d3.ascending(a.date, b.date));

          //  console.log(values);

          const min = d3.min(values, (d) => d.value);
          const max = d3.max(values, (d) => d.value);
          const maxX = values[values.length - 1].date;
          const minX = values[0].date;

          //  console.log(minX, maxX);

          var minDiff = d3.min(values, (d, i, arr) => {
            if (!i) return Infinity;
            return d.date - arr[i - 1].date;
          });

          let eachBarWidth = 1;
          /*
                       chartWidth / values.length;
   
                      if (eachBarWidth > 20) {
                          eachBarWidth = 20;
                      }
   
   
                      if (minDiff < 1) {
                          eachBarWidth = eachBarWidth * minDiff;
                      }
   
   
                      if (eachBarWidth < 1) {
                          eachBarWidth = 1;
                      }
                      */

          const scale = params.yScale
            .domain([params.minY, max])
            .range([0, chartHeight - 25]);

          const scaleY = scale
            .copy()
            .domain([max, params.minY])
            .range([0, chartHeight - 25]);

          const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX])
            .range([0, chartWidth]);

          // var axis = d3.axisBottom(scaleX);
          //if (isDate) {
          var axis = d3.axisBottom(scaleTime);
          //}
          const axisY = d3
            .axisLeft(scaleY)
            .tickSize(-chartWidth - 20)
            .ticks(max == 1 ? 1 : params.yTicks)
            .tickFormat(d3.format(".2s"));

          const bars = chart
            .selectAll(".bar")
            .data(values)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", eachBarWidth)
            .attr("height", (d) => scale(d.value))
            .attr("fill", "steelblue")
            .attr("y", (d) => -scale(d.value) + (chartHeight - 25))
            .attr("x", (d, i) => scaleX(d.date) - eachBarWidth / 2)
            .attr("opacity", 0.9);

          const xAxisWrapper = chart
            .append("g")
            .attr("id", "brushXAxis")
            .attr("transform", `translate(${0},${chartHeight - 25})`)
            .call(axis);

          const yAxisWrapper = chart
            .append("g")
            .attr("transform", `translate(${-10},${0})`)
            .call(axisY);

          const brush = chart
            .append("g")
            .attr("id", "selectionBrush")
            .attr("class", "brush")
            .call(
              d3
                .brushX()
                .extent([
                  [0, 0],
                  [chartWidth, chartHeight],
                ])
                .on("start", (e) => {
                  brushStarted(e);
                })
                .on("end", (e) => {
                  brushEnded(e);
                })
                .on("brush", (e) => {
                  brushed(e);
                })
            );

          chart.selectAll(".selection").attr("fill-opacity", 0.1);

          var handle = brush
            .patternify({
              tag: "g",
              selector: "custom-handle",
              data: [
                {
                  left: true,
                },
                {
                  left: false,
                },
              ],
            })
            .attr("cursor", "ew-resize")
            .attr("pointer-events", "all");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect",
              data: (d) => [d],
            })
            .attr("width", handlerWidth)
            .attr("height", 100)
            .attr("fill", handlerFill)
            .attr("stroke", handlerFill)
            .attr("y", -50)
            .attr("pointer-events", "none");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-middle",
              data: (d) => [d],
            })
            .attr("width", middleHandlerWidth)
            .attr("height", 30)
            .attr("fill", middleHandlerFill)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -16)
            .attr("x", -middleHandlerWidth / 4)
            .attr("pointer-events", "none")
            .attr("rx", 3);

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-line-left",
              data: (d) => [d],
            })
            .attr("width", 0.7)
            .attr("height", 20)
            .attr("fill", middleHandlerStroke)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -100 / 6 + 5)
            .attr("x", -middleHandlerWidth / 4 + 3)
            .attr("pointer-events", "none");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-line-right",
              data: (d) => [d],
            })
            .attr("width", 0.7)
            .attr("height", 20)
            .attr("fill", middleHandlerStroke)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -100 / 6 + 5)
            .attr("x", -middleHandlerWidth / 4 + middleHandlerWidth - 3)
            .attr("pointer-events", "none");

          handle.attr("display", "none");

          function brushStarted({ selection }) {
            if (selection) {
              startSelection = selection[0];
            }
          }

          function brushEnded(event) {
            const selection = event.selection;

            // console.log(selection);

            if (!selection) {
              handle.attr("display", "none");

              output({
                range: [minX, maxX],
              });
              return;
            }
            // if (event.sourceEvent.type === "brush") return;

            var d0 = selection.map(scaleX.invert),
              d1 = d0.map(d3.timeDay.round);

            if (d1[0] >= d1[1]) {
              d1[0] = d3.timeDay.floor(d0[0]);
              d1[1] = d3.timeDay.offset(d1[0]);
            }

            brushContent = d1;

            let paperMap = new Map();

            data.forEach((d) => {
              if (
                d.parsedDate >= brushContent[0] &&
                d.parsedDate <= brushContent[1]
              ) {
                paperMap.set(d.DOI, true);
              }
            });

            // Manage link visibility
            links.forEach((link) => {
              if (paperMap.get(link.DOI)) {
                link.visibility = true;
              } else {
                link.visibility = false;
              }
            });

            cities.forEach((city) => {
              city.values.forEach((paper) => {
                if (paperMap.get(paper.DOI)) {
                  paper.visibility = true;
                } else {
                  paper.visibility = false;
                }
              });
            });

            document.getElementById(
              "docCountDiv"
            ).innerHTML = `${paperMap.size} articles`;
            linkLoc();
            d3.select("#tooltip").html("");
          }

          function brushed(event, d) {
            const selection = event.selection;
            if (event.sourceEvent.type === "brush") return;

            if (params.freezeMin) {
              if (selection[0] < startSelection) {
                selection[1] = Math.min(selection[0], selection[1]);
              }
              if (selection[0] >= startSelection) {
                selection[1] = Math.max(selection[0], selection[1]);
              }

              selection[0] = 0;

              d3.select(this).call(event.target.move, selection);
            }

            var d0 = selection.map(scaleX.invert);
            const s = selection;

            handle.attr("display", null).attr("transform", function (d, i) {
              return "translate(" + (s[i] - 2) + "," + chartHeight / 2 + ")";
            });
            output({
              range: d0,
            });
          }

          yAxisWrapper.selectAll(".domain").remove();
          xAxisWrapper.selectAll(".domain").attr("opacity", 0.1);

          chart.selectAll(".tick line").attr("opacity", 0.1);

          function isPlainObj(o) {
            return typeof o == "object" && o.constructor == Object;
          }

          function output(value) {
            const node = svg.node();
            node.value = value;
            node.value.data = getData(node.value.range);
            // if (isDate) {
            node.value.range = value.range.map((d) => dateScale.invert(d));
            //}
            node.dispatchEvent(new CustomEvent("input"));
          }

          function getData(range) {
            const dataBars = bars
              .attr("fill", "steelblue")
              .filter((d) => {
                return d.key >= range[0] && d.key <= range[1];
              })
              .attr("fill", "red")
              .nodes()
              .map((d) => d.__data__)
              .map((d) => d.values)
              .reduce((a, b) => a.concat(b), []);

            return dataBars;
          }

          const returnValue = Object.assign(svg.node(), {
            value: {
              range: [minX, maxX],
              data: initialData,
            },
          });

          //  if (isDate) {
          returnValue.value.range = returnValue.value.range.map((d) =>
            dateScale.invert(d)
          );
          //  }

          return returnValue;
        };

        var docCountDiv = document.createElement("div");
        docCountDiv.id = "docCountDiv";
        docCountDiv.style.position = "absolute";
        docCountDiv.style.fontSize = "10px";
        docCountDiv.style.top = document.body.offsetHeight - 15 + "px";
        docCountDiv.style.left = parseInt(width - toolWidth) / 2 + "px";
        docCountDiv.innerHTML = data.length + " articles";
        xtype.appendChild(docCountDiv);

        barRangeSlider(data);

        loadType("geotype", id);
      }); // end of world-country call
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Geotype error: dataset " + id + " is invalid."
      );
    });

  let v0, q0, r0;

  const clamper = (c) => {
    var globeCenter = projection.invert([
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
    ]);
    let lon = c[0],
      lat = c[1];
    let clampLevel = 125;
    if (
      lon > globeCenter[0] - clampLevel &&
      lon < globeCenter[0] + clampLevel &&
      lat > globeCenter[1] - clampLevel &&
      lat < globeCenter[1] + clampLevel
    ) {
      return true;
    } else {
      return false;
    }
  };

  function dragstarted(event) {
    v0 = versor.cartesian(projection.invert(d3.pointer(event)));
    q0 = versor((r0 = projection.rotate()));
  }

  dragged = function (event, targetDrag, transTime) {
    if (targetDrag) {
      d3.transition()
        .duration(2000)
        .attrTween("render", () => (t) => {
          var x = d3.interpolateNumber(currentDrag[0], targetDrag[0])(t);
          var y = d3.interpolateNumber(currentDrag[1], targetDrag[1])(t);
          var z = d3.interpolateNumber(currentDrag[2], targetDrag[2])(t);

          coord = [x, y, z];

          loftedProjection.rotate(coord);
          projection.rotate(coord);
          view.selectAll("path").attr("d", path);

          d3.select("#cityLocations")
            .selectAll("text")
            .style("display", (d) => {
              //hide if behind the globe or in cluster

              if (
                d.hasOwnProperty("smallInCluster") &&
                d.smallInCluster === true
              ) {
                return "none";
              }
              var city = [d.lon, d.lat];
              //if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
              if (clamper(city)) {
                return "block";
              } else {
                return "none";
              }
            })
            .attr("transform", (d) => {
              var loc = projection([d.lon, d.lat]),
                x = loc[0],
                y = loc[1];

              return "translate(" + (x + d.radius) + "," + y + ")";
            })
            .text((d) => d.city)
            .raise();
          view
            .selectAll(".fly_arcs")
            .attr("d", (d) => swoosh(flyingArc(d)))
            .raise();
        })
        .on("end", () => {
          currentDrag = coord;
        });
    } else {
      const v1 = versor.cartesian(
        projection.rotate(r0).invert(d3.pointer(event))
      );
      const q1 = versor.multiply(q0, versor.delta(v0, v1));
      projection.rotate(versor.rotation(q1));
      loftedProjection.rotate(versor.rotation(q1));
      currentDrag = versor.rotation(q1);

      var globeCenter = projection.invert([
        document.getElementById("xtypeSVG").width.baseVal.value / 2,
        document.getElementById("xtypeSVG").width.baseVal.value / 2,
      ]);

      view.selectAll("path").attr("d", path);

      view
        .selectAll(".fly_arcs")
        .attr("d", (d) => swoosh(flyingArc(d)))
        .raise();

      view.selectAll(".fly_arcs").style("display", (d) => {
        let disp = "block";
        d.coordinates.forEach((pt) => {
          let ptLink = [pt[0], pt[1]];
          if (clamper(ptLink)) {
          } else {
            // HIDE ARCS BY UNCOMMENTING HERE
            // disp="none"
          }
        });
        return disp;
      });

      d3.select("#cityLocations")
        .selectAll("text")
        .style("display", (d) => {
          //hide if behind the globe or in cluster

          if (d.hasOwnProperty("smallInCluster") && d.smallInCluster === true) {
            return "none";
          }

          //if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
          var city = [d.lon, d.lat];
          if (clamper(city)) {
            return "block";
          } else {
            return "none";
          }
        })
        .attr("transform", (d) => {
          var loc = projection([d.lon, d.lat]),
            x = loc[0],
            y = loc[1];

          return "translate(" + (x + d.radius) + "," + y + ")";
        })
        .text((d) => d.city)
        .raise();
    }
  };

  view.call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", (event) => dragged(event))
  );

  view.style("transform-origin", "50% 50% 0");
  view.call(zoom);

  zoomed = (thatZoom, transTime) => {
    currentZoom = thatZoom;
    view
      .transition()
      .duration(transTime)
      .style("transform", "scale(" + thatZoom.k + ")");
  };

  window.electron.send("console-logs", "Starting geotype");
};

export { geotype };
