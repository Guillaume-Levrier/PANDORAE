import { currentUser, setCurrentUser } from "./user-main";

const dns = require("dns");

const dnslist = {
  gallica: { name: "Gallica", url: "gallica.bnf.fr" },
  scopus: { name: "Scopus", url: "api.elsevier.com" },
  biorxiv: { name: "BIORXIV", url: "www.biorxiv.org" },
  zotero: { name: "Zotero", url: "api.zotero.org" },
  clintri: { name: "Clinical Trials", url: "clinicaltrials.gov" },
  regards: { name: "Regards Citoyens", url: "nosdeputes.fr" },
  wos: { name: "Web Of Science", url: "clarivate.com" },
  istex: { name: "ISTEX", url: "api.istex.fr" },
  dimensions: { name: "Dimensions", url: "app.dimensions.ai" },
  pps: {
    name: "PPS",
    url: "irit.fr",
  },
};

const availableServicesLookup = () => {
  Object.values(dnslist).forEach((d) => {
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

      writeUserIDfile(currentUser);
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

  writeUserIDfile(currentUser);
}

async function getAvailableServices() {
  const dnsLocalServiceList = currentUser.localServices;

  const result = JSON.stringify({ dnslist, dnsLocalServiceList });

  return result;
}

export {
  availableServicesLookup,
  addLocalService,
  removeLocalService,
  getAvailableServices,
};
