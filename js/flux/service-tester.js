const testingZotero = (inputs) => {
  const targets = [];
  var apikey = "";

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    switch (input.dataset.fieldName) {
      case "library":
        targets.push(input.value);
        break;
      case "apikey":
        apikey = input.value;
        break;
      default:
        break;
    }
  }

  targets.forEach((d) => {
    const url = `https://api.zotero.org/groups/${d}/collections?v=3&key=${apikey}`;
    fetch(url)
      .then((r) => r.json())
      .then((r) => {
        if (parseInt(d) === parseInt(r[0].library.id)) {
          document.getElementById(d).previousSibling.innerText =
            r[0].library.name + " (connected)";
        }
      })
      .catch((e) => {
        document.getElementById(d).previousSibling.innerText = "Failed";
        document.getElementById(d).previousSibling.style.color = "red";
      });
  });
};

const testingWebArchive = (inputs) => {
  var url, label;

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    switch (input.dataset.fieldName) {
      case "url":
        url = input.value;
        label = input.previousSibling;
        break;
    }
  }

  fetch(`http://${url}/solr/`)
    .then((r) => {
      console.log(r);
    })
    .catch((error) => {
      label.innerText = "url (failed) :";
      label.style.color = "red";
      throw error;
    });
};

const serviceTester = (service, serviceData) => {
  switch (service) {
    case "zotero":
      testingZotero(serviceData);
      break;

    case "Web Archive":
      testingWebArchive(serviceData);
      break;

    default:
      break;
  }
};

export { serviceTester };
