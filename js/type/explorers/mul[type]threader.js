//onconnect = e => {
// var port = e.ports[0];

const notifySystem = (dest, msg) => {
  postMessage({ type: "notification", dest: dest, msg: msg });
};

//notifySystem("console-logs", "Multithreading enabled");

importScripts("../node_modules/d3/dist/d3.min.js");

onmessage = (message) => {
  // END WORKER SPECIFICITY

  console.log("coucou, le message est arrivé");

  console.log(message);

  switch (message.data.type) {
    case "checkup":
      notifySystem("console-logs", message.data.validation);

      break;

    case "hy":
      try {
        var nodeData = message.data.nodeData;
        var links = message.data.links;
        var tags = message.data.tags;
        var width = message.data.width;
        var height = message.data.height;

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
              Math.log(simulation.alphaMin()) /
                Math.log(1 - simulation.alphaDecay())
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

        postMessage({
          type: "hy",
          nodeData: nodeData,
          links: links,
          contours: contours,
        });
      } catch (error) {
        postMessage({ type: "hy", msg: error });
      }
      break;
  }
};
//};
