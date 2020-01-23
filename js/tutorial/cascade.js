const tg = require("@hownetworks/tracegraph");

//========== Tracegraph ==========

let traces = [
  {
    hops: [
      { root: true },
      { info: { name: "USER" }, name: "USER" },
      { info: { name: "DB/API" }, name: "DB/API" }
    ]
  },
  {
    hops: [
      { info: { name: "DB/API" }, name: "DB/API" },
      { info: { name: "ENRICHMENT" }, name: "ENRICHMENT" }
    ]
  },
  {
    hops: [
      { info: { name: "ENRICHMENT" }, name: "ENRICHMENT" },
      { info: { name: "ZOTERO" }, name: "ZOTERO" },
      { info: { name: "SYSTEM" }, name: "SYSTEM" }
    ]
  },
  {
    hops: [
      { root: true },
      { info: { name: "USER" }, name: "USER" },
      { info: { name: "ZOTERO" }, name: "ZOTERO" },
      { info: { name: "SYSTEM" }, name: "SYSTEM" }
    ]
  }
];

const drawFlux = (svg, traces, horizontal, showTexts) => {
  function makeText(selection) {
    return selection
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12);
  }

  const tmpSvg = d3
    .select("body")
    .append("svg")
    .attr("width", 650)
    .attr("height", 500);

  const tmpText = makeText(tmpSvg);

  const graph = tg
    .tracegraph()
    .horizontal(horizontal)
    .nodeSize(node => {
      const name = node.hops[0].name;
      if (showTexts && name) {
        const bbox = tmpText
          .text(name)
          .node()
          .getBBox();
        return [bbox.width + 14, bbox.height + 8];
      }
      return name || node.hops[0].root ? [30, 30] : [10, 10];
    })
    .levelMargin(10)
    .hopDefined(hop => hop.name || hop.root)
    .traceWidth(6)
    .nodeId((hop, hopIndex, trace, traceIndex) => {
      return (
        hop.name || (hop.root && "root") || `empty-${traceIndex}-${hopIndex}`
      );
    });

  const layout = graph(traces);

  tmpSvg.remove();

  const vb = layout.bounds.expanded(4);

  svg
    .attr("viewBox", `${vb.x} ${vb.y} ${vb.width} ${vb.height}`)
    .attr("width", 400)
    .attr("height", 300);

  const gradients = layout.nodes.map(() => tg.genUID());

  svg
    .append("defs")
    .selectAll("linearGradient")
    .data(layout.nodes.map(tg.nodeGradient))
    .enter()
    .append("linearGradient")
    .attr("id", (d, i) => gradients[i].id)
    .attr("gradientUnits", d => d.gradientUnits)
    .attr("x1", d => d.x1)
    .attr("y1", d => d.y1)
    .attr("x2", d => d.x2)
    .attr("y2", d => d.y2)
    .selectAll("stop")
    .data(d => d.stops)
    .enter()
    .append("stop")
    .attr("offset", d => d.offset)
    .attr(
      "stop-color",
      d => d3.schemeSet2[d.traceIndex % d3.schemeSet2.length]
    );

  const traceGroup = svg
    .selectAll(".trace")
    .data(layout.traces)
    .enter()
    .append("g")
    .attr("class", "trace")
    .attr("fill", "none");
  traceGroup
    .filter(segment => segment.defined)
    .append("path")
    .attr("stroke-width", d => d.width - 2)
    .attr("stroke", "white")
    .attr("d", tg.traceCurve());
  traceGroup
    .append("path")
    .attr("stroke-width", d => (d.defined ? d.width - 4.5 : d.width - 5))
    .attr(
      "stroke",
      segment => d3.schemeSet2[segment.index % d3.schemeSet2.length]
    )
    .attr("stroke-dasharray", segment => (segment.defined ? "" : "4 2"))
    .attr("d", tg.traceCurve());

  const nodeGroup = svg
    .selectAll(".node")
    .data(layout.nodes)
    .enter()
    .append("g")
    .attr("stroke", (d, i) => gradients[i])
    .attr("stroke-width", 2)
    .attr("fill", "white");

  const textNodes = nodeGroup
    .filter(d => showTexts && d.hops[0].name)
    .datum(d => ({ ...d, bounds: d.bounds.expanded(-2.5) }));
  textNodes
    .append("rect")
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("x", d => d.bounds.x)
    .attr("y", d => d.bounds.y)
    .attr("width", d => d.bounds.width)
    .attr("height", d => d.bounds.height);

  makeText(textNodes)
    .attr("x", d => d.bounds.cx)
    .attr("y", d => d.bounds.cy)
    .attr("stroke", "none")
    .attr("fill", "black")
    .attr("alignment-baseline", "central")
    .attr("text-anchor", "middle")
    .style("cursor", "pointer")
    .attr("font-size", 10)
    .text(d => d.hops[0].info.name)
    .on("mouseenter", d => {
      //NODEGROUP STYLE
      nodeGroup
        .transition()
        .duration(200)
        .style("opacity", 0.15);
      let selectedTraces = [];
      traces.forEach(f => {
        for (let i = 0; i < f.hops.length; i++) {
          if (f.hops[i].name === d.hops[0].name) {
            selectedTraces.push(f);
          }
        }
      });
      for (let k = 0; k < selectedTraces.length; k++) {
        for (let u = 0; u < selectedTraces[k].hops.length; u++) {
          nodeGroup
            .filter(d => d.hops[0].name === selectedTraces[k].hops[u].name)
            .transition()
            .duration(250)
            .style("opacity", 0.65);
        }
      }

      nodeGroup
        .filter(e => e === d)
        .transition()
        .duration(300)
        .style("opacity", 1);

      //Tracegroup
      traceGroup
        .transition()
        .duration(200)
        .style("stroke-opacity", 0.15);
      selectedTraces.forEach(signal => {
        for (let i = 0; i < traceGroup._groups[0].length; i++) {
          if (traceGroup._groups[0][i].__data__.hops[0] === signal.hops[0]) {
            d3.select(traceGroup._groups[0][i])
              .transition()
              .duration(250)
              .style("stroke-opacity", 0.65);
          }
        }
      });
    })
    .on("mouseout", d => {
      nodeGroup
        .transition()
        .duration(200)
        .style("opacity", 1);
      traceGroup
        .transition()
        .duration(200)
        .style("stroke-opacity", 1);
    });

  nodeGroup
    .filter(d => !(showTexts && d.hops[0].name))
    .append("circle")
    .attr("r", d => Math.min(d.bounds.width, d.bounds.height) / 2)
    .attr("cx", d => d.bounds.cx)
    .attr("cy", d => d.bounds.cy);
};


