import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";

import { dataDownload } from "../data-manager-type";
import { setkeylock } from "../../pandorae-interface/keyboard-shortcuts";

// ========== regardotype ==========
const parliament = (datajson) => {
  // When called, draw the regards chronology

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

  const zoomed = (thatZoom) => view.attr("transform", thatZoom);

  const zoom = d3.zoom().on("zoom", zoomed);

  zoom
    .scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ]) // Extent to which one can go up/down/left/right
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  dataDownload(datajson);

  let chronoData = {};

  const dataMap = {};

  datajson.data.forEach((d) => {
    const type = d.note.document_type.toLowerCase();

    if (!dataMap.hasOwnProperty(type)) {
      dataMap[type] = [];
    }

    dataMap[type].push(d);

    if (type != "seances" && type != "texteloi") {
      const date = new Date(d.note.date).toDateString();
      if (chronoData.hasOwnProperty(date)) {
      } else {
        chronoData[date] = {};
      }
      if (chronoData[date].hasOwnProperty(type)) {
      } else {
        chronoData[date][type] = [];
      }
      chronoData[date][type].push(d);
    }
  });

  const data = { name: "regards", children: [] };

  for (const key in chronoData) {
    let child = { name: key, date: key, children: [] };
    for (const prop in chronoData[key]) {
      chronoData[key][prop].forEach((d) => {
        switch (d.note.document_type) {
          case "QuestionEcrite":
            d.name =
              d.note["parlementaire_groupe_acronyme"] +
              " " +
              d.note.aut.depute.nom +
              " | " +
              d.note.id;
            break;

          case "Amendement":
            d.name =
              d.note["auteur_groupe_acronyme"] +
              " " +
              d.note.signataires +
              " | " +
              d.note.sujet +
              " | " +
              d.note.id;
            break;
          case "Intervention":
            d.name = "";
            if (d.note.hasOwnProperty("aut")) {
              d.name = d.note.aut.depute.groupe_sigle + " ";
            }
            d.name += d.title + " " + d.note.id;
            break;
          default:
            break;
        }
        if (d.note.hasOwnProperty("sujet")) {
        } else if (d.note.hasOwnProperty("intervenant_nom")) {
        }
      });

      chronoData[key][prop].sort((a, b) => a.note.id - b.note.id);

      child.children.push({
        name: prop,
        children: chronoData[key][prop],
      });
    }
    data.children.push(child);
  }

  const tree = (data) => {
    const root = d3.hierarchy(data).sort(
      (a, b) => d3.ascending(new Date(a.data.date), new Date(b.data.date)) //||
      //d3.ascending(a.document_id, b.document_id)
    );
    root.dx = 20;
    root.dy = width / (root.height + 3);
    return d3.cluster().nodeSize([root.dx, root.dy])(root);
  };

  const root = tree(data);

  const link = view
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .style("display", (d) => (d.source.depth === 0 ? "none" : "block"))
    .attr(
      "d",
      (d) => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
           ${d.source.y + root.dy / 2},${d.source.x}
           ${d.source.y},${d.source.x}
        `
    );

  const node = view
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node
    .append("circle")
    .style("display", (d) => (d.depth === 0 ? "none" : "block"))
    .attr("fill", (d) => (d.children ? "#555" : "#999"))
    .attr("r", 2.5);

  let previousSearch = 0;

  function toolBuilder(d) {
    if (d.depth === 3) {
      tooltip.innerHTML = "";

      const dt = d.data.note;
      const docContent = document.createElement("div");

      switch (dt.document_type) {
        case "QuestionEcrite":
          var nom = dt.hasOwnProperty("aut") ? dt.aut.depute.nom : "";

          docContent.innerHTML +=
            "<h3>" +
            nom +
            "</h3><h4>" +
            dt.themes +
            "</h4>" +
            dt.parlementaire_groupe_acronyme +
            "<br><span style='text-decoration: underline;'>Destinataire: " +
            dt.ministere +
            "</span><br><br><strong>Question:</strong> " +
            dt.question +
            "<br><br> <strong>Réponse:</strong> " +
            dt.reponse;
          break;

        case "texteLoi":
        case "Amendement":
          docContent.innerHTML +=
            "<h3>" +
            dt.signataires +
            "</h3><h4>" +
            dt.sujet +
            "</h4>" +
            dt.auteur_groupe_acronyme +
            "<br><span style='text-decoration: underline;'>Statut: " +
            dt.sort +
            "</span><br>Texte de loi: " +
            dt.texteloi_id +
            "<br><br> <strong>Exposé des motifs:</strong>" +
            dt.expose +
            "<br><br> <strong>Contenu de l'amendement:</strong><br>" +
            dt.texte;
          break;

        case "Intervention":
          console.log(dt);
          var nom = dt.hasOwnProperty("aut") ? dt.aut.depute.nom : "";

          if (nom === "" && dt.hasOwnProperty("fonction")) {
            nom = dt.fonction;
          }

          docContent.innerHTML += "<h3>" + nom + "</h3>";

          if (dt.hasOwnProperty("aut")) {
            if (dt.aut.hasOwnProperty("depute")) {
              docContent.innerHTML += `
              <div style="padding:5px;margin:5px;border:1px dashed #141414">
              <div><span style="text-decoration: underline;">Appartenance:</span> ${dt.aut.depute.groupe_sigle} - ${dt.aut.depute.parti_ratt_financier}</div>
              <div><span style="text-decoration: underline;">Naissance:</span> ${dt.aut.depute.date_naissance} - ${dt.aut.depute.lieu_naissance}</div>
              <div><span style="text-decoration: underline;">Circonscription:</span> ${dt.aut.depute.num_circo} ${dt.aut.depute.nom_circo} (${dt.aut.depute.num_deptmt})</div>
              </div>
              `;
            }
          }

          docContent.innerHTML += `<hr>Ouvrir sur <a href="${dt.source}" target="_blank">assemblee-nationale.fr </a><hr>`;

          docContent.innerHTML += dt.intervention;

          break;
        default:
          break;
      }

      const toolSearch = document.createElement("input");
      const toolResult = document.createElement("div");

      toolSearch.style =
        "padding:5px;border: 0px;border-bottom: 1px solid red;";
      toolSearch.type = "text";
      toolSearch.placeholder = "Search term or expression";

      toolSearch.addEventListener("focusin", () => setkeylock(1));
      toolSearch.addEventListener("focusout", () => setkeylock(0));

      const searchTerm = () => {
        toolResult.innerHTML =
          "Fragments from the content of the document:<br><br>";
        var sliced = "";

        const target = toolSearch.value;
        previousSearch = target;

        const doc = { content: docContent.textContent };

        if (target.length > 2) {
          var re = new RegExp(target, "gi"),
            str = doc.content;
          let match;

          var count = 0;

          while ((match = re.exec(str)) != null) {
            // var extrait = doc.content.substring(match.index - 150, match.index + 150)
            //.replace(target, "<mark>" + target + "</mark>")

            const extrait =
              doc.content.substring(match.index - 150, match.index) +
              "<mark>" +
              doc.content.substring(match.index, match.index + target.length) +
              "</mark>" +
              doc.content.substring(
                match.index + target.length,
                match.index + 150
              );

            if (count > 0) sliced += "<br><hr><br>";
            sliced += extrait;
            count++;
          }
          if (count === 0) {
            sliced = `Expression "${target}" not found`;
          }

          toolResult.innerHTML =
            "<div style = 'border:1px solid black; padding:5px;margin-top:10px;'>" +
            sliced +
            "</div><br><hr><br>";
        }
      };

      if (previousSearch) {
        toolSearch.value = previousSearch;
        searchTerm();
      }

      toolSearch.addEventListener("change", searchTerm);
      tooltip.append(toolSearch, toolResult, docContent);
    }
  }

  view.style("user-select", "none");

  node
    .append("text")
    .attr("dy", "0.31em")
    .style("font-size", "12px")
    .style("font-family", "sans-serif")
    .style("cursor", (d) => (d.depth === 3 ? "pointer" : "auto"))
    .attr("x", (d) => (d.children ? -6 : 6))
    .text((d) => d.data.name)
    .on("click", (event, d) => {
      d3.selectAll("text").style("font-weight", "normal");
      let el = event.currentTarget;
      el.style.fontWeight = "bolder";

      toolBuilder(d);
    })
    .style("display", (d) => (d.depth === 0 ? "none" : "block"))
    .filter((d) => d.children)
    .attr("text-anchor", "end")
    .clone(true)
    .lower()
    .style("display", (d) => (d.depth === 0 ? "none" : "block"))
    .attr("stroke", "white");

  let timeline = {
    x1: root.children[0].y,
    y1: root.children[0].x,
    x2: root.children[root.children.length - 1].y,
    y2: root.children[root.children.length - 1].x,
  };

  var tl = view
    .append("line")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .attr("x1", timeline.x1)
    .attr("x2", timeline.x2)
    .attr("y1", timeline.y1)
    .attr("y2", timeline.y2)
    .lower();

  loadType();

  view.attr("transform", "translate(" + -width / 3 + ",0)");

  /* .catch((error) => {
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Regards chronology error: dataset " + id + " is invalid."
      );
    }); */
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
};

export { parliament };
