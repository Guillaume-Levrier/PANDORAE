const serviceModels = {
  Scopus: { titre: "Scopus", description: "", fields: ["apikey"] },
  "Web Archive": {
    titre: "Web Archive",
    description: `Web archiving is the process of collecting portions of the World Wide Web, preserving the collections in an archival format, and then serving the archives for access and use. The fields below help PANDORAE connect to web archive repositories for you to build and explore corpuses.`,
    fields: ["url", "type", "arkViewer"],
  },
};

export { serviceModels };
