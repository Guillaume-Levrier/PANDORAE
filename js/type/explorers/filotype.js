// ========= FILOTYPE =========
const filotype = (id) => {
  var svg = d3
    .select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG")
    .style("font-family", "sans-serif");

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

  var color = d3.scaleOrdinal(d3.schemeAccent);

  //======== DATA CALL & SORT =========

  pandodb.filotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      datajson.content.forEach((tweet) => {
        var tweetText = tweet.full_text;
        tweet.mentions = new Array();
        // remove mentions from tweet text
        tweet.entities.user_mentions.forEach((user) => {
          var thisMention = "@" + user.screen_name;
          tweetText = tweetText.replace(thisMention, "");
          tweet.mentions.push(user.name);
        });

        // make several lines out of each tweet
        let line = 0;
        for (let i = 0; i < tweetText.length; i += 60) {
          line++;
          let thisLine = tweetText.slice(i, i + 60);
          if (tweetText[i + 59] != " " && tweetText[i + 60] != " ") {
            thisLine = thisLine + "-";
          }
          tweet["line" + line] = thisLine;
        }
      });

      var tree = (data) => {
        var root = d3
          .stratify()
          .id((d) => d.id_str)
          .parentId((d) => d.in_reply_to_status_id_str)(data);
        root.x = 100;
        root.y = 30;
        return d3.tree().nodeSize([root.x, root.y])(root);
      };

      const root = tree(datajson.content);

      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });

      function elbow(d, i) {
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          "H" +
          d.target.x +
          "V" +
          d.target.y
        );
      }

      var link = view
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 0.2)
        .attr("class", "links")
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", elbow);

      var lineFontSize = parseFloat(width / 500);

      var node = view
        .append("g")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      node
        .append("clipPath")
        .attr("id", function (d, i) {
          return "node_clip" + i;
        })
        .append("circle")
        .attr("r", 5);

      node
        .append("image")
        .attr("y", -lineFontSize * 2)
        .attr("x", -lineFontSize * 2)
        .attr("width", lineFontSize * 4)
        .attr("height", lineFontSize * 4)
        .style("cursor", "cell")
        .attr("xlink:href", (d) => d.data.user.profile_image_url_https)
        .attr("clip-path", function (d, i) {
          return "url(#node_clip" + i + ")";
        })
        .on("click", (event, d) => {
          var id = d.data.id_str;
          var targets = d.descendants();
          let polyPoints = [];
          let targetsY = d3.group(targets, (d) => d.y);

          for (let i = 0; i < targetsY.length; i++) {
            let x = d3.min(targetsY[i].values, (d) => d.x);
            let y = parseFloat(targetsY[i].key);
            polyPoints.push([x, y]);
          }

          for (let i = targetsY.length - 1; i > 0; i = i - 1) {
            let x = d3.max(targetsY[i].values, (d) => d.x) + 100;
            let y = parseFloat(targetsY[i].key);
            polyPoints.push([x, y]);
          }

          var line = d3.line().curve(d3.curveCardinalClosed)(polyPoints);

          if (document.getElementById(id)) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
          } else {
            var highlighted = view
              .append("path")
              .attr("d", line)
              .attr("id", id)
              .attr("stroke", color(id))
              .style("fill", "transparent");
            highlighted.lower();
          }
        });

      node
        .append("text")
        .attr("dy", -2)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize * 2)
        .text((d) => d.data.user.name)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", 1.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize / 2)
        .text((d) => d.data.id_str)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          d3.select("#tooltip").html(
            '<p class="legend"><strong><a target="_blank" href="https://mobile.twitter.com/' +
              d.data.user.name +
              '">' +
              d.data.user.name +
              '</a></strong> <br/><div style="border:1px solid black;"><p>' +
              d.data.full_text +
              "</p></div><br><br> Language: " +
              d.data.user.lang +
              "<br>Mentions: " +
              d.data.mentions +
              "<br>Date: " +
              d.data.created_at +
              "<br> Favorite count: " +
              d.data.favorite_count +
              "<br>Retweet count: " +
              d.data.retweet_count +
              "<br> Source: " +
              d.data.source +
              "<br>Tweet id: <a target='_blank' href='https://mobile.twitter.com/" +
              d.data.user.screen_name +
              "/status/" +
              d.data.id_str +
              "'>" +
              d.data.id_str +
              "</a>" +
              "<br><br><strong>User info</strong><br><img src='" +
              d.data.user.profile_image_url_https +
              "' max-width='300'><br><br>Account creation date: " +
              d.data.user.created_at +
              "<br> Account name: " +
              d.data.user.screen_name +
              "<br> User id: " +
              d.data.user.id +
              "<br> User description: " +
              d.data.user.description +
              "<br> User follower count: " +
              d.data.user.followers_count +
              "<br> User friend count: " +
              d.data.user.friends_count +
              "<br> User tweet count: " +
              d.data.user.statuses_count
          );
        });

      node
        .append("text")
        .attr("dy", lineFontSize * 2)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line1)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 3.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line2)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line3)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 6.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line4)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 8)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line5)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 9.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line6)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 11)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line7)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 12.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line8)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 14)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line9)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      loadType();
    })
    .catch((error) => {
      console.log(error);
      field.value = "filotype error";
      window.electron.send(
        "console-logs",
        "Filotype error: cannot start corpus " + id + "."
      );
    });

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom, transTime) => view.attr("transform", thatZoom);

  window.electron.send("console-logs", "Starting Filotype");
};
