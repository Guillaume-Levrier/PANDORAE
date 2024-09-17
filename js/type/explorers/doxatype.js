// ========= DOXATYPE =========
const doxatype = (id) => {
  var tweetList = document.createElement("div");
  tweetList.id = "tweetList";
  document.getElementById("xtype").append(tweetList);

  //======== DATA CALL & SORT =========

  pandodb.doxatype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var totalTweets = datajson.content;

      var visTweets = [];

      const purgeList = () => {
        var child = tweetList.lastElementChild;
        while (child) {
          tweetList.removeChild(child);
          child = tweetList.lastElementChild;
        }
      };

      const displayTweets = (tweets) => {
        tweets.forEach((tweet) => {
          let thisTweet = document.createElement("div");
          thisTweet.id = tweet.id;
          thisTweet.className = "doxaTweet";
          let url = "https://twitter.com/i/web/status/" + tweet.id;
          thisTweet.innerHTML =
            "<img class='doxaHS' src=" +
            tweet.from_user_profile_image_url +
            ">" +
            "<strong>" +
            tweet.from_user_name +
            "</strong> <i style='cursor:pointer' onclick='shell.openExternal(" +
            JSON.stringify(url) +
            ")'>" +
            tweet.id +
            "</i>" +
            "<br>" +
            tweet.text +
            "<br>" +
            tweet.created_at;
          tweetList.appendChild(thisTweet);
        });
      };

      const updateVisible = () => {
        visTweets = [];
        var options = document.getElementsByClassName("toggleOptions");
        for (let i = 0; i < options.length; i++) {
          if (options[i].checked) {
            for (var cat in totalTweets) {
              if (cat === options[i].id) {
                totalTweets[cat].forEach((tweet) => visTweets.push(tweet));
              }
            }
          }
        }
        purgeList();
        displayTweets(visTweets);
      };

      var toggleList = document.createElement("FORM");
      toggleList.id = "toggleList";

      for (var cat in totalTweets) {
        var toggleOption = document.createElement("INPUT");
        toggleOption.id = cat;
        toggleOption.type = "checkbox";
        toggleOption.className = "toggleOptions";
        toggleOption.onclick = updateVisible;

        var toggleLabel = document.createElement("LABEL");
        toggleLabel.id = "cat";
        toggleLabel.innerText = "(" + totalTweets[cat].length + ") - " + cat;

        toggleList.appendChild(toggleOption);
        toggleList.appendChild(toggleLabel);
        toggleList.appendChild(document.createElement("BR"));
      }

      loadType();
      var title = document.createElement("h2");
      title.innerText = datajson.name;
      document.getElementById("tooltip").appendChild(title);
      document.getElementById("tooltip").appendChild(toggleList);
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - Cannot start corpus";
      window.electron.send(
        "console-logs",
        "Doxa error: cannot start corpus " + id + "."
      );
    });

  window.electron.send("console-logs", "Starting Doxatype");
};
