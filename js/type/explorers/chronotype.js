// ========== CHRONOTYPE ==========
const chronotype = (id) => {
  // When called, draw the chronotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg
    .attr("width", width - toolWidth)
    .attr("height", height) // Attributing width and height to svg
    .attr("viewBox", [
      -(width - toolWidth) / 2,
      -height / 2,
      width - toolWidth,
      height,
    ]);

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  zoom
    .scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ]) // Extent to which one can go up/down/left/right
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  var innerRadius = height / 3.5;
  var outerRadius = height / 2.25;
  var brushing;
  //============ RESET ============
  d3.select("#reset").on("click", resetted); // Clicking the button "reset" triggers the "resetted" function

  function resetted() {
    // Going back to origin position function
    d3.select("#xtypeSVG") // Selecting the relevant svg element in webpage
      .transition()
      .duration(2000) // Resetting takes some time
      .call(zoom.transform, d3.zoomIdentity); // Using "zoomIdentity", go back to initial position
    window.electron.send(
      "console-logs",
      "Resetting chronotype to initial position."
    ); // Send message in the "console"
  }

  //========== X & Y  ============
  var x = d3.scaleUtc().range([0, 2 * Math.PI]);

  var y = d3
    .scaleLinear() // Y axis scale
    .range([innerRadius, outerRadius]);

  //========= LINES & INFO ============
  var maxDocs = 0;

  var arcBars = d3
    .arc()
    .innerRadius((d) => y(d.zone))
    .outerRadius((d) => y(parseFloat(d.zone + d.value / (maxDocs + 1))))
    .startAngle((d) => x(d.date))
    .endAngle((d) => x(d.date.setMonth(d.date.getMonth() + 1)))
    .padAngle(0)
    .padRadius(innerRadius);

  var color = d3
    .scaleOrdinal() // Line colors
    .domain([0, 1])
    .range([
      "#08154a",
      "#490027",
      "#5c7a38",
      "#4f4280",
      "#6f611b",
      "#5b7abd",
      "#003f13",
      "#b479a9",
      "#3a2e00",
      "#017099",
      "#845421",
      "#008b97",
      "#460d00",
      "#62949e",
      "#211434",
      "#af8450",
      "#30273c",
      "#bd7b70",
      "#005b5c",
      "#c56883",
      "#a68199",
    ]);

  // Doc detail can be dependent on document type, as some metadata can only be available
  // within local, protected networks.
  const docDetailSet = new Set();

  const displayDoc = (d) => {
    tooltip.innerHTML = ""; // purge tooltip

    const content = document.createElement("div");

    if (d.hasOwnProperty("DOI")) {
      const doiResolveButton = document.createElement("button");
      doiResolveButton.className = "flux-button";
      doiResolveButton.innerText = "Resolve DOI in browser";
      //doiResolveButton.id = "https://dx.doi.org/" + d.DOI;
      doiResolveButton.addEventListener("click", (e) =>
        window.electron.invoke("openEx", "https://dx.doi.org/" + d.DOI)
      );

      //shell.openExternal("https://dx.doi.org/" + d.DOI))
      tooltip.append(doiResolveButton);
    }

    tooltip.append(content);

    // populate tooltip with document metadata
    for (const key in d) {
      switch (key) {
        case "shortTitle":
        case "enrichment":
          break;

        default:
          content.innerHTML += `<hr><strong>${key}</strong><br>${JSON.stringify(
            d[key]
          )} `;
          break;
      }
    }
  };

  const propertySet = new Set();

  //======== DATA CALL & SORT =========
  pandodb.chronotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      const docs = datajson.content; // Second array is the documents (docs)
      // const clusters = [];
      var links = []; // Declaring links as empty array
      const nodeDocs = [];
      var currentNodes = [];
      var authors;
      // var codeFreq = {};
      const csl_material = {
        "paper-conference": "event",
        NA2: "dns",
        personal_communication: "mail",
        "article-magazine": "chrome_reader_mode",
        report: "tab",
        broadcast: "radio",
        chapter: "list",
        webpage: "web",
        map: "map",
        manuscript: "receipt",
        "entry-dictionary": "format_list_numbered",
        "entry-encyclopedia": "art_track",
        NA5: "add_to_queue",
        NA4: "video_label",
        NA3: "question_answer",
        NA1: "markunread_mailbox",
        interview: "speaker_notes",
        legal_case: "announcement",
        thesis: "note",
        graphic: "edit",
        motion_picture: "videocam",
        "article-journal": "timeline",
        "article-newspaper": "dashboard",
        article: "description",
        "post-weblog": "content_paste",
        speech: "subtitles",
        patent: "card_membership",
        song: "mic",
        book: "developer_board",
        legislation: "assignment",
        bill: "account_balance",
      };

      const dataSorter = () => {
        for (let i = 0; i < docs.length; i++) {
          let doc = docs[i].items;

          doc.forEach((d) => {
            if (d.issued) {
              if (
                d.issued.hasOwnProperty("date-parts") //&&
                //  d.issued["date-parts"][0].length === 3
              ) {
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
                /* 
                  d.date =
                    d.issued["date-parts"][0][0] +
                    "-" +
                    d.issued["date-parts"][0][1] +
                    "-" +
                    d.issued["date-parts"][0][2];
   
                  d.date = parseTime(d.date);
  */
                d.date = parseTime(d.rebuildDate);

                d.category = docs[i].name;
                d.clusterDate = year + "-" + month + "-" + "15";
                d.code = d.category + "-" + d.clusterDate;
                d.type = csl_material[d.type];
                d.authors = [];

                if (d.author) {
                  for (let j = 0; j < d.author.length; j++) {
                    let element = d.author[j].given + " " + d.author[j].family;
                    d.authors.push(element);
                  }
                }

                nodeDocs.push(d);
              } else {
                d.toPurge = true;
              }
            } else {
              d.toPurge = true;
            }

            for (const key in d) {
              propertySet.add(key);
            }

            if (d.hasOwnProperty("enrichment")) {
              for (const key in d.enrichment) {
                propertySet.add(key);
                d[key] = d.enrichment[key];
              }
            }
          });
        }
      };

      dataSorter();

      const linkByProperty = (prop) => {
        const perspective = {};

        currentNodes.forEach((d) => {
          if (d.hasOwnProperty(prop)) {
            d[prop].forEach((b) => {
              if (!perspective.hasOwnProperty(b)) {
                perspective[b] = [];
              }
              perspective[b].push(d.id);
            });
          }
        });
        Object.values(perspective).forEach((b) => {
          if (b.length > 1) {
            for (let i = 0; i < b.length; i++) {
              for (let j = i; j < b.length; j++) {
                if (i != j) {
                  links.push({ source: b[i], target: b[j] });
                }
              }
            }
          }
        });
      };

      var firstDate = d3.min(nodeDocs, (d) => d.date);
      var lastDate = d3.max(nodeDocs, (d) => d.date);

      x.domain([firstDate, lastDate]).nice();

      var midDate;
      //Dates can be negative, which can make midDate trickier than usual to find
      let d1 = firstDate.getTime();
      let d2 = lastDate.getTime();

      if ((d1 > 0 && d2 > 0) || (d1 < 0 && d2 < 0)) {
        midDate = new Date(d1 + (d2 - d1) / 2);
      } else if (d1 < 0 && d2 > 0) {
        midDate = new Date(d1 + (Math.abs(d1) + d2) / 2);
      }

      var dateAmount = [];

      let currentDate = new Date(firstDate.getTime()); // duplicate date
      let finalDate = new Date(lastDate.getTime()); // duplicate date

      currentDate.setMonth(currentDate.getMonth() - 1); //add starting offset to make sure borders are included
      finalDate.setMonth(finalDate.getMonth() + 1);

      while (currentDate < finalDate) {
        var month = currentDate.getUTCMonth();
        var year = currentDate.getFullYear();
        var thisDate =
          JSON.stringify(year) + "-" + JSON.stringify(month + 1) + "-15";
        dateAmount.push(thisDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const clustersNest = d3.group(
        nodeDocs,
        (d) => d.category,
        (d) => d.clusterDate
      );
      const areaRad = [];
      let zoneCount = 0;

      y.domain([0, clustersNest.size + 1]);

      clustersNest.forEach((cluster) => {
        let radAreaData = {};
        radAreaData.zone = zoneCount;

        let radialVal = {};

        dateAmount.forEach(
          (d) =>
            (radialVal[d] = {
              key: d,
              date: parseTime(d),
              value: 0,
              zone: zoneCount,
            })
        );

        cluster.forEach((val, key) => {
          val.forEach((d) => (d.zone = zoneCount));

          if (radialVal[key] && val.length > 0) {
            radialVal[key].value = val.length;
          } else {
            window.electron.send(
              "console-logs",
              "error generating bar at" + JSON.stringify(val)
            );
          }

          if (val.length > maxDocs) {
            maxDocs = val.length;
          }
        });

        radAreaData.radialVal = Object.values(radialVal);
        areaRad.push(radAreaData);
        zoneCount++;
      });

      // errors here, must be foreach
      /*
              nodeDocs.forEach((d) => {
                  let mapcount=0
                  clustersNest.forEach((clust,key)=>{
                      if (key === d.category) { 
                          d.zone = mapcount;
                      }
                      mapcount++
                  })
              });
  */

      //========= CHART DISPLAY ===========
      var radialBars = view.append("g").attr("id", "radialBars");

      areaRad.forEach((corpus) => {
        radialBars
          .append("g")
          .attr("id", "radArea" + corpus.zone)
          .selectAll("path")
          .data(corpus.radialVal)
          .enter()
          .append("path")
          .attr("stroke", color(corpus.zone))
          .attr("fill", color(corpus.zone))
          .style("opacity", 0.5)
          .attr("d", (d) => (d.value > 0 ? arcBars(d) : ""));
      });

      //==========  NODE SUB-GRAPHS =======
      // Each cluster contains documents, i.e. each "circle" contains "nodes" which are force graphs
      var simulation = d3
        .forceSimulation() // starting simulation
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.04) // "Decay" value
        .force(
          "link",
          d3
            .forceLink()
            .distance(0)
            .strength(0)
            .id((d) => d.id)
        )
        .force(
          "collision",
          d3
            .forceCollide() // nodes can collide
            .radius(1.5) // if expanded is true, they collide with a force superior to 0
            .iterations(2)
            .strength(0.1)
        )
        .force(
          "x",
          d3
            .forceX()
            .strength(0.1) // nodes are attracted to their X origin
            .x(
              (d) => d3.pointRadial(x(d.date), y(d.zone - clustersNest.size))[0]
            )
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(0.1) // nodes are attracted to their X origin
            .y(
              (d) => d3.pointRadial(x(d.date), y(d.zone - clustersNest.size))[1]
            )
        );

      //Declaring node variables
      var node = view.selectAll("nodes"),
        //nodetext = view.selectAll("nodetext"),
        link = view.selectAll("link");

      simulation
        .nodes(currentNodes) // Start the force graph with "docs" as data
        .on("tick", ticked); // Start the "tick" for the first time

      simulation
        .force("link") // Create the links
        .links(links); // Data for those links is "links"

      function ticked() {
        // Actual force function
        link
          .attr("x1", (d) => d.source.x) // Links coordinates
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node
          .attr("cx", (d) => d.x) // Node coordinates
          .attr("cy", (d) => d.y);

        /* nodetext // Nodetext (doc number) coordinates
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y); */
      }

      // Circular Brush, based on Elijah Meeks https://github.com/emeeks/d3.svg.circularbrush

      var currentBrush;

      function circularbrush() {
        var _extent = [0, Math.PI * 2];
        var _arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        var _brushData = [
          {
            startAngle: _extent[0],
            endAngle: _extent[1],
            class: "extent",
          },
          {
            startAngle: _extent[0] - 0.2,
            endAngle: _extent[0],
            class: "resize e",
          },
          {
            startAngle: _extent[1],
            endAngle: _extent[1] + 0.2,
            class: "resize w",
          },
        ];
        var _newBrushData = [];
        var d3_window = d3.select(window);
        var _origin;
        var _brushG;
        var _handleSize = 0.1;
        var _scale = d3.scaleLinear().domain(_extent).range(_extent);
        var _tolerance = 0.00001;

        function _circularbrush(_container) {
          updateBrushData();

          _brushG = _container.append("g").attr("class", "circularbrush");

          _brushG
            .selectAll("path.circularbrush")
            .data(_brushData)
            .enter()
            .insert("path", "path.resize")
            .attr("d", _arc)
            .attr("stroke", "red")
            .attr("class", function (d) {
              return d.class + " circularbrush";
            });

          _brushG.select("path.extent").on("mousedown.brush", (event) => {
            resizeDown(event);
          });

          _brushG.selectAll("path.resize").on("mousedown.brush", (event) => {
            resizeDown(event);
          });

          return _circularbrush;
        }

        _circularbrush.extent = function (_value) {
          var _d = _scale.domain();
          var _r = _scale.range();

          var _actualScale = d3
            .scaleLinear()
            .domain([-_d[1], _d[0], _d[0], _d[1]])
            .range([_r[0], _r[1], _r[0], _r[1]]);

          if (!arguments.length)
            return [_actualScale(_extent[0]), _actualScale(_extent[1])];

          _extent = [_scale.invert(_value[0]), _scale.invert(_value[1])];

          return this;
        };

        _circularbrush.handleSize = function (_value) {
          if (!arguments.length) return _handleSize;

          _handleSize = _value;
          _brushData = [
            {
              startAngle: _extent[0],
              endAngle: _extent[1],
              class: "extent",
            },
            {
              startAngle: _extent[0] - _handleSize,
              endAngle: _extent[0],
              class: "resize e",
            },
            {
              startAngle: _extent[1],
              endAngle: _extent[1] + _handleSize,
              class: "resize w",
            },
          ];
          return this;
        };

        _circularbrush.innerRadius = function (_value) {
          if (!arguments.length) return _arc.innerRadius();

          _arc.innerRadius(_value);
          return this;
        };

        _circularbrush.outerRadius = function (_value) {
          if (!arguments.length) return _arc.outerRadius();

          _arc.outerRadius(_value);
          return this;
        };

        _circularbrush.range = function (_value) {
          if (!arguments.length) return _scale.range();

          _scale.range(_value);
          return this;
        };

        _circularbrush.arc = function (_value) {
          if (!arguments.length) return _arc;

          _arc = _value;
          return this;
        };

        _circularbrush.tolerance = function (_value) {
          if (!arguments.length) return _tolerance;

          _tolerance = _value;
          return this;
        };

        _circularbrush.filter = function (_array, _accessor) {
          var data = _array.map(_accessor);

          var extent = _circularbrush.extent();
          var start = extent[0];
          var end = extent[1];
          var firstPoint = _scale.range()[0];
          var lastPoint = _scale.range()[1];
          var filteredArray = [];
          var firstHalf = [];
          var secondHalf = [];

          if (Math.abs(start - end) < _tolerance) {
            return _array;
          }

          if (start < end) {
            filteredArray = _array.filter(function (d) {
              return _accessor(d) >= start && _accessor(d) <= end;
            });
          } else {
            var firstHalf = _array.filter(function (d) {
              return _accessor(d) >= start && _accessor(d) <= lastPoint;
            });
            var secondHalf = _array.filter(function (d) {
              return _accessor(d) <= end && _accessor(d) >= firstPoint;
            });
            filteredArray = firstHalf.concat(secondHalf);
          }

          return filteredArray;
        };

        return _circularbrush;

        function resizeDown(event) {
          let d = event.currentTarget;
          var _mouse = d3.pointer(event);

          brushing = true;

          if (_brushData[0] === undefined) {
            _brushData[0] = d;
          }

          _originalBrushData = {
            startAngle: _brushData[0].startAngle,
            endAngle: _brushData[0].endAngle,
          };

          _origin = _mouse;

          switch (d.className.baseVal) {
            case "resize e circularbrush":
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "e");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;

            case "resize w circularbrush":
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "w");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;

            default:
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "extent");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;
          }
        }

        function resizeMove(event, _resize) {
          var _mouse = d3.pointer(event, _brushG.node());

          var _current = Math.atan2(_mouse[1], _mouse[0]);
          var _start = Math.atan2(_origin[1], _origin[0]);

          switch (_resize) {
            case "e":
              var clampedAngle = Math.max(
                Math.min(
                  _originalBrushData.startAngle + (_current - _start),
                  _originalBrushData.endAngle
                ),
                _originalBrushData.endAngle - 2 * Math.PI
              );

              if (
                _originalBrushData.startAngle + (_current - _start) >
                _originalBrushData.endAngle
              ) {
                clampedAngle =
                  _originalBrushData.startAngle +
                  (_current - _start) -
                  Math.PI * 2;
              } else if (
                _originalBrushData.startAngle + (_current - _start) <
                _originalBrushData.endAngle - Math.PI * 2
              ) {
                clampedAngle =
                  _originalBrushData.startAngle +
                  (_current - _start) +
                  Math.PI * 2;
              }

              var _newStartAngle = clampedAngle;
              var _newEndAngle = _originalBrushData.endAngle;

              break;

            case "w":
              var clampedAngle = Math.min(
                Math.max(
                  _originalBrushData.endAngle + (_current - _start),
                  _originalBrushData.startAngle
                ),
                _originalBrushData.startAngle + 2 * Math.PI
              );

              if (
                _originalBrushData.endAngle + (_current - _start) <
                _originalBrushData.startAngle
              ) {
                clampedAngle =
                  _originalBrushData.endAngle +
                  (_current - _start) +
                  Math.PI * 2;
              } else if (
                _originalBrushData.endAngle + (_current - _start) >
                _originalBrushData.startAngle + Math.PI * 2
              ) {
                clampedAngle =
                  _originalBrushData.endAngle +
                  (_current - _start) -
                  Math.PI * 2;
              }

              var _newStartAngle = _originalBrushData.startAngle;
              var _newEndAngle = clampedAngle;

              break;

            default:
              var _newStartAngle =
                _originalBrushData.startAngle + (_current - _start * 1);
              var _newEndAngle =
                _originalBrushData.endAngle + (_current - _start * 1);
              break;
          }

          _newBrushData = [
            {
              startAngle: _newStartAngle,
              endAngle: _newEndAngle,
              class: "extent",
            },
            {
              startAngle: _newStartAngle - _handleSize,
              endAngle: _newStartAngle,
              class: "resize e",
            },
            {
              startAngle: _newEndAngle,
              endAngle: _newEndAngle + _handleSize,
              class: "resize w",
            },
          ];

          brushRefresh();

          if (_newStartAngle > Math.PI * 2) {
            _newStartAngle = _newStartAngle - Math.PI * 2;
          } else if (_newStartAngle < -(Math.PI * 2)) {
            _newStartAngle = _newStartAngle + Math.PI * 2;
          }

          if (_newEndAngle > Math.PI * 2) {
            _newEndAngle = _newEndAngle - Math.PI * 2;
          } else if (_newEndAngle < -(Math.PI * 2)) {
            _newEndAngle = _newEndAngle + Math.PI * 2;
          }

          _extent = [_newStartAngle, _newEndAngle];
        }

        function brushRefresh() {
          _brushG
            .selectAll("path.circularbrush")
            .data(_newBrushData)
            .attr("d", _arc);

          currentBrush = [
            x.invert(brush.extent()[0]),
            x.invert(brush.extent()[1]),
          ];

          brushLegendE
            .attr(
              "x",
              (d) => d3.pointRadial(x(currentBrush[0]), outerRadius + 10)[0]
            )
            .attr(
              "y",
              (d) => d3.pointRadial(x(currentBrush[0]), outerRadius + 10)[1]
            )
            .attr("text-anchor", () => {
              if (currentBrush[0] < midDate) {
                return "start";
              } else {
                return "end";
              }
            })
            .text(
              currentBrush[0].getDate() +
                "/" +
                parseInt(currentBrush[0].getMonth() + 1) +
                "/" +
                currentBrush[0].getFullYear()
            );

          brushLegendW
            .attr(
              "x",
              (d) => d3.pointRadial(x(currentBrush[1]), outerRadius + 10)[0]
            )
            .attr(
              "y",
              (d) => d3.pointRadial(x(currentBrush[1]), outerRadius + 10)[1]
            )
            .attr("text-anchor", () => {
              if (currentBrush[1] < midDate) {
                return "start";
              } else {
                return "end";
              }
            })
            .text(
              currentBrush[1].getDate() +
                "/" +
                parseInt(currentBrush[1].getMonth() + 1) +
                "/" +
                currentBrush[1].getFullYear()
            );
        }

        function extentUp(event) {
          // there is an update pattern issue. To be continued.

          // tooltip clearup
          while (tooltip.firstChild) {
            tooltip.removeChild(tooltip.lastChild);
          }

          _brushData = _newBrushData;

          d3_window.on("mousemove.brush", null).on("mouseup.brush", null);

          brushing = false;

          currentNodes = [];
          links = [];

          function dateTest(node) {
            if (node.date > currentBrush[0] && node.date < currentBrush[1]) {
              return true;
            } else return false;
          }

          currentNodes = nodeDocs.filter((d) => dateTest(d));

          // sort Nodes by date
          currentNodes = currentNodes.sort((a, b) => a.date - b.date);

          var currentList = [];

          currentNodes.forEach((d) => {
            // add doc to current list
            currentList.push({
              title: d.title,
              id: d.id,
              zone: d.zone,
              DOI: d.DOI,
            });
          });

          var currentDocList = document.createElement("OL");

          currentList.forEach((d) => {
            let docTitle = document.createElement("LI");
            docTitle.style.color = color(d.zone);
            docTitle.id = "list-" + d.id;
            docTitle.innerText = d.title;
            docTitle.addEventListener("click", (e) => displayDoc(d));
            docTitle.addEventListener("mouseover", (e) => {
              node.style("opacity", ".2");
              document.getElementById("node" + d.id).style.opacity = 1;
              d3.selectAll("line").style("opacity", 0.1);
              links.forEach((link) => {
                if (link.source.id === d.id) {
                  document.getElementById(
                    "link" + link.source.id + "-" + link.target.id
                  ).style.opacity = 1;
                }
              });
            });
            docTitle.addEventListener("mouseout", (e) => {
              node.style("opacity", 1);
              d3.selectAll("line").style("opacity", 1);
            });

            currentDocList.appendChild(docTitle);
          });

          tooltip.appendChild(currentDocList);

          linkByProperty(previousCriteriaSelected);

          node = node
            .data(currentNodes, (item) => item) // Select all relevant nodes
            .join("circle") // Append the nodes
            .attr("r", 1) // Node radius
            .attr("fill", (d) => color(d.zone)) // Node color
            .attr("id", (d) => "node" + d.id) // Node ID (based on code)
            .attr("stroke", (d) => color(d.zone)) // Node stroke color
            //.attr("stroke-opacity", 1) // Node stroke color
            .attr("stroke-width", 0.1) // Node stroke width
            .style("cursor", "context-menu") // Type of cursor on node hover
            //.style("opacity", 0.9) // Node opacity
            .raise() // Nodes are displayed above the rest
            .merge(node)
            .lower(); // Merge the nodes then lower them

          node.on("mouseover", (e, d) => {
            for (let i = 0; i < currentDocList.children.length; i++) {
              const element = currentDocList.children[i];
              element.style.opacity = 0.2;
            }

            const target = document.getElementById("list-" + d.id);

            target.style.opacity = 1;
            target.style.scrollMarginTop = "20px";
            target.scrollIntoView({ behavior: "smooth", inline: "nearest" });
          });

          node.on("click", (e, d) => {
            const circle = d3.select(e.target); // Select this node

            node.style("opacity", 0.1); // Dim all nodes
            circle.style("opacity", 0.9); // Highlight this specific node
            link.style("stroke-opacity", (l) =>
              l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
            );

            displayDoc(d);
          });

          dragger.on("mouseover", (e, d) => {
            for (let i = 0; i < currentDocList.children.length; i++) {
              const element = currentDocList.children[i];
              element.style.opacity = 1;
            }
          });

          dragger.on("click", (e, d) => {
            link.style("stroke-opacity", 1).style("opacity", 1);
            node.style("opacity", 1);
            tooltip.innerHTML = ""; // purge tooltip
            tooltip.appendChild(currentDocList); // repopulate with document list
          });

          link = link
            .data(links, (item) => item) // Select all relevant nodes
            .join("line") // Append the nodes
            .attr("fill", "red") // Node color
            .attr("id", (d) => "link" + d.source + "-" + d.target) // Node ID (based on code)
            .style("stroke", "red") // Node stroke color
            .style("stroke-width", 0.1) // Node stroke width
            .raise() // Nodes are displayed above the rest
            .merge(link)
            .lower();

          //Node icons are nodes displayed on top of Nodes
          /* nodetext = nodetext
              .data(currentNodes, (item) => item) // Select all relevant nodes
              .join("text") // Append the text
              .attr("dy", 0.8) // Relative Y position to each node
              .attr("id", (d) => d.id) // ID
              .style("fill", "white") // Icon color
              .style("font-size", "2.5px") // Icon size
              .style("font-weight", "bolder") // Icon size
              .attr("text-anchor", "middle")
              .style("display", "none")
              .text((d) => {
                for (let i = 0; i < currentNodes.length; i++) {
                  if (d.id === currentNodes[i].id) {
                    return JSON.stringify(i + 1);
                  }
                }
              }) // Icon
              //.on("click", d => {
              // shell.openExternal("https://dx.doi.org/" + d.DOI);
              // }) // On click, open url in new tab
              .raise() // Display above nodes and the rest
              .merge(nodetext); // Merge the nodes
  
            nodetext.append("title").text((d) => d.title); // Hovering a node displays its title as "alt"
   */
          simulation.nodes(currentNodes);
          simulation.force("link").links(links);
          simulation.alpha(1).restart();
        }

        function updateBrushData() {
          _brushData = [
            {
              startAngle: _extent[0],
              endAngle: _extent[1],
              class: "extent",
            },
            {
              startAngle: _extent[0] - _handleSize,
              endAngle: _extent[0],
              class: "resize e",
            },
            {
              startAngle: _extent[1],
              endAngle: _extent[1] + _handleSize,
              class: "resize w",
            },
          ];
        }
      }

      var brush = circularbrush()
        .range([0, 2 * Math.PI])
        .innerRadius(innerRadius - 5)
        .outerRadius(outerRadius + 15);

      var brushLegendE = view
        .append("g")
        .attr("id", "brushLegendE")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .append("text")
        .text("");

      var brushLegendW = view
        .append("g")
        .attr("id", "brushLegendW")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .append("text")
        .text("");

      var radialBrush = view
        .append("g")
        .attr("stroke", "gray")
        .style("opacity", 0.5)
        .attr("fill", "transparent")
        .attr("id", "brush")
        .call(brush);

      d3.selectAll("path.resize")
        .attr("fill", "gray")
        .style("opacity", 0.5)
        .style("cursor", "grab");

      d3.select("path.extent").style("cursor", "move");

      var firstDate = d3.min(nodeDocs, (d) => d.date);
      var lastDate = d3.max(nodeDocs, (d) => d.date);

      x.domain([firstDate, lastDate]).nice();

      function dateFormat() {
        if (lastDate.getYear() - firstDate.getYear() > 20) {
          return d3.utcFormat("%Y");
        } else if (lastDate.getYear() - firstDate.getYear() > 2) {
          return d3.utcFormat("%m/%Y");
        } else {
          return d3.utcFormat("%d/%m/%Y");
        }
      }

      var xticks = x.ticks(20);
      xticks.shift();

      var xAxis = (g) =>
        g
          .attr("font-family", "sans-serif")
          .attr("font-size", 8)
          .attr("text-anchor", "middle")
          .attr("id", "xAxis")
          .call((g) =>
            g
              .selectAll("g")
              .data(xticks)
              .join("g")
              .each((d, i) => (d.id = JSON.stringify(d)))
              .call((g) =>
                g
                  .append("path")
                  .attr("stroke", "#000")
                  .attr("stroke-opacity", 0.2)
                  .attr(
                    "d",
                    (d) => `
                  M${d3.pointRadial(x(d), innerRadius - 10)}
                  L${d3.pointRadial(x(d), outerRadius + 20)}
                `
                  )
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("x", (d) => d3.pointRadial(x(d), innerRadius - 30)[0])
                  .attr("y", (d) => d3.pointRadial(x(d), innerRadius - 30)[1])
                  .text(dateFormat())
                  .clone(true)
                  .lower()
                  .attr("stroke", "white")
              )
          );

      view.append("g").call(xAxis);

      var yAxis = (g) =>
        g
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("id", "yAxis")
          .call((g) =>
            g
              .selectAll("g")
              .data(y.ticks().reverse())
              .join("g")
              .attr("fill", "none")
              .call((g) =>
                g
                  .append("circle")
                  .attr("stroke", (d) => {
                    if (Number.isInteger(d) && d < clustersNest.length) {
                      return color(d);
                    } else {
                      return "rgba(0,0,0,.2)";
                    }
                  })
                  .attr("r", y)
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("y", (d) => -y(d + 0.5))
                  .attr("dy", "0.35em")
                  .attr("stroke", "#fff")
                  .attr("stroke-width", 1)
                  .text((d) => {
                    if (Number.isInteger(d) && d < clustersNest.length) {
                      return clustersNest[d].key;
                    }
                  })
                  .clone(true)
                  .attr("y", (d) => y(d + 0.5))
                  .selectAll(function () {
                    return [this, this.previousSibling];
                  })
                  .clone(true)
                  .attr("fill", "currentColor")
                  .attr("stroke", "none")
              )
          );

      view.append("g").call(yAxis);

      d3.selectAll("text").style("user-select", "none");
      radialBrush.raise();
      // brushCircle.lower();

      const availableProperties = [...propertySet];

      var previousCriteriaSelected = "";

      const radioMenu = document.createElement("div");

      availableProperties.forEach((d) => {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = d;
        radio.name = "selectCriteria";
        const label = document.createElement("label");
        label.innerText = d;
        label.setAttribute("for", "selectCriteria");

        const line = document.createElement("br");

        radio.addEventListener("click", () => {
          link.remove();
          linkByProperty(d);
          previousCriteriaSelected = d;

          link = link
            .data(links, (item) => item) // Select all relevant nodes
            .join("line") // Append the nodes
            .attr("fill", "red") // Node color
            .attr("id", (d) => "link" + d.source + "-" + d.target) // Node ID (based on code)
            .style("stroke", "red") // Node stroke color
            .style("stroke-width", 0.1) // Node stroke width
            .raise() // Nodes are displayed above the rest
            .merge(link)
            .lower();

          simulation.force("link").links(links);
          simulation.alpha(1).restart();
        });

        radioMenu.append(radio, label, line);
      });

      iconCreator(
        "sort-icon",
        () => {
          tooltip.innerHTML = "<h3>Select a link criteria</h3><hr>"; // purge tooltip
          tooltip.append(radioMenu);
        },
        "Sort by property"
      );

      loadType();
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Chronotype error: dataset " + id + " is invalid."
      );
      console.log(error);
    });
  //======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========
  let dragger = svg
    .append("rect")
    .attr("x", -width)
    .attr("y", -height)
    .attr("width", width * 2)
    .attr("height", height * 2)
    .attr("fill", "white")
    .style("cursor", "all-scroll")
    .lower();

  dragger.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming
  //.on("mousedown.zoom", d=>{if(brushing){return null}})

  zoomed = (thatZoom) => {
    //thatZoom.x=0;
    //thatZoom.y=0,
    view.attr("transform", thatZoom);
  };

  window.electron.send("console-logs", "Starting chronotype"); // Starting Chronotype
}; // Close Chronotype function
