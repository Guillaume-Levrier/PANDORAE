//===== Regards Citoyens ======

const regardsBasic = () => {
  var queryContent = document.getElementById("regardsrecherche").value;
  const legislature = document.getElementById("legislature").value;
  var query = `https://${legislature}.nosdeputes.fr/recherche/${encodeURI(
    queryContent
  )}?format=json`;

  fetch(query)
    .then((r) => r.json())
    .then((res) => {
      let totalreq =
        parseInt(res.last_result / 500) + parseInt(res.last_result);
      var previewer = document.getElementById("regards-basic-previewer");
      previewer.innerHTML =
        "<br><p>Total document number:" +
        res.last_result +
        "</p>" +
        "<p>Necessary requests to obtain all document contents:" +
        totalreq +
        "</p>";

      document.getElementById("regards-query").style.display = "flex";

      if (totalreq === 0) {
        document.getElementById("regards-query").disabled = true;
      }
    });
};

export { regardsBasic };
