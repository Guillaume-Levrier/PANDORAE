console.log("|==== CHAEROS PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => ipcRenderer.send(channel, message),
  sendSync: (channel, message) => ipcRenderer.sendSync(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  chaerosCompute: (callback) =>
    ipcRenderer.on("chaerosCompute", (e, ...args) => callback(args[0])),
  getUserDetails: (callback) =>
    ipcRenderer.on("getUserDetails", (e, ...args) => callback(args[0])),
});

/* ipcRenderer.invoke("checkchaeros", true).then((result) => {
  const domainsToAllow = JSON.parse(result);

  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "default-src 'self';style-src 'unsafe-inline';connect-src ";

  // allow external API sources
  Object.values(domainsToAllow.dnslist).forEach((d) => {
    if (d.valid) {
      meta.content += "https://" + d.url + " ";
    }
  });

  // allow local API sources
  if (domainsToAllow.dnsLocalServiceList) {
    Object.values(domainsToAllow.dnsLocalServiceList).forEach((d) => {
      if (d.valid) {
        meta.content += "https://" + d.url + ":" + d.port + " ";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () =>
    document.getElementsByTagName("head")[0].append(meta)
  );
});
 */
console.log("|==== CHAEROS PRELOAD ENDS HERE ====|");
