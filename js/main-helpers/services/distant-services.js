// The functions of this file are here to manage distant services,
// ie services who are by everyone on the internet (though a key
// might be required to retrieve information)
//
// It does three things:
// - on boot, read from the user config file which distant services
//   are configured/could be expected to be found
// - check if a given distant service is available right now
// - add a new config for a distant service
//

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

export { availableServicesLookup, dnslist };
