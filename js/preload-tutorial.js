const CMT = {
  EN: {
    menu: {
      flux: "flux",
      type: "type",
      slide: "slide",
      quit: "quit",
    },
    global: {
      coreLogo: [
        "P",
        "&nbsp;",
        "A",
        "&nbsp;",
        "N",
        "&nbsp;",
        "D",
        "&nbsp;",
        "O",
        "&nbsp;",
        "R",
        "&nbsp;",
        "Æ",
        "&nbsp;",
        " ",
        "-",
        " ",
        "&nbsp;",
        "C",
        "&nbsp;",
        "O",
        "&nbsp;",
        "R",
        "&nbsp;",
        "E",
      ],
      field: {
        starting: "starting",
        error: "system error",
        workerError: "multithreading disabled",
        loading: "loading",
      },
    },
    mainField: {
      changeTheme: "change theme ",
      invalidTheme: "invalid theme name",
      toggleConsole: "toggle console",
      toggleMenu: "toggle menu",
      reload: "reload",
      fullscreen: "fullscreen",
      restart: "restart",
      reloadCore: "reload core",
      openDevtools: "open devtools",
      unlockMenu: "unlock menu",
      version: "version",
      returnTutorial: "return to tutorial",
      startTutorial: "start tutorial",
      comNotFound: "command not found",
    },
    console: {
      starting: ["Starting process ", " using dataset "],
      error: [
        "SYSTEM ERROR - PANDORÆ was unable to perform this task. The dataset might be incompatible with your request.",
      ],
      workerError: [
        "The SharedWorker failed to start. Processes requiring multithreading will be unavailable.",
      ],
      workerValidation: ["Multithreading enabled."],
      menu: {
        opening: "Opening menu",
        closing: "Collapsing menu",
      },
    },
    chaeros: {
      field: {},
      console: {},
    },
    flux: {
      divs: {
        hyphendpoint: "Enter your Hyphe endpoint below :",
      },
      field: {},
      console: {},
    },
    types: {
      console: {},
      tooltip: {},
    },
    tutorial: {
      sections: {
        mainTitle:
          "<div style='text-align:center'><div class='title' style='font-size:36px;font-weight: bold;'>Welcome to PANDORÆ</div><br><i class='material-icons arrowDown'><a class='arrowDown' data-action='scroll' data-target='slide2'>arrow_downward</a></i></div>",
        slide2:
          "<div style='text-align:center'><span class='title'>This short tutorial will guide your first steps with PANDORÆ.</span><br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide2bis'>arrow_downward</a></i></div>",
        slide2bis:
          "<div style='text-align:center'><span class='title'>As you noticed, you can click on the <strong>arrows</strong> to go down or back.</span><br><br>You can also use your <strong>mouse wheel</strong> to navigate up and down.&nbsp;<br><br>            You can skip specific chapters and come back to this <strong>tutorial</strong> later.<br><br>            If you're unsure of how to proceed, you can watch the step-by-step video of this tutorial while you interact with it.<br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide3'>arrow_downward</a></i></div>",
        slide3:
          "<div style='text-align:center'><span class='title'>PANDORÆ is a <strong>data retrieval & exploration tool.</strong></span><br><br>You can use it for many purposes, like building a <strong>literature review</strong>.<br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide4'>arrow_downward</a></i></div>",
        slide4:
          "<div style='text-align:center'><span class='title'>PANDORÆ  allows you to perform three main kinds of operations :</span><br><br><a data-action='scroll' data-target='Chapter1'>Load & enrich data</a><br><br><a data-action='scroll' data-target='Chapter2'>Explore data</a><br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter1'>arrow_downward</a></i></div>",
        Chapter1:
          "<span class='title'><strong>Chapter 1: Loading & enriching data</strong></span><br><br>PANDORÆ enables you to load data from different types of sources.<br><br>Those sources can be online databases that aggregate documents such as scientific articles.<br> <br>But you can really add <strong>any kind of document</strong>.<br><br>PANDORÆ also supports other types of data, such as those extracted from social-media or clinical trials.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux'>arrow_downward</a></i></div>",
        flux:
          "<span class='title'><strong>Cascade: Available data flows</strong></span><br><br><div style='display: inline-flex'><div style='flex:auto'>   <strong>Cascade</strong> is how Flux displays its data flows. As you can see, the data flows from you to the system. Hovering a process shows to which other process it is linked.  <br>&nbsp;<br> Cascade behaves like menu : click on a process and its options will be displayed.<br>&nbsp;<br>Click <a data-action='tuto' data-target='flux'>here</a> to learn how to open Flux.<br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux2'>arrow_downward</a></i></div></div><div style='flex:auto'><svg></svg></div></div><br>&nbsp;<br>",
        flux2:
          "<span class='title'><strong>Flux sections</strong></span><br><br>Flux has different types of processes. Each section has its own purpose, and relies on different services:<ul style='list-style-type: square;'><li><a data-action='scroll' data-target='user'>User</a> lets you insert your API keys and credentials.</li><li><a data-action='scroll' data-target='databases'>Databases requests</a> allow you to retrieve data from various online sources.</li><li><a data-action='scroll' data-target='enriching'>Enriching</a> allows you to edit and enrich datasets.</li><li><a data-action='scroll' data-target='system'>System</a> sends your data to PANDORAE visualisation features.</li></ul>Detail about the other sections will become available when they will be rolled out. Click on a section name to learn more about that section right now, or simply click on the arrow to continue.   <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='databases'>arrow_downward</a></i></div>",
        databases:
          "<span class='title'><strong>Databases</strong></span><br><br><div>Online databases can handle precise requests and return articles relevant to your needs. Many services exist, but PANDORÆ currently only supports Scopus. In order to start using PANDORÆ and Scopus, you will need to retrieve an <a data-action='openEx' data-target='https://dev.elsevier.com/'>API key</a> and insert it in Flux's USER tab.<br>&nbsp;<br> <br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Enriching'>arrow_downward</a></i></div></div>",
        Enriching:
          "<span class='title'><strong>Enriching data</strong></span><br><br><strong>Flux</strong> enables you do retrieve data from different kinds of <a data-action='scroll' data-target='Bibliometric-databases'>databases</a>. Articles can be <a data-action='scroll' data-target='enrichment'>enriched</a> by <strong>geolocating</strong> their affiliation and retrieving additional <strong>metadata</strong>. But you will often have to curate your data and enrich its content by hand. PANDORÆ therefore helps you send your datasets to <a data-action='scroll' data-target='Zotero1'>Zotero</a> and download them back into the system when you're done cleaning your dataset.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='enrichment'>arrow_downward</a></i></div>",
        enrichment:
          "<span class='title'><strong>Enrichment</strong></span><br><br>Enrichment builds upon the datasets you obtained by requesting bibliometric databases. <br>&nbsp;<br>It will give you the opportunity to retrieve the geographic coordinates of each paper's affiliation(s), which in turn will allow <a data-action='scroll' data-target='geotype'>Geotype</a> to display those on a map. <br>&nbsp;<br>It can also retrieve Altmetric metadata, which might need an <a data-action='openEx' data-target='https://www.altmetric.com/'>API key</a>.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero1'>arrow_downward</a></i></div>",
        Zotero1:
          "<span class='title'><strong>Zotero</strong></span><br><br><strong>Zotero</strong> is an open-source software designed to manage bibliographic data and references. It supports CSL-JSON datasets.       <br>&nbsp;<br> PANDORÆ converts data retrieved from <a data-action='scroll' data-target='Bibliometric-databases'>databases</a> to this format.     <br>&nbsp;<br> Using Zotero, you can explore, edit and curate those datasets. <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero2'>arrow_downward</a></i></div>",
        Zotero2:
          "<span class='title'><strong>Creating a Zotero account</strong></span><br><br>You can create a free zotero account at <a data-action='openEx' data-target='https://www.zotero.org/'>https://www.zotero.org/</a>. <br>&nbsp;<br> Once that is done, you will need to set up a <a data-action='openEx' data-target='https://www.zotero.org/groups/'>group library</a> and retrieve a read/write API key.<br>&nbsp;<br> <strong>But for now,</strong> you can just click <a data-action='tuto' data-target='zoteroImport'>here</a> to learn how to use Zotero with PANDORÆ with <strong>sample data</strong> instead.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter2'>arrow_downward</a></i></div>",
        Chapter2:
          "    <span class='title'><strong>Chapter 2: Exploring data</strong></span><br><br> PANDORÆ's main purpose is to enable you to explore large and/or complex datasets. It features several different kinds of '<strong>types</strong>', that is ways to display your data:      <li><a data-action='scroll' data-target='chronotype'>Chronotype</a> puts different corpuse of documents on a same timeline for you to compare their size and content.</li>      <li><a data-action='scroll' data-target='geotype'>Geotype</a> draws a globe and displays scholarly paper's affiliation cities, institutions, and who cooperates with whom.</li>           <br>      Other features are documented on the <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE/wiki'>wiki</a>. Please note you need to resize your window <strong>before</strong> loading a <strong>types</strong>.  <br>&nbsp;<br>    <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='chronotype'>arrow_downward</a></i></div>",
        chronotype:
          "    <span class='title'><strong>Chronotype</strong></span><br><br>The <strong>chronotype</strong> displays one to seven Zotero collections at a time. Each collection is a vertical line. Each node on this line is a cluster of documents published      on that month. Clicking the node opens the cluster, revealing the documents. Hovering a document shows its metadata. Clicking it leads to its content, if available.  <br>&nbsp;<br>      Click <a data-action='tuto' data-target='chronotype');'>here</a> to try the chronotype if you already loaded the sample datasets. If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.      <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='geotype'>arrow_downward</a></i></div>",
        geotype:
          "      <span class='title'><strong>Geotype</strong></span><br><br>        The <strong>geotype</strong> displays a globe on which available affiliations are geolocated. Affiliations having cooperated on a paper listed in the dataset are linked in red.          <br>&nbsp;<br>        Click <a data-action='tuto' data-target='geotype');'>here</a> to try to the geotype if you already loaded the sample datasets. If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.        <br>&nbsp;<br>  <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='FinalChap'>arrow_downward</a></i></div>",
        FinalChap:
          "<div style='text-align:center'><span class='title'><strong>Final Chapter: the great escape</strong></span><br><br>      Our short journey together is about to come to an end.<br>&nbsp;<br>       It is now time for you to learn how to escape the Tutorial's constraint.       <br>&nbsp;<br>      Time to break free.      <br>&nbsp;<br><div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final2'>arrow_downward</a></i></div></div>",
        final2:
          "<div style='text-align:center'><span class='title'><strong>USER wants to break free</strong></span><br><br>        You might have noticed when you first started PANDORÆ that your possibilities were limited. <br>&nbsp;<br>        The <i  class='material-icons'>menu</i> <strong>menu</strong> button was 'forbidden', the <i  class='material-icons'>code</i> <strong>console</strong>  button too. <br>&nbsp;<br>        Your only option was to start the tutorial. Let's change that.        <br>&nbsp;<br>  <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final3'>arrow_downward</a></i></div></div>",
        final3:
          "<div style='text-align:center'><span class='title'><strong>Back to Flux-ture</strong></span><br><br>          PANDORÆ starts in tutorial mode when it detects that no user name has been entered. <br>&nbsp;<br>          To turn off the tutorial mode, go back to <a data-action='scroll' data-target='flux'>Flux</a>, go to the USER section, enter a user name. Do not forget to click the 'Update User Credentials' button. <br>&nbsp;<br>          Then come back here.<br>&nbsp;<br>    <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final4'>arrow_downward</a></i></div></div>",
        final4:
          "<div style='text-align:center'><span class='title'><strong>The main field</strong></span><br><br>            PANDORÆ communicates with you by displaying messages in the main field, on the main screen. You can also write in this field to communicate with PANDORÆ. <br>&nbsp;<br>            To select the field, push your <strong>TAB</strong> key after clicking on the main screen. You can then enter commands and push the <strong>ENTER</strong> key. <br>&nbsp;<br>      <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final5'>arrow_downward</a></i></div></div>",
        final5:
          "<div style='text-align:center'><span class='title'><strong>Entering commands</strong></span><br><br>             If your menu is locked, you can use the &nbsp;<span class='commands'>unlock menu</span>&nbsp; command. <br>&nbsp;<br>             It also works in the console.             <br>&nbsp;<br>             You can also change PANDORÆ's theme with the &nbsp;<span class='commands'>change theme</span>&nbsp; command. <br>&nbsp;<br>             Try with &nbsp;<span class='commands'>change theme blood-dragon</span>&nbsp; for example. You can switch back with &nbsp;<span class='commands'>change theme normal</span>. <br>&nbsp;<br>                <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final6'>arrow_downward</a></i></div></div>",
        final6:
          "<div style='text-align:center'><span class='title'><strong>Call me ...  maybe?</strong></span><br><br>            If you ever miss the tutorial, or want to check one of its chapter, you can use the             &nbsp;<span class='commands'>start tutorial</span>&nbsp; command.<br>&nbsp;<br> You will always be welcome here.<br>&nbsp;<br>                <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final7'>arrow_downward</a></i></div></div>",
        final7:
          "<div style='text-align:center'><span class='title'><strong>Freedom at last</strong></span><br><br>           You will learn how to use PANDORÆ mostly by trial and error.<br>&nbsp;<br> If you're a researcher and/or developer, you might want to go have a look at its            <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE'>source code</a>.<br>&nbsp;<br>           A wiki of the project is available <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE/wiki'>here</a>.           <br>&nbsp;<br>           <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='lastScroll()'>arrow_downward</a></i></div></div>",
        final8:
          "<div style='text-align:center'>This <strong>CORE</strong> is now yours. <br>&nbsp;<br>           Close the software and restart it to escape the tutorial.<br>&nbsp;<br>           Thank you for using PANDORÆ.<br><br>                    <div id='restartCount' style='font-weight: bolder'></div></div>",
        last:
          "<div style='margin:auto;font-size:10px;line-height: 15px;'>PANDORÆ - version 1 <br>Guillaume Levrier</div>",
      },
    },
  },
  FR: {
    menu: {
      flux: "flux",
      type: "type",
      quit: "quitter",
      returnToTutorial: "retour au tutoriel",
    },

    tutorial: {
      sections: {},
    },
  },
  中文: {
    menu: {
      flux: "流动",
      type: "类型",
      quit: "关闭",
      returnToTutorial: "回教程",
    },
  },
};
// cascade

