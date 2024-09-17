import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";
import { pandodb } from "../../db";
import { dataDownload } from "../data-manager-type";

// ========= ARCHOTYPE =========
const archotype = (id) => {
  // When called, draw the archotype

  var availability;

  //========== SVG VIEW =============
  const svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node

  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  const zoom = d3.zoom();

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
    ]);
  /* .on("zoom", ({ transform }, d) => {
        zoomed(transform);
      }); */

  var criteriaList = [];
  var currentCriteria = [];

  let resolver, arkViewer;

  window.electron.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);

    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          resolver =
            availability.dnsLocalServiceList[service].url +
            ":" +
            availability.dnsLocalServiceList[service].port;

          arkViewer = availability.dnsLocalServiceList[service].arkViewer;

          break;
      }
    }
  });

  // size is probably not good as such, to be updated

  let ma = 4;
  let mb = ma / 2;

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 55)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "black")
    .attr("stroke", "gray")
    .attr("stroke-width", 0.2)
    .attr("d", "M 0,-2 L 4 ,0 L 0,2");

  const toolContent = document.createElement("div");

  var captureTimeline;

  //======== DATA CALL & SORT =========

  pandodb.archotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      const documents = datajson.content[0].items;

      var nodeData = [];
      var linkData = [];

      const nodemap = {};

      const domainMap = {};

      // divider is here for dev/testing purpose, when the testing machine cannot handle
      // a corpus with too many documents.
      const divider = 1;

      const documentMap = {};

      for (let i = 0; i < documents.length / divider; ++i) {
        const d = documents[i];

        const coreURL = d.URL.replace(arkViewer, "");

        const parsedURL = new URL(coreURL.substring(coreURL.indexOf("http")));
        // console.log(id)

        const id = parsedURL.href;

        documentMap[id] = d;

        const elem = {
          id,
          title: d.title,
          domain: false,
          type: "capture",
          color: "blue",
        };

        // To establish the domain, one could in theory use the "container-title" property
        // however this proves to be unreliable accross time, collection and captures.
        // hence the need to rebuild it manually.

        const domain = parsedURL.host;
        d.domain = false;

        if (!domainMap.hasOwnProperty(domain)) {
          // A domain node doesn't exist in the dataset, it is just a way to group
          // all page captures together, by binding them to their host
          //console.log(domain)
          nodeData.push({
            id: domain,
            name: domain,
            domain: true,
            type: "domain",
            color: "orange",
          });
        }

        // add direction to links too !

        // link type 1 - describe here
        // A gray link is a link between a domain node
        // and a page capture node.

        linkData.push({
          source: elem.id,
          target: domain,
          color: "transparent",
          weight: 0.5,
          type: "page2domain",
        });

        nodeData.push(elem);
        nodemap[elem.id] = 1;
        domainMap[domain] = 1;
      }

      var ghostNodeMap = {};
      var ghostLinksMap = {};

      for (let i = 0; i < documents.length / divider; ++i) {
        const d = documents[i];

        const pageCaptureHypertextLinks = d.enrichment.links;

        // these hypertext links the page capture is listed as having

        if (pageCaptureHypertextLinks) {
          // d.URL is the complete permalink, with the URL of the hosting service / the timestamp
          // i.e. http://archivemachine.com/20090609015145/http://www.example.com/spip.php?document8683

          // sourceURL is d.URL without the hosting service and the timestamp, built as an URL object

          try {
            const sourceURL = new URL(
              d.URL.substring(d.URL.lastIndexOf("http"))
            );

            // source is the href of the sourceURL object
            // i.e. http://www.example.com/spip.php?document8683
            const source = sourceURL.href;

            // source host is the website host
            // i.e. www.example.com
            const sourceHost = sourceURL.host; // || source.hostname;

            if (nodemap.hasOwnProperty(source)) {
              // For each hypertext link the document is listed as having, check:
              // 1- if there is a direct link between pages at time of their latest capture (blue link)
              // 2- if there is a link between this page and another page of the target domain, but which isn't in the corpus

              pageCaptureHypertextLinks.forEach((target) => {
                var host;
                try {
                  const thisURL = new URL(target);
                  host = thisURL.host; //|| thisURL.hostname;
                } catch (error) {
                  console.log(error);
                  window.electron.send(
                    "console-logs",
                    "archotype error: url " + target + " is invalid."
                  );

                  //This will allow skipping the next part
                  host = "";
                }

                if (host.length > 2) {
                  if (nodemap.hasOwnProperty(target)) {
                    // link type 1 - blue

                    linkData.push({
                      source,
                      target,
                      color: "rgb(100,160,210)",
                      weight: 0.5,
                      type: "page2page",
                    });
                  } else if (
                    domainMap.hasOwnProperty(host) &&
                    host != sourceHost &&
                    host.indexOf(sourceHost) === -1 &&
                    sourceHost.indexOf(host) === -1
                  ) {
                    // link type 2 - orange
                    //deactivated for testing
                    /* linkData.push({
                      source,
                      target: host,
                      color: "rgb(255,140,10)",
                      weight: 0.5,
                      type: "pageNOTcorpus",
                    });
                     */
                  } else {
                    // this links to a page that wasn't captured, so add a ghost node+link;
                    ghostNodeMap[target] = 1;
                    ghostLinksMap[sourceURL + target] = {
                      source,
                      target,
                      color: "rgb(150,150,150)",
                      weight: 0.1,
                      type: "ghost",
                    };
                  }
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      // add ghosts nodes
      Object.keys(ghostNodeMap).forEach((d) =>
        nodeData.push({
          id: d,
          name: "",
          domain: false,
          type: "ghost",
          color: "rgb(150,150,150)",
        })
      );

      linkData = [...linkData, ...Object.values(ghostLinksMap)];

      // Get node groups
      // The decision here is to only list 1 degree common ghosts,
      // that is finding when two captures have a common outgoing links.

      window.electron.send("chaeros-notification", "rebuilding by domain");

      //========== REBUILDING CLUSTERS
      //This function is the first step.
      //It puts nodes belonging to the same domain
      //in a same group.
      //

      function groupCapturesByDomain() {
        // map all domains
        const domainMap = {};

        linkData.forEach((link) => {
          if (link.type === "page2domain") {
            if (!domainMap.hasOwnProperty(link.target)) {
              domainMap[link.target] = new Set();
            }
            domainMap[link.target].add(link.source);
          }
        });

        nodeData.forEach((node) => {
          for (const domain in domainMap) {
            if (domainMap[domain].has(node.id)) {
              node.group = domain;
            }
          }
        });
      }

      // This is the second step
      // grouping ghosts to captures;

      function groupGhostsByCapture() {
        const captureMap = {};

        // Map all captures and their ghosts
        linkData.forEach((link) => {
          if (link.type === "ghost") {
            if (!captureMap.hasOwnProperty(link.source)) {
              captureMap[link.source] = new Set();
            }
            captureMap[link.source].add(link.target);
          }
        });

        //create a map of nodes to get faster access
        //because RAM is free real estate

        const nodeMap = {};

        nodeData.forEach((n) => (nodeMap[n.id] = n));

        for (const capture in captureMap) {
          //for each capture, iterate over ghosts
          //and give tem the capture's group

          captureMap[capture].forEach(
            (ghostID) => (nodeMap[ghostID].group = nodeMap[capture].group)
          );
        }
      }

      // Link by capture to capture

      function groupByCaptureToCaptureLinks() {
        const linkSet = new Set();

        linkData.forEach((d) => {
          if (d.type === "page2page") {
            const sourceHost = new URL(d.source).host;
            const targetHost = new URL(d.target).host;

            if (sourceHost != targetHost) {
              linkSet.add({ sourceHost, targetHost });
            }
          }
        });

        // remove the symmetry
        const linkMap = {};

        linkSet.forEach((d) => {
          if (!linkMap.hasOwnProperty(d.targetHost + d.sourceHost)) {
            linkMap[d.sourceHost + d.targetHost] = d;
          }
        });

        const groupMap = {};

        for (const id in linkMap) {
          groupMap[linkMap[id].sourceHost] = id;
          groupMap[linkMap[id].targetHost] = id;
        }

        nodeData.forEach((node) => {
          if (groupMap.hasOwnProperty(node.group)) {
            node.group = groupMap[node.group];
          }
        });
      }

      // find ghosts who recieve more than 1 link
      // and see if these links come from nodes
      // coming from different groups

      function groupByGhostBridgeLinks() {
        // first, map all ghosts

        const ghostMap = {};

        nodeData.forEach((node) => {
          if (node.type === "ghost") {
            ghostMap[node.id] = node;
          }
        });

        const linkByTarget = {};

        // then, iterate on links and map them by target;

        linkData.forEach((link) => {
          if (link.type === "ghost") {
            if (!linkByTarget.hasOwnProperty(link.target)) {
              linkByTarget[link.target] = [];
            }
            linkByTarget[link.target].push(link);
          }
        });

        //prepare a nodemap
        const nodeMap = {};
        nodeData.forEach((n) => (nodeMap[n.id] = n));

        //store bridge links in an array
        const bridgeLinks = new Set();

        for (const target in linkByTarget) {
          const linksArray = linkByTarget[target];

          //if there is only one link, it cannot
          //be a bridge
          if (linksArray.length === 1) {
            delete linkByTarget[target];
          } else {
            linksArray.forEach((link) => {
              const sourceHost = new URL(link.source).host;
              const targetHost = new URL(link.target).host;

              if (sourceHost != targetHost) {
                bridgeLinks.add({ sourceHost, targetHost });
              }
            });
          }
        }

        // remove the multiples
        const linkMap = {};

        bridgeLinks.forEach((d) => (linkMap[d.sourceHost + d.targetHost] = d));

        //now map by targets
        const targetMap = {};

        Object.values(linkMap).forEach((target) => {
          if (!targetMap.hasOwnProperty(target.targetHost)) {
            targetMap[target.targetHost] = [];
          }
          targetMap[target.targetHost].push(target.sourceHost);
        });

        // now comes the tedious part
        // first, iterate over the map

        for (const target in targetMap) {
          // make an array of hosts that belong to the same group
          const hosts = targetMap[target];
          hosts.push(target);

          // make it a set
          const hostSet = new Set(hosts);

          //create a group name
          const groupName = "GROUPNAME:" + hosts.toString();

          //find the groups all these nodes belong to
          //and add them to a set

          const relevantGroups = new Set();

          nodeData.forEach((node) => {
            if (node.type != "domain") {
              const nodeHost = new URL(node.id).host;
              if (hostSet.has(nodeHost)) {
                relevantGroups.add(node.group);
              }
            }
          });

          // if they already belong to the same group,
          // no action needed. If not, these groups
          // need to be merged.

          if (relevantGroups.size > 1) {
            nodeData.forEach((node) => {
              if (relevantGroups.has(node.group)) {
                node.group = groupName;
              }
            });
          }
        }
      }

      // last pass, let the domains find their groups
      // that were lost in the process

      function reattributeDomains() {
        //prepare a nodemap
        const nodeMap = {};
        nodeData.forEach((n) => (nodeMap[n.id] = n));

        linkData.forEach((link) => {
          if (link.type === "page2domain") {
            nodeMap[link.target].group = nodeMap[link.source].group;
          }
        });
      }

      function groupNodes() {
        // step one, group captures by domain.
        groupCapturesByDomain();

        // step two, group ghosts by capture
        // and give them the domain name
        groupGhostsByCapture();

        // now all nodes have group.
        // next step is to connect clusters that link to one another.
        groupByCaptureToCaptureLinks();

        // last step is to connect the groups that link
        // to common ghosts

        groupByGhostBridgeLinks();

        // solve domains
        reattributeDomains();
      }

      groupNodes();

      /// ============ END OF REBUILDING CLUSTERS

      const nodegroupmap = {};

      nodeData.forEach((d) => {
        const groupName = d.group;
        if (!nodegroupmap.hasOwnProperty(groupName)) {
          nodegroupmap[groupName] = { nameParts: {}, nodes: [] };
        }

        nodegroupmap[groupName].nodes.push(d);

        if (d.domain) {
          nodegroupmap[groupName].nameParts[d.id] = 1;
        }
      });

      // circleSet is a set of ids. If a node has been clicked,
      // it is stored in the set. This was, the user knows which
      // circle they have clicked on before.
      const circleSet = new Set();

      // foundSet is also a set of ids. It is the same idea,
      // for ghost pages found in the archive.
      const foundSet = new Set();

      // =========================
      // data management is mostly above this line

      // below is visualisation

      // const g = svg.append("g");

      // Create a simulation with several forces.
      const simulation = d3
        .forceSimulation(nodeData)
        .force(
          "link",
          d3.forceLink(linkData).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody(-300).distanceMax(1000))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.5))
        .on("tick", ticked);

      // Set the position attributes of links and nodes each time the simulation ticks.
      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        nodetitle.attr("x", (d) => d.x).attr("y", (d) => d.y);
        titlecontrast
          .attr("x", (d) => d.x - d.name.length * 2)
          .attr("y", (d) => d.y - 7);
      }

      // Reheat the simulation when drag starts, and fix the subject position.
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      // Update the subject (dragged node) position during drag.
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      var currentSelection = 0;

      const nodeGroupArray = Object.values(nodegroupmap).sort(
        (a, b) => a.nodes.length - b.nodes.length
      );

      let clusterMeta = "";

      const selectedClusterMetadata = (
        localNodeData,
        localLinkData,
        node,
        link
      ) => {
        const div = document.getElementById("clusterMetaData");
        if (div) {
          // look for solo ghosts by mapping links

          const soloGhosts = new Set();
          const soloMap = {};
          localLinkData.forEach((l) => {
            if (l.target.type === "ghost") {
              if (!soloMap.hasOwnProperty(l.target.id)) {
                soloMap[l.target.id] = 0;
              }
              soloMap[l.target.id]++;
            }
          });

          for (const id in soloMap) {
            if (soloMap[id] < 2) {
              soloGhosts.add(id);
            }
          }

          const toggleSoloGhosts = (display) => {
            node.style("display", (n) => {
              if (soloGhosts.has(n.id)) {
                return display;
              }
            });
            link.style("display", (l) => {
              if (soloGhosts.has(l.target.id)) {
                return display;
              }
            });
          };

          // count node types to provide metadata to the user

          var counter = { ghosts: 0, captures: 0, domains: [] };

          localNodeData.forEach((n) => {
            switch (n.type) {
              case "capture":
                counter.captures++;
                break;

              case "ghost":
                counter.ghosts++;
                break;

              case "domain":
                counter.domains.push(n.id);
                break;

              default:
                break;
            }
          });

          clusterMeta = `<br><hr><br>For this corpus, this cluster contains: <br>
  - ${counter.captures} captured pages available in the archive<br>
  - ${counter.ghosts} pages "linked to pages" by the most recent available capture in the corpus, which might or might not be in the corpus<br>
  <br><br>
  The captures in this cluster come from ${counter.domains.length} domain(s):<br>
  `;

          div.innerHTML = clusterMeta;

          // add domains

          counter.domains.forEach((d) => {
            const host = document.createElement("div");
            host.innerText = "- " + d;
            host.className = "flux-button";
            host.style = "padding:0px;padding-left:3px;margin-top:3px;";
            host.addEventListener("click", () => {
              const domainNode = node
                .filter((n, i) => n.type === "domain" && n.id === d)
                .node();

              /* 
  
  // for now this is not going to be a thing
  // PANDORAE needs an electron version upgrade
  // and a dev env upgrade as well (using webpack)
  // which will enable using ESM & hence d3 v7
  
                console.log(domainNode);
  
                console.log(d3);
                console.log(d3.ZoomTransform);
                console.log(ZoomTransform);
  
                const transform = new d3.ZoomTransform( // only in d3 V7
                  1,
                  parseInt(domainNode.getAttribute("cx") - width / 2),
                  parseInt(domainNode.getAttribute("cy") - height / 2)
                );
  
                console.log(transform);
  
                zoomed(transform, 750); */
            });

            div.append(host);
          });

          // add ghost tickbox

          const ghostBox = document.createElement("div");
          const ghostTick = document.createElement("input");
          ghostTick.type = "checkbox";
          ghostTick.checked = true;
          ghostTick.id = "ghostTick";
          ghostTick.name = "ghostTick";
          const ghostLabel = document.createElement("label");
          ghostLabel.for = "ghostTick";
          ghostLabel.innerText = "Hide solo ghosts";

          ghostTick.addEventListener("click", () => {
            if (ghostTick.checked) {
              toggleSoloGhosts("none");
            } else {
              toggleSoloGhosts("block");
            }
          });

          ghostBox.append(ghostTick, ghostLabel);
          div.append(ghostBox);

          toggleSoloGhosts("none");
        }
      };

      const archotypeSelectionMenu = () => {
        if (captureTimeline) {
          captureTimeline
            .transition()
            .duration(250)
            .attr("transform", `translate(${width},${height * 0.1})`);
        }

        if (clusterMeta) {
          toolContent.innerHTML =
            "<div id='clusterMetaData'>" + clusterMeta + "</div><br><hr><br>";
        } else {
          toolContent.innerHTML =
            "<div id='clusterMetaData'><h3>Select a cluster</h3></div><br><hr><br>";
        }

        link.style("display", "block");
        node.style("display", "block");

        nodeGroupArray.forEach((group, i) => {
          // radio selection

          const groupName = `${Object.keys(group.nameParts).toString()} (${
            group.nodes.length
          })`;

          const radioGroup = document.createElement("input");
          radioGroup.type = "radio";
          radioGroup.checked = currentSelection === i;
          radioGroup.value = groupName;
          radioGroup.name = "nodeCluster";
          radioGroup.id = groupName;

          radioGroup.addEventListener("change", () => {
            if (radioGroup.checked) {
              regenerateGraph(group.nodes);

              currentSelection = i;
            }
          });

          const radioLabel = document.createElement("label");
          radioLabel.innerText = groupName;
          radioLabel.for = radioLabel;
          toolContent.append(
            radioGroup,
            radioLabel,
            document.createElement("br")
          );
        });
      };

      bgrect.on("click", archotypeSelectionMenu);

      //let domainCount = Object.keys(domainMap).length;

      var node = view.append("g");
      var link = view.append("g");
      var nodetitle = view.append("g");
      var titlecontrast = view.append("g");

      const regenerateGraph = (localNodeData) => {
        // purge existing graph
        node.remove();
        link.remove();
        nodetitle.remove();
        titlecontrast.remove();

        // recreate linkData

        const localLinkData = [];

        const nodeMap = {};
        const localDomainData = [];

        localNodeData.forEach((d) => {
          nodeMap[d.id] = 1;

          if (d.domain) {
            localDomainData.push(d);
          }
        });

        linkData.forEach((link) => {
          if (
            nodeMap.hasOwnProperty(link.target.id) ||
            nodeMap.hasOwnProperty(link.source.id)
          ) {
            if (link.target.id != link.source.id) {
              localLinkData.push(link);
            }
          }
        });

        //recreate SVG groups

        // Add a line for each link, and a circle for each node.
        link = view
          .append("g")
          .attr("stroke", "#999")
          .selectAll()
          .data(localLinkData)
          .join("line")
          .style("display", (d) =>
            d.color === "tranparent" ? "none" : "block"
          )
          .attr("stroke-width", (d) => d.weight)
          .attr("stroke", (d) => d.color)
          .attr("marker-end", (d) => {
            if (d.type === "page2page" && d.color != "transparent") {
              return "url(#arrow)";
            }
          });

        // on click, fetch the data from the data source if it exists

        node = view
          .append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .selectAll()
          .data(localNodeData)
          .join("circle")
          .attr("r", 5)
          .attr("fill", (d) => (foundSet.has(d.id) ? "purple" : d.color));

        titlecontrast = view
          .append("g")
          .selectAll()
          .data(localDomainData)
          .join("rect")
          .attr("fill", "rgba(255,255,255,0.8)")
          .attr("width", (d) => d.name.length * 4)
          .attr("height", 9);

        nodetitle = view
          .append("g")
          .attr("text-anchor", "middle")
          .attr("dy", "-5px")
          .style("user-select", "none")
          .style("pointer-events", "none")
          .style("font-weight", "bolder")
          .selectAll()
          .data(localDomainData)
          .join("text")
          .style("font-size", "6px")
          .attr("fill", "black")
          .text((d) => d.name);

        // here, it is taken as a given that the async race will be won by the
        // invoker given that interrogating dexie is more tedious but this might
        // end up breaking at some point for framework reasons.

        node.style("cursor", (d) => (d.domain ? "move" : "pointer"));
        node
          .attr("stroke-width", (d) => (circleSet.has(d.id) ? 3 : 0))
          .attr("stroke", (d) => (circleSet.has(d.id) ? "#0FFF50" : "null"));

        let previousCircle = 0;
        let previousSearch = 0;

        // This function is called when the user is within an authorized network that
        // can resolve a web archive page capture. It shows the authorized metadata (potentially, the page's content)
        // and lets them look for a string in the "content" field (if accessible).

        const displayLastCaptureMetadata = (doc) => {
          const copyButton = document.createElement("button");
          copyButton.innerText = "Copy permalink";
          copyButton.className = "flux-button";
          copyButton.style = "margin:10px;";

          const permalink = `${arkViewer}/${doc.wayback_date}/${doc.url}`;
          copyButton.addEventListener("click", () =>
            clipboard.writeText(permalink)
          );

          const content = document.createElement("div");

          const toolSearch = document.createElement("input");
          toolSearch.style = "padding:5px;border-bottom:1px solid #141414";
          toolSearch.type = "text";
          toolSearch.placeholder = "Search term or expression";

          toolSearch.addEventListener("focusin", () => setkeylock(1));
          toolSearch.addEventListener("focusout", () => setkeylock(0));

          const toolResult = document.createElement("div");

          const searchTerm = () => {
            toolResult.innerHTML =
              "Fragments from the content of the captured page:<br><br>";
            var sliced = "";

            const target = toolSearch.value;
            previousSearch = target;

            if (target.length > 2) {
              var re = new RegExp(target, "gi"),
                str = doc.content;
              while ((match = re.exec(str)) != null) {
                // var extrait = doc.content.substring(match.index - 150, match.index + 150)
                //.replace(target, "<mark>" + target + "</mark>")

                const extrait =
                  doc.content.substring(match.index - 150, match.index) +
                  "<mark>" +
                  doc.content.substring(
                    match.index,
                    match.index + target.length
                  ) +
                  "</mark>" +
                  doc.content.substring(
                    match.index + target.length,
                    match.index + 150
                  );

                sliced += extrait + "<br><hr><br>";
              }

              toolResult.innerHTML =
                "<div style = 'border:1px solid black; padding:5px'>" +
                sliced +
                "</div><br><hr><br>";
            }
          };

          if (previousSearch) {
            toolSearch.value = previousSearch;
            searchTerm();
          }

          toolSearch.addEventListener("change", searchTerm);
          toolContent.innerHTML = "";

          if (doc.hasOwnProperty("url")) {
            content.innerHTML += `<div style = "font-weight:bold" >url</div ><div>${doc["url"]}</div><br>`;
          }
          for (const key in doc) {
            content.innerHTML += `<div style = "font-weight:bold" > ${key}</div ><div>${doc[key]}</div><br>`;
          }
          toolContent.append(toolSearch, copyButton, toolResult, content);
        };

        // This displays all available captures of that page on a timeline and loads
        // a selected capture on click

        const displayOtherCaptures = (docs) => {
          //purge previous timeline
          if (captureTimeline) {
            captureTimeline.remove();
          }

          //create new
          captureTimeline = svg
            .append("g")
            .attr("id", "captureTimeline")
            .attr(
              "transform",
              `translate(${width - toolWidth},${height * 0.1})`
            );

          //background rect
          captureTimeline
            .append("rect")
            .attr("height", height * 0.84)
            .attr("rx", 10)
            .attr("width", 200)
            .attr("y", -height * 0.02)
            .attr("x", -80)
            .attr("stroke", "gray")
            .attr("stroke-width", 0.5)
            .attr("fill", "rgba(255,255,255,0.8)");

          const data = [];
          var dateMap = {};

          docs.forEach((d) => {
            const capture = {};
            capture.date = new Date(d.crawl_date);
            capture.id = d.id;
            const day = JSON.stringify(d.wayback_date).substring(0, 8);

            capture.metadata = d;

            if (!dateMap.hasOwnProperty(day)) {
              dateMap[day] = 0;
            }

            dateMap[day]++;

            capture.count = dateMap[day];

            data.push(capture);
          });

          const y = d3
            .scaleUtc()
            .domain(d3.extent(data, (d) => d.date))
            .nice()
            .range([height * 0.8, 0]);

          const x = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.count))
            .nice()
            .range([8, 52]);

          captureTimeline
            .append("g")
            .call(d3.axisLeft(y).tickFormat(d3.utcFormat("%d / %m / %Y")));

          captureTimeline
            .append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => x(d.count))
            .attr("cy", (d) => y(d.date))
            .attr("r", 5)
            .style("cursor", "pointer")
            .on("click", (e, d) => {
              d3.select(e.target).attr("fill", "green");
              displayLastCaptureMetadata(d.metadata);
            });

          captureTimeline
            .transition()
            .duration(250)
            .attr(
              "transform",
              `translate(${width - toolWidth - 65},${height * 0.1})`
            );
        };

        node.on("click", (e, d) => {
          const circle = d3.select(e.target);

          const linkedNodeMap = {};
          linkedNodeMap[d.id] = 1;

          link.style("display", (l) => {
            if (l.target.id === d.id) {
              linkedNodeMap[l.source.id] = 1;
              return "block";
            } else if (l.source.id === d.id) {
              linkedNodeMap[l.target.id] = 1;
              return "block";
            } else {
              return "none";
            }
          });

          node.style("display", (n) => {
            if (linkedNodeMap.hasOwnProperty(n.id)) {
              return "block";
            } else {
              return "none";
            }
          });

          // circlemap

          node
            .attr("stroke-width", (d) => (circleSet.has(d.id) ? 3 : 0))
            .attr("stroke", (d) => (circleSet.has(d.id) ? "#0FFF50" : "null"));

          circleSet.add(d.id);

          circle.attr("stroke-width", 3).attr("stroke", "#FF0F0F");

          /*
            if (previousCircle) {
              previousCircle.attr("stroke-width", 3).attr("stroke", "#0FFF50");
            }*/

          previousCircle = circle;
          if (resolver) {
            if (captureTimeline) {
              captureTimeline
                .transition()
                .duration(250)
                .attr("transform", `translate(${width},${height * 0.1})`);
            }

            var targetCollection;

            switch (d.type) {
              case "domain":
                break;

              case "ghost":
                // interrogating ghosts, ie pages that are not in the corpus
                // but that are linked to by captures within the corpus
                // these may or may not be in the archive

                //  this is a ghost, find the origine capture linking to it
                // to make sure it is collection-consistent

                localLinkData.forEach((l) => {
                  if (l.target.id === d.id) {
                    targetCollection =
                      documentMap[l.source.id].enrichment.solrCollection;
                  }
                });

              case "capture":
                // find the collection to target
                // if this is a capture, this is straightforward
                if (documentMap.hasOwnProperty(d.id)) {
                  targetCollection =
                    documentMap[d.id].enrichment.solrCollection;
                  console.log(documentMap[d.id]);
                }

                if (targetCollection) {
                  fetch(
                    `http://${resolver}/solr/${targetCollection}/select?q=url:${JSON.stringify(
                      d.id.replaceAll("&", "%26")
                    )}`
                  )
                    .then((r) => r.json())
                    .then((r) => {
                      toolContent.innerHTML = JSON.stringify(r);

                      if (r.response.numFound > 0) {
                        displayOtherCaptures(r.response.docs);
                        displayLastCaptureMetadata(
                          r.response.docs[r.response.docs.length - 1]
                        );
                        foundSet.add(d.id);
                        circle.attr("fill", "purple");
                      } else {
                        toolContent.innerHTML =
                          "<hr>" + d.id + " not found.<hr>";
                      }
                    })
                    .catch((e) => {
                      toolContent.innerHTML = "";
                      switch (d.type) {
                        case "domain":
                          toolContent.innerHTML = d.id;
                          break;
                        case "ghost":
                          toolContent.innerHTML = `
                            <hr>
                          ${d.id}
                            <br><hr><br>
                            You are not connected to the archive repository.`;
                          break;
                        case "capture":
                          for (const key in documentMap[d.id]) {
                            toolContent.innerHTML += `<strong>${key}</strong><br>${
                              documentMap[d.id][key]
                            }  <br><hr>`;
                          }

                          documentMap[d.id].enrichment.links.forEach(
                            (l) => (toolContent.innerHTML += `<br>${l}`)
                          );

                          break;
                      }
                    });
                }
                break;

              default:
                break;
            }
          } else {
            toolContent.innerHTML = "";
            switch (d.type) {
              case "domain":
                toolContent.innerHTML = d.id;
                break;
              case "ghost":
                toolContent.innerHTML = `
                  <hr>
                ${d.id}
                  <br><hr><br>
                  You are not connected to the archive repository.`;
                break;
              case "capture":
                for (const key in documentMap[d.id]) {
                  toolContent.innerHTML += `<strong>${key}</strong><br>${
                    documentMap[d.id][key]
                  }  <br><hr>`;
                }

                documentMap[d.id].enrichment.links.forEach(
                  (l) => (toolContent.innerHTML += `<br>${l}`)
                );

                break;
            }
          }
        });

        node.append("title").text((d) => d.id);

        link.raise();

        // drag behavior
        node.call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

        simulation.nodes(localNodeData).on("tick", ticked);
        simulation.force("link").links(localLinkData);
        simulation.alpha(1).restart();

        selectedClusterMetadata(localNodeData, localLinkData, node, link);
      };

      //select first, smallest corpus to display something on start
      regenerateGraph(nodeGroupArray[0].nodes);

      // legend
      const createLegend = () => {
        const legend = svg.append("g");

        // legend bg rect
        legend
          .append("rect")
          .attr("width", 320)
          .attr("height", 45)
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("fill", "white")
          .attr("x", 10)
          .attr("y", window.innerHeight - 68);

        const linksLegend = [
          {
            color: "rgb(100,100,100)",
            weight: 0.5,
            desc: "capture <-> ghost link",
          },
          {
            color: "rgb(100,160,210)",
            weight: 2,
            desc: "capture -> other capture link",
          },
          {
            //deactivated
            color: "rgb(255,140,10)",
            weight: 0,
            desc: "", //"capture -> other domain link",
          },
        ];

        const nodeLegend = [
          {
            color: "rgb(150,150,150)",
            desc: "Ghost page (not in corpus)",
          },
          {
            color: "blue",
            desc: "Page capture",
          },
          {
            color: "orange",
            desc: "Host",
          },
        ];

        for (let i = 0; i < 3; i++) {
          const l = linksLegend[i];

          const n = nodeLegend[i];

          legend
            .append("circle")

            .attr("fill", n.color)
            .attr("cx", 20)
            .attr("r", 4)
            .attr("cy", window.innerHeight - 58 + i * 12);

          legend
            .append("text")
            .text(n.desc)
            .style("font-size", "9px")
            .attr("x", 35)
            .attr("y", window.innerHeight - 55 + i * 12);

          legend
            .append("rect")
            .attr("width", 20)
            .attr("height", l.weight * 2)
            .attr("fill", l.color)
            .attr("x", 165)
            .attr("y", window.innerHeight - 60 + i * 12);

          legend
            .append("text")
            .text(l.desc)
            .style("font-size", "9px")
            .attr("x", 195)
            .attr("y", window.innerHeight - 55 + i * 12);
        }
      };

      createLegend();

      loadType();

      document.getElementById("tooltip").append(toolContent);

      archotypeSelectionMenu();
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "archotype error: dataset " + id + " is invalid."
      );
    });

  //======== ZOOM & RESCALE ===========
  //svg.call(zoom).on("dblclick.zoom", null);
  /* 
    zoomed = (thatZoom, transTime) => {
      if (transTime) {
        view.transition().duration(transTime).attr("transform", thatZoom);
      } else {
        view.attr("transform", thatZoom);
      }
    }; */

  svg.call(zoom.on("zoom", (d) => zoomed(d.transform)));

  function zoomed(transform, time) {
    //console.log(transform);
    //console.log(time);
    if (time) {
      view.transition().duration(time).attr("transform", transform);
    } else {
      view.attr("transform", transform);
    }
  }

  window.electron.send("console-logs", "Starting archotype");
};

export { archotype };
