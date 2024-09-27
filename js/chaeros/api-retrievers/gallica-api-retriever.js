// ======== GallicaFullQuery =====

import bottleneck from "bottleneck";
import { dataWriter, genDate } from "../chaeros-to-system";

const gallicaSRU2JSON = (xml) => {
  const parser = new DOMParser();
  const parseDoc = (xml) => parser.parseFromString(xml, "application/xml");
  const docToJSON = (element) => {
    const object = {};

    for (let i = 0; i < element.children.length; ++i) {
      const child = element.children[i];
      const key = child.tagName;
      if (!object.hasOwnProperty(key)) {
        object[key] = [];
      }
      object[key].push(child.textContent);
    }

    for (const key in object) {
      object[key] = object[key].toString();
    }

    return object;
  };

  const convertElements = (elementCollection) => {
    const result = [];
    for (let i = 0; i < elementCollection.length; ++i) {
      result.push(docToJSON(elementCollection[i]));
    }

    return result;
  };

  const doc = parseDoc(xml);
  return convertElements(doc.getElementsByTagName("oai_dc:dc"));
};

const recordNum = (xml) => {
  const parser = new DOMParser(); // Gallica only yields XML, so prepare a parser
  const parseDoc = (xml) => parser.parseFromString(xml, "application/xml"); // function to parse the xml
  const doc = parseDoc(xml); // calling the function, its result is an HTML collection pointed to by the variable "doc"
  return parseInt(
    doc.getElementsByTagName("srw:numberOfRecords")[0].textContent //return the parsed content of the element containing the number of results
  );
};

const queryManufacture = (start, targetExpression) =>
  `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${targetExpression}&startRecord=${start}&maximumRecords=50`;

const limiter = new bottleneck({
  maxConcurrent: 4,
  minTime: 1000,
});

const max = 5000;

const GallicaFullQuery = (query) =>
  fetch(
    `https://gallica.bnf.fr/SRU?version=1.2&operation=searchRetrieve&query=${query}&startRecord=1&maximumRecords=1`
  )
    .then((response) => response.text()) // parse the result as text, as the SRU only yields XML and not JSON
    .then((r) => {
      const results = recordNum(r);

      if (results < max) {
        const reqNum = Math.floor(results / 50);

        var content = [];

        for (let i = 0; i <= reqNum; i++) {
          limiter
            .schedule(() => fetch(queryManufacture(50 * i, query)))
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

                const date = genDate();
                const name = query;
                const id = `${name}-${date}`;
                const dataset = {
                  id,
                  source: "gallica",
                  date,
                  name,
                  data: content,
                };

                dataWriter("flux", dataset);

                window.electron.send("win-destroy", true);
              }
            });
        }
      }
    });

export { GallicaFullQuery };
