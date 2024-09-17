import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";
import { pandodb } from "../../db";
import { dataDownload } from "../data-manager-type";

// ========= ANTHROPOTYPE =========
const anthropotype = (id) => {
  // When called, draw the anthropotype

  //========== SVG VIEW =============
  const svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node

  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  const bgrect = svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white");

  const view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([-Infinity, Infinity]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    });

  var criteriaList = [];
  var currentCriteria = [];

  //======== CURRENT WIP =========

  // Create a more elaborate tooltip
  // that lets users create a tag (text + color)
  // and then apply that tag to nodes

  //======== DATA CALL & SORT =========
  pandodb.anthropotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var docData = [];

      if (datajson.content.length === 1) {
        docData = datajson.content[0].items;
      } else {
        for (let i = 0; i < datajson.content.length; i++) {
          datajson.content[i].items.forEach((e) => {
            e.color = i + 1;
            docData.push(e);
          });
        }
      }

      docData.forEach((d) => criteriaList.push(d.title));

      const menuBuilder = () => {
        const menu = document.createElement("div");
        menu.style = "display:flex;flex-direction: column;";

        const buttons = document.createElement("div");

        buttons.style =
          "padding:5px;border:1px solid black;display: flex;justify-content: space-around;";

        const criteriaButton = document.createElement("div");
        criteriaButton.innerText = "Document List";
        criteriaButton.style.cursor = "pointer";

        const tagButton = document.createElement("div");
        tagButton.innerText = "Tags";
        tagButton.style.cursor = "pointer";

        buttons.append(criteriaButton, tagButton);

        const menuContent = document.createElement("div");

        menu.append(buttons, menuContent);

        function populateCriteria() {
          menuContent.innerHTML = "";
          criteriaList.forEach((d) => {
            let crit = document.createElement("div");
            crit.className = "criteriaTab";
            crit.style.borderBottom = "1px solid #141414";
            crit.style.marginBottom = "5px";
            crit.style.cursor = "pointer";
            crit.id = d;
            crit.innerHTML = d;
            crit.onclick = function () {
              cartoSorter(d);
            };
            menuContent.appendChild(crit);
          });
        }

        populateCriteria();

        function populateTags() {
          menuContent.innerHTML = "";
        }

        criteriaButton.addEventListener("click", populateCriteria);

        tagButton.addEventListener("click", populateTags);

        document.getElementById("tooltip").append(menu);
      };

      //========== FORCE GRAPH ============
      var simulation = d3
        .forceSimulation() // Start the force graph
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.01) // "Decay" value
        .force(
          "link",
          d3
            .forceLink() // Links has specific properties
            .strength(0.08) // Defining non-standard strength value
            .id((d) => d.id)
        ) // Defining an ID (used to compute link data)
        .force("collision", d3.forceCollide(5).iterations(5)) // Nodes collide with each other (they don't overlap)
        .force(
          "charge",
          d3.forceManyBody().strength((d) => {
            let str = -70;
            if (d.hasOwnProperty("author")) {
              str = str - d.author.length * 35;
            }
            return str;
          })
        ) // Adding ManyBody to repel nodes from each other
        .force("center", d3.forceCenter(width / 2, height / 2)); // The graph tends towards the center of the svg

      var link = view.append("g").selectAll("link");
      var node = view.append("g");

      const ticked = () => {
        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      };

      const cartoSorter = (criteria) => {
        document.getElementById("tooltip").innerHTML = "";

        menuBuilder();
        node.remove();
        link.remove();
        simulation.alpha(1).restart();

        let criteriaIndex = currentCriteria.indexOf(criteria);

        if (criteriaIndex < 0) {
          currentCriteria.push(criteria);
          document.getElementById(criteria).style.backgroundColor = "black";
          document.getElementById(criteria).style.color = "white";
          var newCriteria = { given: "" };
          newCriteria.family = criteria;
        } else {
          currentCriteria.splice(criteriaIndex, 1);
          document.getElementById(criteria).style.backgroundColor = "white";
          document.getElementById(criteria).style.color = "black";
        }

        let data = [];
        let dataCheck = [];
        let links = [];

        currentCriteria.forEach((criteria) => {
          docData.forEach((doc) => {
            if (doc.title === criteria) {
              doc.id = doc.title;
              if (doc.hasOwnProperty("author")) {
                doc.author.forEach((auth) => {
                  let checkCode = auth.family + auth.given;
                  if (dataCheck.indexOf(checkCode) < 0) {
                    dataCheck.push(checkCode);
                    auth.crit = [];
                    auth.crit.push(doc.title);
                    data.push(auth);
                  } else {
                    for (let j = 0; j < data.length; j++) {
                      if (
                        data[j].family === auth.family &&
                        data[j].given === auth.given
                      ) {
                        data[j].crit.push(doc.title);
                      }
                    }
                  }
                });
              }
            }
          });
        });

        data.forEach((d) => {
          d.id = d.given + " " + d.family;
          d.crit.forEach((crit) => {
            let link = {};
            link.source = d.id;
            link.target = crit;
            links.push(link);
          });
        });

        docData.forEach((doc) => {
          for (let i = 0; i < currentCriteria.length; i++) {
            if (currentCriteria[i] === doc.title) {
              data.push(doc);
            }
          }
        });

        link = view
          .selectAll("link") // Creatin the link variable
          .exit()
          .remove()
          .data(links) // Link data is stored in the "links" variable
          .enter()
          .append("line")
          .attr("stroke", "#d3d3d3")
          .style("fill", "none");

        node = view
          .selectAll("g")
          .exit()
          .remove()
          .data(data)
          .join("g")
          .attr("id", (d) => d.id)

          .call(
            d3
              .drag()
              .on("start", forcedragstarted)
              .on("drag", forcedragged)
              .on("end", forcedragended)
          );

        node
          .append("circle")
          .attr("r", (d) => {
            let r = 7;
            if (d.hasOwnProperty("author")) {
              r = r + d.author.length * 4;
            }
            return r;
          })
          .attr("fill", (d) => (d.hasOwnProperty("color") ? d.color : "gray"))
          .attr("opacity", 0.3)
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        node
          .append("text")
          .attr("class", "humans")
          .attr("dx", "10")
          .attr("dy", "4")
          .style("fill", "black")
          .style("font-size", "15px")
          .style("font-family", "sans-serif")
          .text((d) => d.id)
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4);

        // The data selection below is very suboptimal, this is a quick hack that needs to be refactored
        /*
          bgrect.on("click", () => {
                      document.getElementById("tooltip").innerHTML = "";
                    menuBuilder();
          });
                    */
        const displaySelectionTooltip = (e, d) => {
          document.getElementById("tooltip").innerHTML = "";

          const tooltitle = document.createElement("div");

          const colorChoice = document.createElement("input");
          colorChoice.type = "color";

          // if document
          if (d.hasOwnProperty("title")) {
            tooltitle.innerHTML = `<h2>Labelling for document "${d.id}"</h2>`;

            colorChoice.addEventListener("change", () => {
              d3.select(document.getElementById(d.id))
                .select("circle")
                .attr("fill", colorChoice.value);
              d.author.forEach((auth) => {
                let nodeGroup = document.getElementById(auth.id);
                d3.select(nodeGroup)
                  .select("circle")
                  .attr("fill", colorChoice.value);
              });
              d.color = colorChoice.value;
            });

            // else if author
          } else {
            tooltitle.innerHTML = `<h4>Labelling for author "${d.id}"</h4>`;

            colorChoice.addEventListener("change", () => {
              d.color = colorChoice.value;
              d.crit.forEach((e) => {
                d3.select(document.getElementById(e))
                  .select("circle")
                  .attr("fill", colorChoice.value);
                data.forEach((f) => {
                  if (f.title === e) {
                    f.author.forEach((auth) => {
                      let nodeGroup = document.getElementById(auth.id);
                      d3.select(nodeGroup)
                        .select("circle")
                        .attr("fill", colorChoice.value);
                    });
                  }
                });
              });
            });
          }

          document.getElementById("tooltip").append(tooltitle, colorChoice);
        };

        node.style("cursor", "pointer");

        node.on("click", function (e, d) {
          displaySelectionTooltip(e, d);
        });

        simulation.nodes(data).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
      };

      function forcedragstarted(event, d) {
        if (!event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function forcedragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function forcedragended(event, d) {
        if (!event.active) simulation.alpha(1).restart();
        d.fx = null;
        d.fy = null;
      }

      function toggleCrit() {
        if (currentCriteria.length > 0) {
          currentCriteria = [];
        } else {
          criteriaList.forEach((d) => cartoSorter(d));
        }
      }

      iconCreator("sort-icon", toggleCrit, "Toggle criteria");

      loadType();
      menuBuilder();
      cartoSorter(docData[0].title);
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Anthropotype error: dataset " + id + " is invalid."
      );
    });

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom, transTime) => {
    view.attr("transform", thatZoom);
  };

  window.electron.send("console-logs", "Starting anthropotype");
};

export { anthropotype };
