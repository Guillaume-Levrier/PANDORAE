import { currentUser, setCurrentUser } from "./user-main";

const dns = require("dns");

const dnslist = [
  { name: "Gallica", url: "gallica.bnf.fr" },
  { name: "Scopus", url: "api.elsevier.com" },
  { name: "BIORXIV", url: "www.biorxiv.org" },
  { name: "Zotero", url: "api.zotero.org" },
  { name: "Clinical Trials", url: "clinicaltrials.gov" },
  { name: "Regards Citoyens", url: "nosdeputes.fr" },
  { name: "Web Of Science", url: "clarivate.com" },
  { name: "ISTEX", url: "api.istex.fr" },
  { name: "Dimensions", url: "app.dimensions.ai" },
  {
    name: "PPS",
    url: "irit.fr",
  },
];

const availableServicesLookup = () => {
  dnslist.forEach((d) => {
    dns.lookup(d.url, (err, address, family) => {
      if (address) {
        d.valid = true;
      } else {
        d.valid = false;
      }
    });
  });
};

async function addLocalService(message) {
  const loc = message.serviceLocation.split(":");
  dns.lookupService(loc[0], loc[1], (err, hostname, service) => {
    if (hostname || service) {
      let localServices = {};
      if (currentUser.hasOwnProperty("localServices")) {
        for (const key in currentUser.localServices) {
          localServices[key] = currentUser.localServices[key];
        }
      }

      localServices[message.serviceName] = {
        url: loc[0],
        port: loc[1],
        type: message.serviceType,
      };

      if (mesage.hasOwnProperty("serviceArkViewer")) {
        localServices[message.serviceName].arkViewer = message.serviceArkViewer;
      }

      setCurrentUser("localServices", localServices);

      writeUserIDfile(userDataPath, currentUser);
    }
  });
}

async function removeLocalService(service) {
  //delete currentUser.localServices[service];
  const localServices = {};
  for (const key in currentUser.localServices) {
    if (key != service) {
      localServices[key] = currentUser.localServices[key];
    }
  }

  setCurrentUser("localServices", localServices);

  writeUserIDfile(userDataPath, currentUser);
}

async function getAvailableFlux() {
  const dnsLocalServiceList = currentUser.localServices;

  const result = JSON.stringify({ dnslist, dnsLocalServiceList });

  return result;
}

export {
  availableServicesLookup,
  addLocalService,
  removeLocalService,
  getAvailableFlux,
};
