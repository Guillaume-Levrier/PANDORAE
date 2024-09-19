const testingZotero = (data) => {
  data.libraries.forEach((d) => {
    const url = `https://api.zotero.org/groups/${d}/collections?v=3&key=${data.apikey}`;
    fetch(url)
      .then((r) => r.json())
      .then((r) => {
        if (parseInt(d) === parseInt(r[0].library.id)) {
          document.getElementById(d).style.backgroundColor = "green";
          document.getElementById(d).style.color = "white";
        }
      })
      .catch((e) => {
        document.getElementById(d).style.backgroundColor = "red";
        document.getElementById(d).style.color = "white";
      });
  });
};

const serviceTester = (service, serviceData) => {
  switch (service) {
    case "zotero":
      testingZotero(serviceData);
      break;

    default:
      break;
  }
};

export { serviceTester };