const tg = require("@hownetworks/tracegraph");
const d3 = require("d3");

//========== Tracegraph ==========

let traces = [
  {
    hops: [
      { root: true },
      { info: { name: "USER" }, name: "USER" },
      { info: { name: "DB/API" }, name: "DB/API" },
    ],
  },
  {
    hops: [
      { info: { name: "DB/API" }, name: "DB/API" },
      { info: { name: "ENRICHMENT" }, name: "ENRICHMENT" },
    ],
  },
  {
    hops: [
      { info: { name: "ENRICHMENT" }, name: "ENRICHMENT" },
      { info: { name: "ZOTERO" }, name: "ZOTERO" },
      { info: { name: "SYSTEM" }, name: "SYSTEM" },
    ],
  },
  {
    hops: [
      { root: true },
      { info: { name: "USER" }, name: "USER" },
      { info: { name: "ZOTERO" }, name: "ZOTERO" },
      { info: { name: "SYSTEM" }, name: "SYSTEM" },
    ],
  },
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
    .nodeSize((node) => {
      const name = node.hops[0].name;
      if (showTexts && name) {
        const bbox = tmpText.text(name).node().getBBox();
        return [bbox.width + 14, bbox.height + 8];
      }
      return name || node.hops[0].root ? [30, 30] : [10, 10];
    })
    .levelMargin(10)
    .hopDefined((hop) => hop.name || hop.root)
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
    .attr("gradientUnits", (d) => d.gradientUnits)
    .attr("x1", (d) => d.x1)
    .attr("y1", (d) => d.y1)
    .attr("x2", (d) => d.x2)
    .attr("y2", (d) => d.y2)
    .selectAll("stop")
    .data((d) => d.stops)
    .enter()
    .append("stop")
    .attr("offset", (d) => d.offset)
    .attr(
      "stop-color",
      (d) => d3.schemeSet2[d.traceIndex % d3.schemeSet2.length]
    );

  const traceGroup = svg
    .selectAll(".trace")
    .data(layout.traces)
    .enter()
    .append("g")
    .attr("class", "trace")
    .attr("fill", "none");
  traceGroup
    .filter((segment) => segment.defined)
    .append("path")
    .attr("stroke-width", (d) => d.width - 2)
    .attr("stroke", "white")
    .attr("d", tg.traceCurve());
  traceGroup
    .append("path")
    .attr("stroke-width", (d) => (d.defined ? d.width - 4.5 : d.width - 5))
    .attr(
      "stroke",
      (segment) => d3.schemeSet2[segment.index % d3.schemeSet2.length]
    )
    .attr("stroke-dasharray", (segment) => (segment.defined ? "" : "4 2"))
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
    .filter((d) => showTexts && d.hops[0].name)
    .datum((d) => ({ ...d, bounds: d.bounds.expanded(-2.5) }));
  textNodes
    .append("rect")
    .attr("rx", 2)
    .attr("ry", 2)
    .attr("x", (d) => d.bounds.x)
    .attr("y", (d) => d.bounds.y)
    .attr("width", (d) => d.bounds.width)
    .attr("height", (d) => d.bounds.height);

  makeText(textNodes)
    .attr("x", (d) => d.bounds.cx)
    .attr("y", (d) => d.bounds.cy)
    .attr("stroke", "none")
    .attr("fill", "black")
    .attr("alignment-baseline", "central")
    .attr("text-anchor", "middle")
    .style("cursor", "pointer")
    .attr("font-size", 10)
    .text((d) => d.hops[0].info.name)
    .on("mouseenter", (event, d) => {
      //NODEGROUP STYLE
      nodeGroup.transition().duration(200).style("opacity", 0.15);
      let selectedTraces = [];
      traces.forEach((f) => {
        for (let i = 0; i < f.hops.length; i++) {
          if (f.hops[i].name === d.hops[0].name) {
            selectedTraces.push(f);
          }
        }
      });
      for (let k = 0; k < selectedTraces.length; k++) {
        for (let u = 0; u < selectedTraces[k].hops.length; u++) {
          nodeGroup
            .filter((d) => d.hops[0].name === selectedTraces[k].hops[u].name)
            .transition()
            .duration(250)
            .style("opacity", 0.65);
        }
      }

      nodeGroup
        .filter((e) => e === d)
        .transition()
        .duration(300)
        .style("opacity", 1);

      //Tracegroup
      traceGroup.transition().duration(200).style("stroke-opacity", 0.15);
      selectedTraces.forEach((signal) => {
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
    .on("mouseout", (event, d) => {
      nodeGroup.transition().duration(200).style("opacity", 1);
      traceGroup.transition().duration(200).style("stroke-opacity", 1);
    });

  nodeGroup
    .filter((d) => !(showTexts && d.hops[0].name))
    .append("circle")
    .attr("r", (d) => Math.min(d.bounds.width, d.bounds.height) / 2)
    .attr("cx", (d) => d.bounds.cx)
    .attr("cy", (d) => d.bounds.cy);
};
// text
//const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path

var CM = CMT["EN"];

const populateTutorial = () => {
  for (let sect in CM.tutorial.sections) {
    let section = document.createElement("SECTION");
    section.id = sect;
    section.className += "step";
    section.innerHTML = CM.tutorial.sections[sect];

    document.getElementById("slideSections").appendChild(section);
  }

  let links = document.getElementById("slideSections").querySelectorAll("A");

  for (let link of links) {
    link.addEventListener("click", (e) => {
      switch (link.dataset.action) {
        case "scroll":
          smoothScrollTo(link.dataset.target);
          break;

        case "tuto":
          tuto(link.dataset.target);
          break;

        case "openEx":
          ipcRenderer.invoke("openEx", link.dataset.target);
          break;

        case "lastScroll()":
          lastScroll();
          break;
      }
    });
  }
};

window.addEventListener("load", (e) => {
  populateTutorial();
  const svg = d3.select("svg");
  drawFlux(svg, traces, false, true);

  // =========== LANGUAGE SELECTION ===========

  const fs = require("fs");
  const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path

  fs.readFileSync(
    userDataPath + "/PANDORAE/userID/user-id.json",
    "utf8", // Check if the user uses another one
    (err, data) => {
      data = JSON.parse(data);
      CM = CMT[data.locale];
      populateTutorial();
      const svg = d3.select("svg");
      drawFlux(svg, traces, false, true);
    }
  );

  document.getElementById("lang").childNodes.forEach((lg) => {
    lg.addEventListener("click", (e) => {
      CM = CMT[lg.innerText];
      populateTutorial();
      const svg = d3.select("svg");
      drawFlux(svg, traces, false, true);
      fs.readFile(
        userDataPath + "/PANDORAE/userID/user-id.json",
        "utf8",
        (err, data) => {
          data = JSON.parse(data);
          data.locale = lg.innerText;
          data = JSON.stringify(data);
          fs.writeFile(
            userDataPath + "/PANDORAE/userID/user-id.json",
            data,
            "utf8",
            (err) => {
              if (err) throw err;
            }
          );
        }
      );
    });
  });
});
// scroller
let activeIndex = 0;

var sectionList;

const addPadding = () => {
  for (let sect of sectionList) {
    sect.style.paddingTop =
      parseInt((document.body.offsetHeight - sect.clientHeight) / 2) + "px";
  }
};

function scroller() {
  let container = d3.select("body"),
    dispatch = d3.dispatch("active", "progress"),
    sections = null,
    sectionPositions = [],
    currentIndex = -1,
    containerStart = 0;

  function scroll(els) {
    sections = els;
    d3.select(window)
      .on("scroll.scroller", position)
      .on("resize.scroller", resize);

    resize();

    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  function resize() {
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(
        top -
          startPos -
          (window.innerHeight - this.getBoundingClientRect().height) / 2
      );
    });
    containerStart =
      container.node().getBoundingClientRect().top + window.pageYOffset;
  }

  function position() {
    var pos = window.pageYOffset - containerStart;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex) - 1;

    if (currentIndex !== sectionIndex) {
      dispatch.call("active", this, sectionIndex);
      currentIndex = sectionIndex;
      activeIndex = currentIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);

    dispatch.call("progress", this, currentIndex, progress);
  }

  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}

var previous = "";

const smoothScrollTo = (target, hide) => {
  previous = sectionList[activeIndex].id; // Store current section ID
  document.getElementById("backarrow").style.display = "inline-block"; // Display "previous" arrow button
  document
    .getElementById(target)
    .scrollIntoView({ block: "start", behavior: "smooth" }); // Scroll smoothly to target
  if (hide === true) {
    document.getElementById("backarrow").style.display = "none";
  } // If order comes from the "previous" arrow button, hide this button
};

const display = () => {
  var scroll = scroller().container(d3.select("#slideSections"));

  scroll(d3.selectAll(".step"));

  scroll.on("active", function (index) {
    d3.selectAll(".step").style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });
    progress(index);
  });
};

