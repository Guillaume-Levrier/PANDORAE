//import { fstat } from "fs";
//const {remote, ipcRenderer, shell} = require('electron');

onconnect = (e) => {
  var port = e.ports[0];

  const notifySystem = (dest,msg) => {
    port.postMessage({type:"notification",dest:dest,msg:msg});
  }
  
  notifySystem('console-logs','Multithreading enabled');

 importScripts("../../node_modules/d3/dist/d3.min.js");    

  port.onmessage = (message) => {
 
    switch (message.data.type) {
      case "gz": 
      
      try {
        
  var circleData = message.data.dataset;

        var simulation = d3.forceSimulation(circleData)                      // starting simulation
            .force("x", d3.forceX().strength(1))
            .force("y", d3.forceY().strength(1))
            .stop();
  
    for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
      simulation.tick();
    }
    
  port.postMessage({type:"gz",msg:circleData});

  } catch (error) {
    port.postMessage({type:"gz",msg:error});
  }
        break;

        case "hy": 
      
        try {
          
    var nodeData = message.data.dataset;
    var links=message.data.links;
    var height= message.data.height;
    var width=message.data.width;
  
         
var simulation = d3.forceSimulation(nodeData) // Start the force graph
                    .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
                    .force("charge", d3.forceManyBody().strength(-600))
                    .force("center", d3.forceCenter(width / 2, height / 2))
                    .stop();

 simulation
          .nodes(nodeData) // Start the force graph with "docs" as data
          .on("tick", ticked);

  simulation
          .force("link") // Create the links
          .links(links); // Data for those links is "links"

  function ticked() {
 
          nodelinks // Links coordinates
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);
            
            nodes // Node coordinates
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
            
            }

      for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i <= n; ++i) {
        simulation.tick();
      }

      port.postMessage({type:"gz",msg:nodeData});
  
    } catch (error) {
      port.postMessage({type:"gz",msg:error});
    }
          break;
    }
  }
  
}