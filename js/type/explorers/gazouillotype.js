// ========= GAZOUILLOTYPE =========
const gazouillotype = (id) => {
  // When called, draw the gazouillotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG node

  svg
    .attr("width", width - toolWidth)
    .attr("height", height) // Attributing width and height to svg
    .style("cursor", "all-scroll");

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view")
    .attr("id", "piles");

  var brushHeight = 150; // Hardcoding brush height

  svg
    .append("rect") // Inserting a rectangle below the brush to make it easier to read
    .attr("x", 0)
    .attr("y", height - brushHeight) // Rectangle starts at top left
    .attr("width", width)
    .attr("height", brushHeight) // Rectangle dimensions
    .style("fill", "white") // Rectangle background color
    .style("stroke-width", "0"); // Invisible borders

  svg.call(
    zoom.on("zoom", ({ transform }, e) => {
      zoomed(transform);
    })
  );

  var brushXscale;

  //========== X & Y AXIS  ============                                // Creating two arrays of scales (graph + brush)
  var x = d3.scaleTime();
  var y = d3
    .scaleLinear()
    .range([height - brushHeight, 0])
    .domain([0, 210]);

  var xAxis = d3.axisBottom(x).tickFormat(multiFormat);

  var yAxis = d3.axisRight(y).tickFormat(d3.format(".2s"));

  var domainDates = [];
  var bufferData = [];
  var lineData = [];

  const scrapToApiFormat = (data) => {
    if (data.hasOwnProperty("date")) {
      data.from_user_name = data.username;
      data.created_at = data.date;
      data.retweet_count = data.retweets;
      data.favorite_count = data.favorites;
      delete data.username;
      delete data.date;
      delete data.retweets;
      delete data.favorites;
    }
  };

  // LOADING DATA

  pandodb.gazouillotype
    .get(id)
    .then((datajson) => {
      // Load dataset info from pandodb

      dataDownload(datajson);

      datajson.content.tweets = []; // Prepare array to store tweets into

      let tranche = { date: "", tweets: [] }; // A tranche will be a pile on the graph
      let twDate = 0; // Date variable
      let twtAmount = 0; // Tweet amount variable
      let radius = parseFloat(width / 1200);

      fs.createReadStream(datajson.content.path) // Read the flatfile dataset provided by the user
        .pipe(csv()) // pipe buffers to csv parser
        .on("data", (data) => {
          // each line becomes an object
          scrapToApiFormat(data); // convert the object to the twitter API format
          data.date = new Date(data.created_at); // get the date
          data.stamp = Math.round(data.date.getTime() / 600000) * 600000; // make it part of a 10-min pile in milliseconds
          data.timespan = new Date(data.stamp); // turn that into a proper JS date
          twtAmount++;
          //console.log(twtAmount);
          field.value = twtAmount + " tweets loaded";
          if (data.stamp === twDate) {
            // If a pile already exists
            tranche.tweets.push(data); // add this tweet to the current pile
          } else {
            // else
            // twtAmount += tranche.tweets.length; // add the amount of the previous pile to the previous total
            datajson.content.tweets.push(tranche); // push the pile to the main array
            twDate = data.stamp; // change pile date
            tranche = { date: data.timespan, tweets: [] }; // create new pile object
            tranche.tweets.push(data); // add tweet to this new pile

            /*
              window.electron.send(
                "chaeros-notification",
                twtAmount + " tweets loaded"
              ); // send new total to main display
              */
          }
        })
        .on("end", () => {
          // Once file has been totally read

          window.electron.send("chaeros-notification", "rebuilding data"); // send new total to main display

          datajson.content.tweets.shift(); // Remove first empty value

          // RE-SORT PILES TO MAKE SURE THEY ARE PAST->FUTURE

          const data = datajson.content.tweets; // Reassign data
          var keywords = datajson.content.keywords;

          if (typeof keywords === "object") {
            keywords = keywords.keywords;
          }

          var requestContent = "Request content :<br><ul>";

          keywords.forEach((kw) => {
            requestContent = requestContent + "<li>" + kw + "</li>";
          });
          requestContent = requestContent + "</ul>";

          // Find out the mean retweet value to attribute color scale
          var meanRetweetsArray = [];

          data.forEach((tweetDataset) => {
            tweetDataset.tweets.forEach((d) => {
              d.date = new Date(d.created_at);
              d.timespan = new Date(
                Math.round(d.date.getTime() / 600000) * 600000
              );
              if (d.retweet_count > 0) {
                meanRetweetsArray.push(d.retweet_count);
              }
            });
          });

          meanRetweetsArray.sort((a, b) => a - b);
          var median =
            meanRetweetsArray[parseInt(meanRetweetsArray.length / 2)];

          var color = d3
            .scaleSequential(d3.interpolateBlues)
            .clamp(true)
            .domain([-median * 2, median * 10]);

          var altColor = d3
            .scaleSequential(d3.interpolateOranges)
            .clamp(true)
            .domain([-median * 2, median * 10]);

          // Assign each tweet a place in the pile according to their index position
          const piler = () => {
            for (i = 0; i < data.length; i++) {
              let j = data[i].tweets.length + 1;
              for (k = 0; k < data[i].tweets.length; k++) {
                data[i].tweets[k].indexPosition = j - 1;
                j--;
              }
            }
          };

          piler();

          var firstDate = new Date(data[0].date);

          function addDays(date, days) {
            var result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
          }
          var plusDate = addDays(firstDate, 2);
          var lastDate = new Date(data[data.length - 1].date);

          domainDates.push(firstDate, lastDate);

          var pileExtent = (lastDate - firstDate) / 600000;

          data.forEach((d) => {
            d.tweets.forEach((tweet) => bufferData.push(tweet));
          });

          let circleData = [];
          for (let i = 0; i < bufferData.length; i++) {
            circleData.push(bufferData[i]);
          }

          const keywordsDisplay = () => {
            document.getElementById("tooltip").innerHTML = requestContent;
          };

          x.domain([firstDate, plusDate]).range([0, width - toolWidth]);
          xAxis.ticks(x.range()[1] / 100);
          /*
                      zoom.translateExtent([
                          [-Infinity, -Infinity],
                          [Infinity, Infinity],
                      ]);
  */
          let areaData = [];

          data.forEach((d) => {
            let point = {
              timespan: d.tweets[0].timespan,
              indexPosition: +d.tweets[0].indexPosition,
            };
            areaData.push(point);
          });

          view
            .selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .style("cursor", "pointer")
            .attr("id", (d) => d.id)
            .style("fill", (d) => color(d.retweet_count))
            .attr("r", radius)
            .attr("cx", (d) => x(d.timespan))
            .attr("cy", (d) => y(d.indexPosition))
            .on("click", (event, d) => {
              d3.select("#linktosource").remove();
              lineData = [];
              lineData.push(d);
              circleData.forEach((tweet) => {
                document.getElementById(tweet.id).style.fill = color(
                  tweet.retweet_count
                );

                if (tweet.id === d.retweeted_id) {
                  lineData.push(tweet);
                }

                if (
                  d.retweeted_id.length > 1 &&
                  tweet.retweeted_id === d.retweeted_id
                ) {
                  document.getElementById(tweet.id).style.fill = "salmon";
                }
                if (tweet.from_user_id === d.from_user_id) {
                  document.getElementById(tweet.id).style.fill = altColor(
                    tweet.retweet_count
                  );
                }
              });

              if (parseInt(d.retweeted_id)) {
                // if it is a NaN, returns false
                if (document.getElementById(d.retweeted_id)) {
                  document.getElementById(d.retweeted_id).style.fill = "red";
                }

                var line = (line = d3
                  .line()
                  .x((line) => x(line.timespan))
                  .y((line) => y(line.indexPosition)));

                view
                  .append("path")
                  .datum(lineData)
                  .attr("id", "linktosource")
                  .style("stroke", "red")
                  .style("stroke-linecap", "round")
                  .style("stroke-width", radius / 3)
                  .attr("d", line);
              }

              keywords
                .reduce((res, val) => res.concat(val.split(/ AND /)), [])
                .forEach((e) => {
                  let target = new RegExp("\\b" + e + "\\b", "gi");
                  if (target.test(d.text)) {
                    d.text = d.text.replace(target, "<mark>" + e + "</mark>");
                  }
                  if (target.test(d.from_user_name)) {
                    d.from_user_name = d.from_user_name.replace(
                      target,
                      "<mark>" + e + "</mark>"
                    );
                  }
                  if (target.test(d.links)) {
                    d.links = d.links.replace(target, "<mark>" + e + "</mark>");
                  }
                });
              d3.select("#tooltip").html(
                '<p class="legend"><strong><a target="_blank" href="https://mobile.twitter.com/' +
                  d.from_user_name +
                  '">' +
                  d.from_user_name +
                  '</a></strong> <br/><div style="border:1px solid black;"><p>' +
                  d.text +
                  "</p></div><br><br> Language: " +
                  d.lang +
                  "<br>Date: " +
                  d.date +
                  "<br> Favorite count: " +
                  d.favorite_count +
                  "<br>Reply count: " +
                  d.reply_count +
                  "<br>Retweet count: " +
                  d.retweet_count +
                  "<br>Links: <a target='_blank' href='" +
                  d.links +
                  "'>" +
                  d.links +
                  "</a><br> Hashtags: " +
                  d.hashtags +
                  "<br> Mentionned user names: " +
                  d.mentionned_user_names +
                  "<br> Source: " +
                  d.source_name +
                  "<br>Tweet id: <a target='_blank' href='https://mobile.twitter.com/" +
                  d.from_user_name +
                  "/status/" +
                  d.id +
                  "'>" +
                  d.id +
                  "</a><br> Possibly sensitive: " +
                  d.possibly_sensitive +
                  "<br><br> Embeded media<br><img src='" +
                  d.medias_urls +
                  "' width='300' ><br><br><strong>Location</strong><br/>City: " +
                  d.location +
                  "<br> Latitude:" +
                  d.lat +
                  "<br>Longitude: " +
                  d.lng +
                  "<br><br><strong>User info</strong><br><img src='" +
                  d.from_user_profile_image_url +
                  "' max-width='300'><br><br>Account creation date: " +
                  d.from_user_created_at +
                  "<br> Account name: " +
                  d.from_user_name +
                  "<br> User id: " +
                  d.from_user_id +
                  "<br> User description: " +
                  d.from_user_description +
                  "<br> User follower count: " +
                  d.from_user_followercount +
                  "<br> User friend count: " +
                  d.from_user_friendcount +
                  "<br> User tweet count: " +
                  d.from_user_tweetcount +
                  "" +
                  "<br><br>" +
                  requestContent +
                  "<br><br><br><br><br><br><br><br></p>"
              );
            });

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

            const argumentsArr = [...arguments];

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

            const grouped = initialData;

            const isDate = true;
            var dateExtent,
              dateScale,
              scaleTime,
              dateRangesCount,
              dateRanges,
              scaleTime;

            dateExtent = d3.extent(grouped.map((d) => d.timespan));

            dateRangesCount = Math.round(width / 5);
            dateScale = d3
              .scaleTime()
              .domain(dateExtent)
              .range([0, dateRangesCount]);
            scaleTime = d3
              .scaleTime()
              .domain(dateExtent)
              .range([0, chartWidth]);

            dateRanges = d3
              .range(dateRangesCount)
              .map((d) => [dateScale.invert(d), dateScale.invert(d + 1)]);

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

            const svg = d3.select(xtypeSVG);

            let sliderOffsetHeight = document.body.offsetHeight - 120;

            const chart = svg
              .append("g")
              .attr("transform", "translate(30," + sliderOffsetHeight + ")")
              .attr("id", "chart");

            grouped.forEach((d) => {
              d.key = d.timespan;
              d.value = d.indexPosition;
            });

            const values = grouped.map((d) => d.value);
            const min = d3.min(values);
            const max = d3.max(values);
            const maxX = grouped[grouped.length - 1].key;
            const minX = grouped[0].key;

            var minDiff = d3.min(grouped, (d, i, arr) => {
              if (!i) return Infinity;
              return d.key - arr[i - 1].key;
            });

            let eachBarWidth = chartWidth / minDiff / (maxX - minX);

            if (eachBarWidth > 20) {
              eachBarWidth = 20;
            }

            if (minDiff < 1) {
              eachBarWidth = eachBarWidth * minDiff;
            }

            if (eachBarWidth < 1) {
              eachBarWidth = 1;
            }

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

            var axis = d3.axisBottom(scaleX);

            if (isDate) {
              axis = d3
                .axisBottom(scaleTime)
                .tickFormat(d3.timeFormat("%d/%m/%y"));
            }

            const axisY = d3
              .axisLeft(scaleY)
              .tickSize(-chartWidth - 20)
              .ticks(max == 1 ? 1 : params.yTicks)
              .tickFormat(d3.format(".2s"));

            brushXscale = scaleX;

            const bars = chart
              .selectAll(".bar")
              .data(grouped)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("width", eachBarWidth)
              .attr("height", (d) => scale(d.value))
              .attr("fill", "steelblue")
              .attr("y", (d) => -scale(d.value) + (chartHeight - 25))
              .attr("x", (d, i) => scaleX(d.key) - eachBarWidth / 2)
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
                  .on("start", brushStarted)
                  .on("end", brushEnded)
                  .on("brush", brushed)
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
              .attr("pointer-events", "none");

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

            function brushStarted() {
              if (event.selection) {
                startSelection = event.selection[0];
              }
            }

            function brushEnded() {
              if (!event.selection) {
                handle.attr("display", "none");

                output({
                  range: [minX, maxX],
                });
                return;
              }
              if (event.sourceEvent.type === "brush") return;

              var d0 = event.selection.map(scaleX.invert),
                d1 = d0.map(d3.timeDay.round);

              if (d1[0] >= d1[1]) {
                d1[0] = d3.timeDay.floor(d0[0]);
                d1[1] = d3.timeDay.offset(d1[0]);
              }

              brushContent = d1;

              let midDate;

              midDate = new Date(
                brushContent[0].getTime() +
                  (brushContent[1].getTime() - brushContent[0].getTime()) / 2
              );

              // TO DO
              // COMPUTE ZOOM SCALE ACCORDING TO d1

              d3.select("#xtypeSVG")
                .transition()
                .duration(750)
                .call(
                  zoom.transform,
                  d3.zoomIdentity.translate(-x(d1[0]), -y(200))
                );

              let visibleTweets = 0;

              grouped.forEach((pile) => {
                if (
                  pile.key >= brushContent[0] &&
                  pile.key <= brushContent[1]
                ) {
                  visibleTweets =
                    parseInt(visibleTweets) + parseInt(pile.value);
                }
              });

              //   document.getElementById("docCountDiv").innerHTML = visibleTweets + " tweets";
            }

            function brushed(d) {
              if (event.sourceEvent.type === "brush") return;

              if (params.freezeMin) {
                if (event.selection[0] < startSelection) {
                  event.selection[1] = Math.min(
                    event.selection[0],
                    event.selection[1]
                  );
                }
                if (event.selection[0] >= startSelection) {
                  event.selection[1] = Math.max(
                    event.selection[0],
                    event.selection[1]
                  );
                }

                event.selection[0] = 0;

                d3.select(this).call(event.target.move, event.selection);
              }

              var d0 = event.selection.map(scaleX.invert);
              const s = event.selection;

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
              if (isDate) {
                node.value.range = value.range.map((d) => dateScale.invert(d));
              }
              node.dispatchEvent(new CustomEvent("input"));
            }

            function getData(range) {
              const dataBars = bars
                .attr("fill", "steelblue")
                .filter((d) => {
                  return d.key >= range[0] && d.key <= range[1];
                })
                //  .attr("fill", "red")
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

            if (isDate) {
              returnValue.value.range = returnValue.value.range.map((d) =>
                dateScale.invert(d)
              );
            }

            return returnValue;
          };

          var docCountDiv = document.createElement("div");
          docCountDiv.id = "docCountDiv";
          docCountDiv.style.position = "absolute";
          docCountDiv.style.fontSize = "10px";
          docCountDiv.style.top = document.body.offsetHeight - 15 + "px";
          docCountDiv.style.left = parseInt(width - toolWidth) / 2 + "px";
          docCountDiv.innerHTML = circleData.length + " tweets";
          xtype.appendChild(docCountDiv);

          barRangeSlider(areaData);

          loadType();

          keywordsDisplay();
        });
    })
    .catch((error) => {
      console.log(error);
      field.value = " error";
      window.electron.send(
        "console-logs",
        " error: cannot start corpus " + id + "."
      );
    }); //======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========

  svg
    .append("rect")
    .attr("x", "0")
    .attr("y", parseInt(height - 180))
    .attr("width", width)
    .attr("height", "40px")
    .attr("fill", "rgba(255,255,255,.7)");

  svg
    .append("rect")
    .attr("x", parseInt(width - toolWidth - 65))
    .attr("y", "0")
    .attr("width", "80px")
    .attr("height", height)
    .attr("fill", "rgba(255,255,255,.7)");

  var gX = svg
    .append("g") // Make X axis rescalable
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - 180) + ")")
    .call(xAxis);

  var gY = svg
    .append("g") // Make Y axis rescalable
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + (width - toolWidth - 70) + ",0)")
    .call(yAxis);

  svg.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming

  var currentZoom;

  zoomed = (thatZoom, transTime) => {
    // if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

    var t = thatZoom;
    currentZoom = t;

    view.transition().duration(transTime).attr("transform", t);

    gX.transition()
      .duration(transTime)
      .call(xAxis.scale(t.rescaleX(x)));
    gY.transition()
      .duration(transTime)
      .call(yAxis.scale(t.rescaleY(y)));

    let ext1 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[0])));
    let ext2 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[1])));

    d3.select("#selectionBrush")
      .select(".selection")
      .transition()
      .duration(transTime)
      .attr("x", ext1)
      .attr("width", parseInt(ext2 - ext1));

    d3.select("#selectionBrush")
      .select("g")
      .transition()
      .duration(transTime)
      .attr("transform", "translate(" + ext1 + ",50)");

    d3.select("#selectionBrush")
      .selectAll("g")
      .transition()
      .duration(transTime)
      .select(function () {
        return this.nextElementSibling;
      })
      .attr("transform", "translate(" + ext2 + ",50)");
  };

  // ===== NARRATIVE =====

  // Presentation Recorder
  /*
   moveTo = (step) => {
   
  let buttons = document.querySelectorAll("div.presentationStep");
   
  buttons.forEach(but=>{
  but.style.backgroundColor="white";
  but.style.color="black";
  })
   
  buttons[parseInt(step.stepIndex)-1].style.backgroundColor="black";
  buttons[parseInt(step.stepIndex)-1].style.color="white";
   
  var t = step.zoom;
   
  view.transition().duration(2000).attr("transform", t);
   
  gX.transition().duration(2000).call(xAxis.scale(t.rescaleX(x)));
  gY.transition().duration(2000).call(yAxis.scale(t.rescaleY(y)));
   
  let ext1 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[0])));
  let ext2 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[1])));
   
  d3.select("#selectionBrush")
    .select(".selection")
    .transition().duration(2000)
    .attr("x",ext1)
    .attr("width",parseInt(ext2-ext1));
   
  d3.select("#selectionBrush")
    .select("g")
    .transition().duration(2000)
    .attr(
      "transform",
      "translate(" + ext1 + ",50)"
    );
   
  d3.select("#selectionBrush")
    .selectAll("g")
    .select(function() {
      return this.nextElementSibling;
    })
    .transition().duration(2000)
    .attr(
      "transform",
      "translate(" + ext2 + ",50)"
    );
   
  tooltip.innerHTML = JSON.parse(step.tooltip);
   
  }
  */

  const stepCreator = (thisStep) => {
    let stepIndex = thisStep.stepIndex;

    var step = document.createElement("DIV");
    step.innerText = stepIndex;
    step.className = "presentationStep";
    step.id = "presentationStep" + parseInt(stepIndex);

    step.addEventListener("click", () => {
      moveTo(presentationStep[parseInt(stepIndex) - 1]);
    });

    presentationBox.appendChild(step);
  };

  const addPresentationStep = () => {
    let stepData = {
      zoom: currentZoom,
      tooltip: JSON.stringify(tooltip.innerHTML),
    };

    let buttons = document.querySelectorAll("div.presentationStep");
    let currentButtonId = 0;

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].style.backgroundColor === "black") {
        currentButtonId = i;
      }
    }

    if (currentButtonId === 0) {
      presentationStep.push(stepData);
    } else {
      presentationStep.splice(currentButtonId + 1, 0, stepData);
    }

    regenerateSteps();
  };

  const regenerateSteps = () => {
    while (presentationBox.firstChild) {
      presentationBox.removeChild(presentationBox.firstChild);
    }

    for (let i = 0; i < presentationStep.length; i++) {
      presentationStep[i].stepIndex = i + 1;
      stepCreator(presentationStep[i]);
    }
  };

  regenerateSteps();

  window.electron.send("console-logs", "Starting gazouillotype"); // Starting gazouillotype
}; // Close gazouillotype function

export { gazouillotype };