const progress = (index) => {
  var sectionList = document.querySelectorAll("section");
  let progBasis = parseInt(
    (activeIndex / sectionList.length) * window.innerHeight
  );
  let progNext = parseInt((index / sectionList.length) * window.innerHeight);

  var progProc = setInterval(incr, 15);

  function incr() {
    if (progBasis === progNext) {
      clearInterval(progProc);
    } else if (progBasis < progNext) {
      progBasis++;
      document.getElementById("progressBar").style.height = progBasis + "px";
    } else if (progBasis > progNext) {
      progBasis--;
      document.getElementById("progressBar").style.height = progBasis + "px";
    }
  }
};
// tutorialJS

const { ipcRenderer } = require("electron"); // ipcRenderer manages messages with Main Process

ipcRenderer.on("scroll-to", (event, message) => {
  smoothScrollTo(message);
});

const tuto = (step) => {
  ipcRenderer.send("tutorial", step);
  closeWindow();
};

const closeWindow = () => {
  ipcRenderer.send("window-manager", "closeWindow", "tutorial");
};

const closeAndDisplay = () => {
  ipcRenderer.send(
    "chaeros-notification",
    "return to tutorial",
    sectionList[activeIndex].id
  );
  closeWindow();
};

const refreshWindow = () => {
  location.reload();
};

const lastScroll = () => {
  smoothScrollTo("final8");
  document.body.style.animation = "invert 2s";
  document.body.style.animationFillMode = "forwards";
  document.body.style.overflow = "hidden";
  document.getElementById("backarrow").style.display = "none";

  setTimeout(() => {
    let seconds = 10;
    const secMinus = () => {
      seconds = seconds - 1;
      document.getElementById("restartCount").innerHTML =
        "Restarting in:<br>" + seconds;
    };

    setInterval(secMinus, 1000);

    setTimeout(() => {
      ipcRenderer.invoke("restart", true);
    }, 10000);
  }, 7000);
};

window.addEventListener("load", (e) => {
  sectionList = document.querySelectorAll("section");

  document.getElementById("backarrow").addEventListener("click", (e) => {
    smoothScrollTo(previous, true);
  });

  document.getElementById("refresher").addEventListener("click", refreshWindow);

  document
    .getElementById("closeDisplay")
    .addEventListener("click", closeAndDisplay);

  setTimeout(() => {
    //This is important because otherwise the padding is messed up and no event listener will do
    addPadding();
    display();
    document.body.style.animation = "fadein 1s";
    setTimeout(() => {
      document.body.style.opacity = 1;
    }, 950);
  }, 200);
});
