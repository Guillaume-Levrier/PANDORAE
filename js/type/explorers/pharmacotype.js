import * as d3 from "d3";
import { width, height, toolWidth, loadType } from "../type-common-functions";
import { pandodb } from "../../db";
import { dataDownload } from "../data-manager-type";

const pharmacotype = (id) => {
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view");

  zoom
    .scaleExtent([0.2, 20]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  var x = d3.scaleTime(); // Y axis scale

  var xAxis = d3
    .axisBottom(x) // Actual Y axis
    .scale(x) // Scale is declared just above
    .ticks(5) // 20 ticks are displayed
    .tickSize(height) // Ticks are vertical lines
    .tickPadding(10 - height); // Ticks start and end out of the screen

  var y = d3.scalePoint();

  //======== DATA CALL & SORT =========

  pandodb.pharmacotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var data = datajson.content.entries;

      var trialNames = [];

      const clinTriDateParser = (date) => {
        if (date) {
          var fullParseTime = d3.timeParse("%B %d, %Y");
          var partialParseTime = d3.timeParse("%B %Y");

          if (date.search(",") > -1) {
            return fullParseTime(date);
          } else {
            return partialParseTime(date);
          }
        }
      };

      data.forEach((d) => {
        d.id = d.Study.ProtocolSection.IdentificationModule.BriefTitle;
        trialNames.push(d.id);
        d.highlighted = 0;

        if (d.Study.ProtocolSection.DesignModule.hasOwnProperty("PhaseList")) {
          let phases = d.Study.ProtocolSection.DesignModule.PhaseList.Phase;
          let phase = phases[phases.length - 1].slice(-1);

          if (parseInt(phase)) {
            d.currentPhase = phase;
          } else {
            d.currentPhase = 0;
          }
        } else {
          d.currentPhase = 0;
        }

        d.StudyFirstSubmitDate = clinTriDateParser(
          d.Study.ProtocolSection.StatusModule.StudyFirstSubmitDate
        );

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty("StartDateStruct")
        ) {
          d.StartDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.StartDateStruct.StartDate
          );
        }

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty(
            "PrimaryCompletionDateStruct"
          )
        ) {
          d.PrimaryCompletionDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.PrimaryCompletionDateStruct
              .PrimaryCompletionDate
          );
        }

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty(
            "CompletionDateStruct"
          )
        ) {
          d.CompletionDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.CompletionDateStruct
              .CompletionDate
          );
        }
      });

      x.domain([data[0].StudyFirstSubmitDate, new Date("2025")]) // First shows a range from minus one year to plus one year
        .range([0, width - toolWidth]); // Size on screen is full height of client

      y.domain(trialNames)
        .rangeRound([0, 20 * data.length])
        .padding(1);

      const g = view
        .append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${y(d.id)})`);

      g.append("line")
        .attr("stroke", "#aaa")
        .attr("x1", (d) => x(d.StudyFirstSubmitDate))
        .attr("x2", (d) => x(d.CompletionDate));

      g.append("circle")
        .attr("cx", (d) => x(d.StudyFirstSubmitDate))
        .attr("fill", "rgb(209, 60, 75)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.StartDate))
        .attr("fill", "rgb(252, 172, 99)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.PrimaryCompletionDate))
        .attr("fill", "rgb(169, 220, 162)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.CompletionDate))
        .attr("fill", "rgb(66, 136, 181)")
        .attr("r", 3.5);

      var titles = g
        .append("text")
        .attr("fill", "black")
        .style("font-size", 8)
        .attr("id", (d) => JSON.stringify(d.Rank))
        .attr("x", (d) => x(d.CompletionDate))
        .attr("dx", 8)
        .attr("dy", 3)
        .style("cursor", "pointer")
        .text((d) => d.id)
        .on("click", (event, d) => {
          let idMod = d.Study.ProtocolSection.IdentificationModule;
          let statMod = d.Study.ProtocolSection.StatusModule;
          let descMod = d.Study.ProtocolSection.DescriptionModule;
          let overSight = d.Study.ProtocolSection.OversightModule;

          const openButton = document.createElement("button");
          openButton.innerText = "Open on ClinicalTrials.gov";

          openButton.addEventListener("click", (e) =>
            window.electron.invoke(
              "openEx",
              "https://clinicaltrials.gov/ct2/show/" + idMod.NCTId
            )
          );

          const trialDesc = document.createElement("div");

          trialDesc.innerHTML =
            "<h2>" +
            idMod.BriefTitle +
            "</h2>" +
            "<h3>" +
            idMod.Organization.OrgFullName +
            " - " +
            idMod.Organization.OrgClass.toLowerCase() +
            "</h3>" +
            "<br>" +
            "<strong>Full title:</strong> " +
            idMod.OfficialTitle +
            "<br>" +
            "<strong>NCTId:</strong> " +
            idMod.NCTId +
            "<br>" +
            "<strong>Org Id:</strong> " +
            idMod.OrgStudyIdInfo.OrgStudyId +
            "<br>" +
            "<br>" +
            "<h3>Status</h3>" +
            "<strong>Overall status:</strong> " +
            statMod.OverallStatus +
            "<br>" +
            "<strong>Last verified:</strong> " +
            statMod.StatusVerifiedDate +
            "<br>" +
            "<strong>Expanded access:</strong> " +
            statMod.ExpandedAccessInfo.HasExpandedAccess +
            "<br>" +
            "<strong>FDA regulated:</strong> Drug [" +
            overSight.IsFDARegulatedDrug +
            "] - Device [" +
            overSight.IsFDARegulatedDevice +
            "]<br>" +
            "<h3>Description</h3>" +
            "<strong>Brief summary:</strong> " +
            descMod.BriefSummary +
            "<br>" +
            "<br>" +
            "<strong>Detailed description:</strong> " +
            descMod.DetailedDescription +
            "<br>";

          tooltip.innerHTML = "";

          tooltip.append(openButton, trialDesc);

          if (
            document.getElementById(JSON.stringify(d.Rank)).style.fill ===
            "black"
          ) {
            document.getElementById(JSON.stringify(d.Rank)).style.fill = "blue";
            d.highlighted = 1;
          } else {
            document.getElementById(JSON.stringify(d.Rank)).style.fill =
              "black";
            d.highlighted = 0;
          }
        });

      var titleAlignDistance = d3.max(data, (d) => x(d.CompletionDate) + 8);

      var aligned = false;

      const alignTrialTitles = () => {
        const distance = (trial) =>
          titleAlignDistance - x(trial.CompletionDate) + 8;

        if (aligned) {
          titles
            .transition()
            .delay((d, i) => i * 10)
            .attr("transform", (d) => `translate(${0},0)`);
          aligned = false;
        } else {
          titles
            .transition()
            .delay((d, i) => i * 10)
            .attr("transform", (d) => `translate(${distance(d)},0)`);
          aligned = true;
        }
      };

      const sortTrials = (criteria) => {
        var permute;

        switch (criteria) {
          case "Highlighted":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[j].highlighted - data[i].highlighted)
            );
            break;

          case "Type of organisation":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort(
                  (i, j) =>
                    data[i].Study.ProtocolSection.IdentificationModule
                      .Organization.OrgClass.length -
                    data[j].Study.ProtocolSection.IdentificationModule
                      .Organization.OrgClass.length
                )
            );
            titles.text(
              (d) =>
                d.id +
                " - " +
                d.Study.ProtocolSection.IdentificationModule.Organization
                  .OrgClass
            );
            break;

          case "Start date":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].StartDate - data[j].StartDate)
            );
            break;

          case "Completion date":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].CompletionDate - data[j].CompletionDate)
            );
            break;

          case "Phase":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].currentPhase - data[j].currentPhase)
            );
            titles.text((d) => d.id + " - Phase: " + d.currentPhase);

            break;
        }

        y.domain(permute);

        g.transition()
          .delay((d, i) => i * 10)
          .attr("transform", (d) => `translate(0,${y(d.id)})`);
      };

      var criteriaList = [
        "Highlighted",
        "Type of organisation",
        "Start date",
        "Completion date",
        "Phase",
      ];

      var sortingList = document.createElement("div");
      sortingList.id = "sortingList";
      sortingList.style =
        "left:50px;cursor:pointer;position:absolute;font-size:12px;text-align:center;margin:auto;z-index:15;top:130px;background-color:white;border: 1px solid rgb(230,230,230);display:none";

      criteriaList.forEach((crit) => {
        var thisCrit = document.createElement("div");
        thisCrit.id = crit;
        thisCrit.innerText = crit;
        thisCrit.className = "dialog-buttons";
        thisCrit.style = "width:100%;text-align:center;padding:2px;margin:2px;";
        thisCrit.addEventListener("click", (e) => sortTrials(crit));
        sortingList.appendChild(thisCrit);
      });

      document.body.appendChild(sortingList);

      const trialSorter = () => {
        if (sortingList.style.display === "none") {
          sortingList.style.display = "block";
        } else {
          sortingList.style.display = "none";
        }
      };

      iconCreator("sort-icon", trialSorter, "Sort by property");
      iconCreator("align-icon", alignTrialTitles, "Align titles");

      loadType();
    })
    .catch((error) => {
      console.log(error);
      field.value = " error";
      window.electron.send(
        "console-logs",
        " error: cannot start corpus " + id + "."
      );
    });

  //======== ZOOM & RESCALE ===========

  var legend = svg.append("g").attr("id", "legend");

  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", height - 70)
    .attr("width", 170)
    .attr("height", 50)
    .attr("fill", "white")
    .attr("stroke", "black");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 60)
    .attr("fill", "rgb(209, 60, 75)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 60)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("FIRST SUBMIT DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 50)
    .attr("fill", "rgb(252, 172, 99)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 50)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("START DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 40)
    .attr("fill", "rgb(169, 220, 162)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 40)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("PRIMARY COMPLETION DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 30)
    .attr("fill", "rgb(66, 136, 181)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 30)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("COMPLETION DATE");

  svg.call(zoom).on("dblclick.zoom", null);

  var gX = svg
    .append("g")
    .attr("class", "axis axis--x")
    .style("stroke-opacity", 0.1)
    .call(xAxis);

  zoomed = (thatZoom, transTime) => {
    view.attr("transform", thatZoom);
    gX.call(xAxis.scale(thatZoom.rescaleX(x)));
    gX.lower();
  };
  window.electron.send("console-logs", "Starting Pharmacotype");
};

export { pharmacotype };
