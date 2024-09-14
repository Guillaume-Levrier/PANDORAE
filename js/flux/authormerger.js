//==== Manual Merging of Authors ====
// This one is a bit trick because it can be quite computationnaly intensive and yet has to stay in FLUX.
// Maybe some chaeros-led hand curation will have to happen at some point, maybe not.
// Might be worth it making FLUX bigger for that purpose. (upsize then downsize when over)

const manualMergeAuthors = () => {
  // find the dataset name
  const dataname = document.getElementById("manual-dataset-preview").name;

  // DOM interface (buttons)
  const mergeCont = document.getElementById("mergeCont");
  mergeCont.style = "border:1px solid #141414;padding:5px;";

  var authors = 0;

  const downloadMerged = document.createElement("div");
  downloadMerged.id = "dlmerged";
  downloadMerged.style = "margin:5px";
  downloadMerged.className = "flux-button";
  downloadMerged.innerText = "Download Merged Authors";

  const saveMerged = document.createElement("div");
  saveMerged.id = "saveMerged";
  saveMerged.style = "margin:5px";
  saveMerged.className = "flux-button";
  saveMerged.innerText = "Update dataset with merged authors";

  // merging data
  var authorMergeMap = {};

  // this function is for saving only;
  //rebuild the author merge map when saving using the longest name
  //and the attribute this to all articles;

  const updateArticles = (dataset, authorMergeMap) => {
    const completeMap = {};
    // step 1 - rebuild merge map;
    for (const author in authorMergeMap) {
      // list all possibilities
      const thisAuthor = authorMergeMap[author];
      const thisAuthorList = [author];
      for (const alias in thisAuthor) {
        thisAuthorList.push(alias);
      }
      const sortedList = thisAuthorList.sort((a, b) => b.length - a.length);
      const mainAlias = sortedList[0];
      sortedList.forEach((auth) => (completeMap[auth] = mainAlias));
    }

    // step 2 - attribute to articles
    dataset.content.forEach((article) => {
      article.creators.forEach((author) => {
        const concat = author.lastName + " | " + author.firstName;
        if (
          completeMap.hasOwnProperty(concat) &&
          authors[completeMap[concat]]
        ) {
          author.lastName = authors[completeMap[concat]].lastName;

          author.firstName = authors[completeMap[concat]].firstName;
        }
        delete author.concat;
        delete author.alias;
        delete author.artlist;
        delete author.distances;
      });
    });
  };

  var dataset;

  saveMerged.addEventListener("click", (e) => {
    e.preventDefault();

    dataset.id = "merged_" + dataset.name + date();
    dataset.name = "merged_" + dataset.name;

    dataset.date = date();

    if (!dataset.hasOwnProperty("mergeMap")) {
      dataset.mergeMap = {};
    }
    dataset.mergeMap.authorMergeMap = authorMergeMap;

    updateArticles(dataset, authorMergeMap);

    pandodb.csljson
      .add(dataset)
      .then(() => {
        window.electron.send("coreSignal", "Saved author merging"); // Sending notification to console
        window.electron.send(
          "console-logs",
          "Saved author merging " + dataset.id
        ); // Sending notification to console
        setTimeout(() => {
          console.log("closing window");
          closeWindow();
        }, 500);
      })
      .catch((err) => console.log(err));
  });

  const uploadMergeMapCont = document.createElement("div");
  uploadMergeMapCont.style = "margin:5px";
  const uploadMergeMapLabel = document.createElement("label");
  const br = document.createElement("br");
  uploadMergeMapLabel.innerText = "Add an author merge directory";
  const uploadMergeMapInput = document.createElement("input");
  uploadMergeMapInput.type = "file";
  uploadMergeMapInput.id = "authorMergeDirectory";
  uploadMergeMapInput.name = "authorMergeDirectory";
  uploadMergeMapInput.accept = "application/json";

  uploadMergeMapInput.addEventListener("change", () => {
    const curFiles = uploadMergeMapInput.files;
    const doc = curFiles[0];

    fs.readFile(doc.path, "utf8", (err, data) => {
      const dataparsed = JSON.parse(data);
      for (const auth in dataparsed) {
        authorMergeMap[auth] = dataparsed[auth];
      }
      refreshMergeMap();
    });
  });

  uploadMergeMapCont.append(uploadMergeMapLabel, br, uploadMergeMapInput);

  const mergeMapList = document.createElement("ul");

  document
    .getElementById("mergeMap")
    .append(uploadMergeMapCont, downloadMerged, saveMerged, mergeMapList);

  const dist = (a, b) => {
    if (typeof a === "string" && typeof b === "string") {
      return distance(a.toLowerCase(), b.toLowerCase());
    } else {
      return 0;
    }
  };

  function sortAuthors(data) {
    var nameMap = {};

    data.content.forEach((article) => {
      article.creators.forEach((author) => {
        if (author.lastName) {
          if (!author.firstName) {
            author.firstName = "";
          }

          const concat = author.lastName + " | " + author.firstName;
          author.concat = concat;
          author.alias = [
            { concat, lastName: author.lastName, firstName: author.firstName },
          ];

          if (!nameMap.hasOwnProperty(concat)) {
            author.artlist = [];
            nameMap[concat] = author;
          }
          nameMap[concat].artlist.push(article.DOI);
        }
      });
    });

    const nameList = [];

    for (const nm in nameMap) {
      nameList.push(nameMap[nm]);
    }

    nameMap = {};

    nameList.forEach((author) => {
      const distances = [];
      nameList.forEach((other) => {
        const score =
          dist(author.lastName, other.lastName) +
          Math.ceil(dist(author.firstName, other.firstName) / 3);

        distances.push({ name: other.concat, score });
      });

      const sorted = distances.sort((a, b) => a.score - b.score);

      const limitedlist = [];

      let len = 10;

      if (nameList.length <= 50) {
        len = nameList.length;
      } else {
        if (author.lastName.length < 6) {
          len = 250;
        } else {
          len = 50;
        }
      }

      for (let i = 0; i < len; i++) {
        if (sorted[i].score < 10) {
          limitedlist.push(sorted[i]);
        }
      }

      author.distances = limitedlist;
      nameMap[author.concat] = author;
    });

    return nameMap;
  }

  const listAuthors = (nameMap) => {
    const list = [];
    for (const n in nameMap) {
      const p = nameMap[n];
      list.push({ name: p.concat, articles: p.artlist.length });
    }

    return list.sort((a, b) => b.articles - a.articles);
  };

  function displayAuthor(auth, distanced) {
    const cont = document.createElement("div");

    const merge = document.createElement("button");
    merge.innerText = "Merge";

    if (auth) {
      const name = auth.name;

      cont.style =
        "height:500px;overflow-y:scroll;border : 1px solid #141414;padding:5px;font-family:sans-serif";
      const title = document.createElement("h3");
      title.innerText = auth.concat;
      const articles = document.createElement("ul");
      articles.style = "font-family:monospace;font-size:10px";
      for (let i = 0; i < 5; ++i) {
        const art = auth.artlist[i];
        if (art) {
          const article = document.createElement("li");
          article.innerHTML = `<a target="_blank" href="https://doi.org/${art}">${art}</a>`;
          articles.append(article);
        }
      }

      const names = document.createElement("div");

      for (let i = 0; i < auth.distances.length; ++i) {
        const p = auth.distances[i];
        if (p.score > 0) {
          const namecont = document.createElement("div");
          namecont.style.display = "flex";
          const namebox = document.createElement("input");
          namebox.type = "checkbox";
          namebox.className = "checkbox";
          namebox.id = p.name;
          namebox.name = p.name;

          const nameLabel = document.createElement("label");
          nameLabel.for = p.name;
          nameLabel.style =
            "display: flex;width: 300px;justify-content: space-between;padding:3px";

          let refs = "";

          if (distanced[p.name]) {
            const autharticles = distanced[p.name].artlist;

            for (let j = 0; j < 5; ++j) {
              if (autharticles[j]) {
                refs += `[<a target="_blank" href="https://doi.org/${
                  autharticles[j]
                }">${j + 1}</a>] `;
              }
            }
          }
          nameLabel.innerHTML = `<div style="display:flex">${p.name} &nbsp;<div style="font-size:10px"> ${refs}</div></div><div> ${p.score}</div>`;

          namecont.append(namebox, nameLabel);
          names.append(namecont);
        }
      }

      merge.addEventListener("click", (e) => {
        e.preventDefault();

        const res = {};

        // do not add this because this will be the main alias, and
        // it will have to be kept in the main auth directory, the
        // other ones will be deleted
        //res[auth.concat] = 1;
        const boxes = document.getElementsByClassName("checkbox");

        for (let i = 0; i < boxes.length; ++i) {
          if (boxes[i].checked) {
            res[boxes[i].id] = 1;
          }
        }
        authorMergeMap[auth.concat] = res;

        cont.innerHTML = "";

        refreshMergeMap();
      });

      cont.append(title, articles, merge, names);
    } else {
      cont.innerText = "Choose an author to start";
    }
    return cont;
  }

  function regenAuthorList() {
    const manselect = document.getElementById("manualSelector");
    manselect.innerHTML = "";
    const field = document.createElement("fieldset");
    field.style =
      "display: flex;flex-direction: column;height:180px;overflow-y:scroll;padding:5px;border:1px solid #141414;";

    const list = listAuthors(authors);

    list.forEach((auth) => {
      try {
        const div = document.createElement("div");
        div.style.display = "inline-flex";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "author";

        const thisAuthor = authors[auth.name];

        input.addEventListener("click", () => {
          const details = document.getElementById("detailSelector");
          details.innerHTML = "";

          details.append(displayAuthor(thisAuthor, authors));
        });

        const color = authorMergeMap.hasOwnProperty(auth.name)
          ? "blue"
          : "black";

        const label = document.createElement("label");
        label.style = `display: inline-flex;justify-content: space-between;width: 100%;flex-direction: row;color:${color}`;
        label.innerHTML = `<div>${auth.name}</div><div>${auth.articles}</div>`;

        div.append(input, label);
        field.append(div);
      } catch (error) {
        console.log(error);
      }
    });

    manselect.append(field);
  }

  const refreshMergeMap = () => {
    mergeMapList.innerHTML = "";

    for (const name in authorMergeMap) {
      const point = document.createElement("li");
      point.innerText = name + " - aliases: ";

      // getting slightly mad over here

      for (const d in authorMergeMap[name]) {
        point.innerText += " [" + d + "] ";

        if (authors.hasOwnProperty(d)) {
          authors[name].alias.push({
            concat: authors[d].concat,
            firstName: authors[d].firstName,
            lastName: authors[d].lastName,
          });
          authors[name].artlist = [
            ...authors[name].artlist,
            ...authors[d].artlist,
          ];
          delete authors[d];
        }
      }

      mergeMapList.append(point);
    }

    regenAuthorList();
  };

  pandodb.csljson
    .get(dataname)
    .then((data) => {
      dataset = data;
      downloadMerged.addEventListener("click", (e) => {
        e.preventDefault();

        window.electron.invoke(
          "saveDataset",
          { defaultPath: "authors_" + data.name + ".json" },
          JSON.stringify(authorMergeMap)
        );
      });

      authors = sortAuthors(data);

      if (data.hasOwnProperty("mergeMap")) {
        if (data.mergeMap.hasOwnProperty("authorMergeMap")) {
          authorMergeMap = data.mergeMap.authorMergeMap;
        }
      }

      document.getElementById("manualCsljsonCollections").style.display =
        "none";
      document.getElementById("manual-merge-authors").style.display = "none";

      refreshMergeMap();
    })
    .catch((err) => console.log(err));
};
