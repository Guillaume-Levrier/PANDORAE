//===== Clarivate Web of Science ======

var wosReq;

const wosBasicRetriever = () => {
  const query = document.getElementById("wosbasicqueryinput").value;

  const wosKey = getPassword(
    "WebOfScience",
    document.getElementById("userNameInput").value
  );

  const getpublishTimeSpan = () => {
    const from = document.getElementById("wos-from-date").value;
    const to = document.getElementById("wos-to-date").value;

    if (from && to) {
      return `${from}+${to}`;
    } else {
      return null;
    }
  };

  const publishTimeSpan = getpublishTimeSpan();

  wosReq = {
    databaseId: "WOK",
    lang: "en",
    usrQuery: query,
    edition: null,
    publishTimeSpan,
    //loadTimeSpan: "string",
    //createdTimeSpan: "string",
    //modifiedTimeSpan: "string",
    count: 1,
    firstRecord: 1,
    //sortField: "ASC",
    //viewField: "string",
    optionView: "FR",
    //optionOther: "string",
  };

  const apiTarget = `https://wos-api.clarivate.com/api/wos/`;

  fetch(apiTarget, {
    method: "POST",
    body: JSON.stringify(wosReq),
    headers: { "Content-Type": "application/json", "X-ApiKey": wosKey },
  })
    .then((res) => res.json())
    .then((res) => {
      const numFound = res.QueryResult.RecordsFound;
      document.getElementById(
        "wos-basic-previewer"
      ).innerHTML = `Number of records found: ${numFound}.`;
      if (numFound > 0) {
        document.getElementById("wos-query").style.display = "block";
        //powerValve
      }
    });
};
