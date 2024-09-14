//========== biorxivBasicRetriever ==========
let bioRxivAmount = 0;
const biorxivBasicRetriever = () => {
  let endUrl =
    "%20numresults%3A1%20sort%3Apublication-date%20direction%3Adescending%20format_result%3Acondensed";
  let jcode = "%20jcode%3Abiorxiv";

  let reqURL =
    "https://www.biorxiv.org/search/" +
    document.getElementById("biorxivlocalqueryinput").value;

  if (document.getElementById("biorxiv-doi").value.length > 0) {
    reqURL =
      reqURL + "%20doi%3A" + document.getElementById("biorxiv-doi").value;
  }
  if (document.getElementById("biorxiv-author").value.length > 0) {
    reqURL =
      reqURL +
      "%20author1%3A" +
      document.getElementById("biorxiv-author").value;
  }

  reqURL =
    reqURL +
    jcode +
    "%20limit_from%3A" +
    document.getElementById("biorxiv-date-from").value +
    "%20limit_to%3A" +
    document.getElementById("biorxiv-date-to").value +
    endUrl;

  document.getElementById("biorxiv-basic-previewer").innerHTML =
    "Retrieving result amount...";

  let req = {
    type: "request",
    model: "biorxiv-amount-retriever",
    address: reqURL,
  };

  window.electron.send("biorxiv-retrieve", req);
};

ipcRenderer.on("biorxiv-retrieve", (event, message) => {
  console.log(message);
  switch (message.type) {
    case "biorxiv-amount":
      let dataBasicPreview = "Expected amount: " + message.content;

      document.getElementById("biorxiv-basic-previewer").innerHTML =
        dataBasicPreview;

      bioRxivAmount = message.content.match(/\d+/g).join("");

      document.getElementById("biorxiv-query").style.display = "block";
      break;
  }
});

export { biorxivBasicRetriever };
