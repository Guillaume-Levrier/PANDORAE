// ======== GallicaFullQuery =====

const GallicaFullQuery = (targetExpression) => {
  const limiter = new bottleneck({
    maxConcurrent: 4,
    minTime: 1000,
  });

  const max = 5000;

  const recordNum = (xml) => {
    const parser = new DOMParser(); // Gallica only yields XML, so prepare a parser
    const parseDoc = (xml) => parser.parseFromString(xml, "application/xml"); // function to parse the xml
    const doc = parseDoc(xml); // calling the function, its result is an HTML collection pointed to by the variable "doc"
    return parseInt(
      doc.getElementsByTagName("srw:numberOfRecords")[0].textContent //return the parsed content of the element containing the number of results
    );
  };

  const query = `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${targetExpression}&startRecord=1&maximumRecords=1`;

  const queryManufacture = (start) =>
    `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${targetExpression}&startRecord=${start}&maximumRecords=50`;

  fetch(query)
    .then((response) => response.text()) // parse the result as text, as the SRU only yields XML and not JSON
    .then((r) => {
      const results = recordNum(r);

      if (results < max) {
        const reqNum = Math.floor(results / 50);

        var content = [];

        for (let i = 0; i <= reqNum; i++) {
          limiter
            .schedule(() => fetch(queryManufacture(50 * i)))
            .then((res) => res.text())
            .catch((err) => console.log(err))
            .then((res) => {
              window.electron.send(
                "chaeros-notification",
                `Gallica page ${i}/${reqNum}`
              );

              content = [...content, ...gallicaSRU2JSON(res)];

              if (i === reqNum) {
                window.electron.send(
                  "chaeros-notification",
                  `Gallica retrieval complete`
                );

                const finalContent = [];

                content.forEach((doc) =>
                  finalContent.push(dublinCore2csljson(doc))
                );

                const normalized = {
                  id: targetExpression + date,
                  date: date,
                  name: targetExpression,
                  content: finalContent,
                };

                pandodb.open();
                pandodb.csljson
                  .add(normalized)
                  .then(() => {
                    window.electron.send(
                      "chaeros-notification",
                      "Gallica data retrieved"
                    ); // Send a success message
                    window.electron.send("pulsar", true);
                    window.electron.send(
                      "console-logs",
                      "Successfully converted " + targetExpression
                    ); // Log success
                    setTimeout(() => {
                      window.electron.send("win-destroy", winId);
                    }, 500);
                  })
                  .catch((err) => console.log(err));

                // - end
              }
            });
        }
      }
    });
};
