//import { fstat } from "fs";
//const {remote, ipcRenderer, shell} = require('electron');

onconnect = e => {
  var port = e.ports[0];

  const notifySystem = (dest, msg) => {
    port.postMessage({ type: "notification", dest: dest, msg: msg });
  };

  notifySystem("console-logs", "Multithreading enabled");

  importScripts("../../node_modules/d3/dist/d3.min.js");

  port.onmessage = message => {
    switch (message.data.type) {
      case "gz":
        try {
          var circleData = message.data.dataset;

          var simulation = d3
            .forceSimulation(circleData) // starting simulation
            .force("x", d3.forceX().strength(1))
            .force("y", d3.forceY().strength(1))
            .stop();

          for (
            var i = 0,
              n = Math.ceil(
                Math.log(simulation.alphaMin()) /
                  Math.log(1 - simulation.alphaDecay())
              );
            i < n;
            ++i
          ) {
            simulation.tick();
          }

          port.postMessage({ type: "gz", msg: circleData });
        } catch (error) {
          port.postMessage({ type: "gz", msg: error });
        }
        break;

      case "hy":
        try {
          var nodeData = message.data.nodeData;
          var links = message.data.links;
          var tags = message.data.tags;

          nodeData.forEach(node => {
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
                .id(d => d.id)
                .distance(0)
                .strength(1)
            )
            .force("charge", d3.forceManyBody().strength(-600))
            //.force("center", d3.forceCenter(width / 2, height / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
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
          }

          port.postMessage({ type: "hy", nodeData: nodeData, links: links });
        } catch (error) {
          port.postMessage({ type: "hy", msg: error });
        }
        break;
    }
  };
};
