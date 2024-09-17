import { pandodb } from "../db";
import { dataExport } from "../type/data-manager-type";
import { toggleMenu } from "./menu";

const savePNG = () => {
  document.getElementById("icons").style.display = "none";

  document.getElementById("tooltip").style.overflow = "hidden";

  var datasetName = document.getElementById("source").innerText.slice(8);
  datasetName = datasetName.replace(/\//gi, "_");
  datasetName = datasetName.replace(/:/gi, "+");

  ipcRenderer
    .invoke("savePNG", { defaultPath: datasetName + ".png" })
    .then((res) => {
      document.getElementById("icons").style.display = "block";
      document.getElementById("tooltip").style.overflow = "auto";
    });
};

const serialize = (svg) => {
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";

  svg = svg.cloneNode(true);
  const fragment = window.location.href + "#";
  const walker = document.createTreeWalker(
    svg,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  while (walker.nextNode()) {
    for (const attr of walker.currentNode.attributes) {
      if (attr.value.includes(fragment)) {
        attr.value = attr.value.replace(fragment, "#");
      }
    }
  }

  svg.setAttributeNS(xmlns, "xmlns", svgns);
  svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
  const serializer = new window.XMLSerializer();
  const string = serializer.serializeToString(svg);
  var datasetName = document.getElementById("source").innerText.slice(8);
  datasetName = datasetName.replace(/\//gi, "_");
  datasetName = datasetName.replace(/:/gi, "+");

  window.electron.send(
    "console-logs",
    "Exporting snapshot of current type to SVG."
  );
  ipcRenderer
    .invoke("saveSVG", { defaultPath: datasetName + ".svg" }, string)
    .then((res) => {});
};

const saveAs = (format) => {
  toggleMenu();

  setTimeout(() => {
    switch (format) {
      case "svg":
        serialize(document.getElementById("xtypeSVG"));
        break;

      case "png":
        savePNG();
        break;

      //case "interactive":
      //exportToHTML();
      //break;

      case "json":
        //saveToolTip();
        if (dataExport) {
          dataExport();
        }
        break;

      case "description":
        saveToolTip();
        break;

      default:
        break;
    }
  }, 500);
};

const exportToHTML = () => {
  var datasetName = document.getElementById("source").innerText.slice(8);

  ipcRenderer
    .invoke("saveHTML", {
      defaultPath: "PANDORAE-" + currentType.type + ".html",
    })
    .then((res) => {
      let HTMLFILE = fs.createWriteStream(res.filePath);

      HTMLFILE.write('<!DOCTYPE html><html><meta charset="UTF-8">');
      HTMLFILE.write("<title>PANDORÆ - " + datasetName + "</title>");
      HTMLFILE.write(
        '<div id="step-icon" class="themeCustom" ><i class="material-icons">control_camera</i></div><div><form autocomplete="off"><input class="themeCustom" spellcheck="false" type="text" maxlength="36" id="field" value=""></div><div id="xtype">'
      );

      fs.readFile(
        appPath + "/svg/pandorae-app-logo.svg",
        "utf-8",
        (err, pandologo) => {
          HTMLFILE.write(pandologo);

          var logoSettings =
            '<script>var logo = document.getElementById("pandoraeapplogo");logo.style.zIndex=10;logo.style.padding="5px";logo.style.width="15px";logo.style.height="15px";logo.style.cursor="pointer";logo.style.position="absolute";logo.addEventListener("click",e=>{window.open("https://guillaume-levrier.github.io/PANDORAE/")})</script>';

          HTMLFILE.write(logoSettings);

          HTMLFILE.write('<div id="source"></div></div>');

          fs.readFile(appPath + "/css/pandorae.css", "utf-8", (err, css) => {
            HTMLFILE.write("<style>" + css + "</style>");
            HTMLFILE.write(
              '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
            );
            HTMLFILE.write(
              '<link href="https://fonts.googleapis.com/css?family=Noto+Serif&display=swap" rel="stylesheet">'
            );

            pandodb[currentType.type].get(currentType.id).then((dataset) => {
              HTMLFILE.write(
                "<script> var datajson=" + JSON.stringify(dataset) + "</script>"
              );

              fs.readFile(
                appPath + "/node_modules/d3/dist/d3.min.js",
                "utf-8",
                (err, d3) => {
                  HTMLFILE.write("<script>" + d3 + "</script>");

                  fs.readFile(
                    appPath + "/js/types.js",
                    "utf-8",
                    (err, typesJS) => {
                      HTMLFILE.write("<script>");
                      //HTMLFILE.write('var presentationStep='+JSON.parse(presentationStep)+";")
                      HTMLFILE.write(
                        'let tooltip = document.createElement("div");tooltip.id = "tooltip";document.getElementById("xtype").appendChild(tooltip);'
                      );

                      //slicing out module import & export
                      typesJS = typesJS.slice(
                        typesJS.indexOf("//END NODE MODULES"),
                        typesJS.indexOf("// MODULE EXPORT")
                      );

                      var blocks = [
                        "regards",
                        "chronotype",
                        "geotype",
                        "anthropotype",
                        "webArchive",
                        "gazouillotype",
                        "hyphotype",
                        "doxatype",
                        "filotype",
                        "pharmacotype",
                        "fieldotype",
                      ];

                      blocks.forEach((block) => {
                        // remove indexedDB data retrieval
                        typesJS = typesJS.replace(
                          "pandodb." + block + ".get(id).then(datajson => {",
                          "try {"
                        );
                        typesJS = typesJS.replace(
                          ").catch(error => {",
                          "\ncatch (error) { field.value = 'error - invalid dataset'; console.log(error)} //"
                        );
                        // remove loadType function
                        typesJS = typesJS.replace("loadType()", "");
                        typesJS = typesJS.replace(
                          "dataDownload(",
                          "localDownload("
                        );
                      });

                      // remove ipcRenderer communication channels
                      while (typesJS.indexOf("window.electron.send(") > -1) {
                        typesJS = typesJS.replace(
                          "window.electron.send(",
                          "console.log("
                        );
                      }

                      // issue here, openEx has been moved to the main process
                      while (typesJS.indexOf("shell.openExternal") > -1) {
                        typesJS = typesJS.replace(
                          "shell.openExternal",
                          "window.open"
                        );
                      }

                      // remove worker accesses
                      while (
                        typesJS.indexOf("multiThreader.port.postMessage") > -1
                      ) {
                        typesJS = typesJS.replace(
                          "multiThreader.port.postMessage",
                          "//"
                        );
                      }

                      switch (currentType.type) {
                        case "gazouillotype": // won't work for now because the data files are flat files
                          typesJS = typesJS.replace(
                            "multiThreader.port.onmessage = workerAnswer => {",
                            'd3.forceSimulation(circleData).force("x", d3.forceX()).force("y", d3.forceY()).stop(); var gzWorkerAnswer = { type: "gz", msg: circleData }; '
                          );
                          typesJS = typesJS.replace(
                            "}; //======== END OF GZ WORKER ANWSER ===========",
                            ""
                          );

                          break;

                        case "hyphotype":
                          typesJS = typesJS.replace(
                            'if (hyWorkerAnswer.data.type==="tick") {progBarSign(hyWorkerAnswer.data.prog)} else',
                            ""
                          );

                          let step1 =
                            'nodeData.forEach(node => {for (let tag in tags) {if (node.tags.hasOwnProperty("USER")) {} else {node.tags.USER = {};}if (node.tags.USER.hasOwnProperty(tag)) {} else {node.tags.USER[tag] = ["NA"];}}});';

                          let step2 =
                            'var simulation = d3.forceSimulation(nodeData).force("link",d3.forceLink(links).id(d => d.id).distance(0).strength(1)).force("charge", d3.forceManyBody().strength(-600)).force("center", d3.forceCenter(width /2, height / 2)).stop();';

                          let step3 =
                            "for (var i = 0,n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i <= n; ++i) { simulation.tick();let prog = (i/n)*100;};";

                          let step4 =
                            "var contours = d3.contourDensity().size([width, height]).weight(d => d.indegree).x(d => d.x).y(d => d.y).bandwidth(9).thresholds(d3.max(nodeData,d=>d.indegree))(nodeData);";

                          let step5 =
                            'var hyWorkerAnswer={data:{}};hyWorkerAnswer.data={ type: "hy", nodeData: nodeData, links: links, contours:contours };';

                          var workerOperations =
                            step1 + step2 + step3 + step4 + step5;

                          typesJS = typesJS.replace(
                            " multiThreader.port.onmessage = hyWorkerAnswer => {",
                            workerOperations
                          );
                          typesJS = typesJS.replace(
                            "} // end of HY worker answer",
                            ""
                          );

                          break;

                        case "geotype":
                          fs.readFile(
                            appPath + "/node_modules/versor/src/versor.js",
                            "utf-8",
                            (err, versor) => {
                              versor = versor.replace(
                                "export default versor;",
                                ""
                              );

                              typesJS = typesJS.replace(
                                "//versor insertion signal for interactive exports",
                                versor
                              );
                              typesJS = typesJS.replace(
                                "<img src='././svg/OAlogo.svg' height='16px'/>",
                                "[OA]"
                              );

                              fs.readFile(
                                appPath + "/json/world-countries.json",
                                "utf-8",
                                (err, world) => {
                                  typesJS = typesJS.replace(
                                    'Promise.all([d3.json("json/world-countries.json")]).then(geo => {',
                                    "var geo=[" + world + "];"
                                  );
                                  typesJS = typesJS.replace(
                                    "});// end of world-country call",
                                    ""
                                  );

                                  HTMLFILE.write(typesJS);
                                  HTMLFILE.write(
                                    "typeSwitch(" +
                                      JSON.stringify(currentType.type) +
                                      "," +
                                      JSON.stringify(currentType.id) +
                                      ");"
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("field").style.zIndex = "-10";'
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("xtype").style.opacity = "1";'
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("xtype").style.zIndex = "3";'
                                  );
                                  HTMLFILE.write("</script>");
                                  HTMLFILE.end();
                                }
                              );
                            }
                          );
                          break;
                      }

                      if (currentType.type != "geotype") {
                        HTMLFILE.write(typesJS);
                        HTMLFILE.write(
                          "typeSwitch(" +
                            JSON.stringify(currentType.type) +
                            "," +
                            JSON.stringify(currentType.id) +
                            ");"
                        );
                        HTMLFILE.write(
                          'document.getElementById("field").style.zIndex = "-10";'
                        );
                        HTMLFILE.write(
                          'document.getElementById("xtype").style.opacity = "1";'
                        );
                        HTMLFILE.write(
                          'document.getElementById("xtype").style.zIndex = "3";'
                        );
                        HTMLFILE.write("</script>");
                        HTMLFILE.end();
                      }
                    }
                  );
                }
              );
            });
          });
        }
      );
    });
};
