const dns = require("dns");
const availableServicesLookup = () => {
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

export { availableServicesLookup };
