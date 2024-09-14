//===== Gallica  ======
// On a given Request sent to gallica, find how many records
// are listed in the database.

const recordNum = (xml) => {
  const parser = new DOMParser(); // Gallica only yields XML, so prepare a parser
  const parseDoc = (xml) => parser.parseFromString(xml, "application/xml"); // function to parse the xml
  const doc = parseDoc(xml); // calling the function, its result is an HTML collection pointed to by the variable "doc"
  return parseInt(
    doc.getElementsByTagName("srw:numberOfRecords")[0].textContent //return the parsed content of the element containing the number of results
  );
};

const gallicaBasic = () => {
  const radioButtons = document.getElementsByClassName("gallicaDCradio");

  let selected;

  for (let i = 0; i < radioButtons.length; i++) {
    const rad = radioButtons[i];
    if (rad.checked && rad.value != "none") {
      selected = rad.value;
    }
  }

  var queryString;
  const targetExpression = document.getElementById(
    "gallicalocalqueryinput"
  ).value;

  if (selected) {
    queryString = `(dc.${selected} all '${targetExpression}')`;
  } else {
    queryString = targetExpression;
  }

  const query = `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${queryString}&startRecord=1&maximumRecords=1`;

  return fetch(query)
    .then((response) => response.text()) // parse the result as text, as the SRU only yields XML and not JSON
    .then((r) => {
      const resultDiv = document.getElementById("gallica-basic-previewer"); // find the result div
      const results = recordNum(r); // parse the text, extract the number of results,
      resultDiv.innerHTML = `This query yields ${results} results.`; // and put it in the result div.

      // Then authorize the actual collection if the number of results seems reasonable.

      const max = 5000;

      if (results < max) {
        const fullQuery = document.getElementById("gallica-full-query");
        fullQuery.style.display = "block";
      } else {
        resultDiv.innerHTML += `<br><br>You can only submit full requests that yield less than ${max} results.`;
      }
    })
    .catch(
      (e) =>
        (document.getElementById("gallica-basic-previewer").innerText =
          "Error - The SRU interface cannot make sense of this request.")
    );
};
