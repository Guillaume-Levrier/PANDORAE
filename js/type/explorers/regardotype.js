import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";
import { pandodb } from "../../db";
import { dataDownload } from "../data-manager-type";

// ========== regardotype ==========
const regards = (id) => {
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

  //console.log(id);

  zoom
    .scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ]) // Extent to which one can go up/down/left/right
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  pandodb.regards
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      console.log(datajson);

      let chronoData = {};

      for (const key in datajson.content) {
        datajson.content[key].forEach((val) => {
          if (key != "seances" && key != "texteloi") {
            let date = val.content.date;
            if (chronoData.hasOwnProperty(date)) {
            } else {
              chronoData[date] = {};
            }
            if (chronoData[date].hasOwnProperty(key)) {
            } else {
              chronoData[date][key] = [];
            }
            chronoData[date][key].push(val);
          }
        });
      }

      const data = { name: "regards", children: [] };

      for (const key in chronoData) {
        let child = { name: key, date: key, children: [] };
        for (const prop in chronoData[key]) {
          chronoData[key][prop].forEach((d) => {
            if (d.content.hasOwnProperty("sujet")) {
              d.name =
                d.content["auteur_groupe_acronyme"] +
                " " +
                d.content.signataires +
                " | " +
                d.content.sujet +
                " | " +
                d.content.id;
            } else if (d.content.hasOwnProperty("intervenant_nom")) {
              d.name =
                d.content["intervenant_groupe"] +
                " " +
                d.content["intervenant_nom"] +
                " | " +
                d.content.id;
            } else if (d.content.hasOwnProperty("question")) {
              d.name =
                d.content["parlementaire_groupe_acronyme"] +
                " " +
                d.content.aut.depute.nom +
                " | " +
                d.content.id;
            }
          });

          chronoData[key][prop].sort((a, b) => a.content.id - b.content.id);

          child.children.push({ name: prop, children: chronoData[key][prop] });
        }
        data.children.push(child);
      }

      const tree = (data) => {
        const root = d3
          .hierarchy(data)
          .sort(
            (a, b) =>
              d3.ascending(a.data.date, b.data.date) ||
              d3.ascending(a.document_id, b.document_id)
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

      function toolBuidlder(d) {
        if (d.depth === 3) {
          var dt = d.data.content;

          if (dt.hasOwnProperty("contenu")) {
            // intervention
            tooltip.innerHTML =
              "<h3>" +
              dt.intervenant_nom +
              "</h3><h4>" +
              dt.intervenant_fonction +
              "</h4>" +
              dt.intervenant_groupe +
              "<br><span style='text-decoration: underline;'>" +
              dt.seance_lieu +
              "</span><br>" +
              dt.seance_titre +
              "<br>" +
              dt.type +
              "<br>" +
              dt.contenu;
          } else if (dt.hasOwnProperty("expose")) {
            // amendement
            tooltip.innerHTML =
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
          } else if (dt.hasOwnProperty("question")) {
            tooltip.innerHTML =
              "<h3>" +
              dt.aut.depute.nom +
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
          }
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
          toolBuidlder(d);
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
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      window.electron.send(
        "console-logs",
        "Regards chronology error: dataset " + id + " is invalid."
      );
    });
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
};

export { regards };
