//========== tweetImporter ==========

const tweetImporter = (dataset, query, name) => {
  let content = { keywords: [], path: "" };

  let id = name + date;

  fs.readFile(query, "utf8", (err, queryKeywords) => {
    if (err) throw err;

    content.keywords = JSON.parse(queryKeywords);

    let path = userDataPath + "/flatDatasets/" + name + ".csv";
    content.path = path;
    fs.copyFileSync(dataset, path);
    dataWriter(["system"], name, content);
  });
};

export { tweetImporter };
