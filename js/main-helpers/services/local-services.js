// The functions of this file are here to manage local services,
// ie services who are only accessible within the local network
// in which this instance of PANDORAE is running.
//
// It does three things:
// - on boot, read from the user config file which local services
//   are configured/could be expected to be found
// - check if a given local service is available right now
// - add a new config for a local service
//

import { currentUser, setCurrentUser, writeUserIDfile } from "../user-main";
import { mainWindow } from "../window-creator";
const dns = require("dns");

var localServices = [];
var expectedServices = 0;

const checkLocalService = (service) => {
  const location = service.serviceConfig.url.split(":");
  dns.lookupService(location[0], location[1], (err, hostname, s) => {
    console.log(location[0], location[1]);
    if (hostname || s) {
      service.valid = true;
    } else {
      service.valid = false;
    }

    localServices.push(service);

    // If we got all answers we needed
    if (localServices.length === expectedServices) propagateLocalServices();
  });
};

// For all local config files, check if the server is reacheable
// or not. Only services that are reacheable will be displayed
// for the user to select.

const checkConfiguredLocalServices = (currentUser) => {
  if (currentUser.hasOwnProperty("localServices")) {
    // Reset final values if they moved
    localServices = [];
    expectedServices = 0;

    // De facto, there are two types of local configs :
    // - the user-managed configs, usually entered by the user on
    //   PANDORAE's front-end FLUX USER tab
    // - the network-managed configs, which are usually flat JSON
    //   files stored in precise locations by the service administrators
    //   which enables them to update the service provision infrastructure
    //   without having to update each PANDORAE instance's config file.

    const localNetworkConfigs = [];

    // We are now expecting a minimum number of services
    // though the network admin configs might unpack more

    expectedServices += currentUser.localServices.length;

    currentUser.localServices.forEach((service) => {
      switch (service.serviceType) {
        // The default case being the user-managed config, we start with
        // the specific local network config.
        case "LocalNetworkConfig":
          localNetworkConfigs.push(
            fetch(service.serviceConfig.url).then((r) => r.json())
          );
          break;

        default:
          // If this is a user config, directly check its availability
          checkLocalService(service);
          break;
      }
    });

    if (localNetworkConfigs.length > 0) {
      Promise.all(localNetworkConfigs).then((configs) => {
        // add each new config from each config file
        configs.forEach((config) => (expectedServices += config.length));

        // Remove the tokens we added for all local networks
        expectedServices -= localNetworkConfigs.length;

        configs.forEach((config) => {
          config.forEach((localAdminService) =>
            checkLocalService(localAdminService)
          );
        });
      });
    }
  }
};

const propagateLocalServices = () => {
  setCurrentUser("localServices", localServices);
  mainWindow.webContents.send("userStatus", currentUser);
};

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

export { checkConfiguredLocalServices, removeLocalService, addLocalService };
