//========== FLUX ==========
// Flux is PANDORÆ's data management system. It allows the user to fetch data from different sources, to send them to
// their own systems (such as Zotero), and re-download the (potentially hand-edited) data to PANDORÆ's data-management
// or visualisation systems.
//
// Flux uses two main patterns : direct retrieval and powerValve. Direct retrieval usually sends a single request
// to an external database in order to gauge the size of the response. The response metadata is then displayed for the
// user to choose whether they want to retrieve the full content of the response. If the user chooses to do so, the request
// is transmitted to the Main Process which re-dispatches it to Chæros. Some powerValve actions are simple data cleaning
// procedures. They can be instantaneous or a lot longer, depending on the size of the file being cleaned.
//
// Flux is a modal window, which means no other window should be accessible while it is active. powerValve closes Flux,
// but it could technically be reopened once Chæros is done processing the powerValve request. As it can be frustrating for // advanced user, this feature isn't currently enforced.

import { retrieveAvailableServices } from "./cascade";
import { getPassword, getUserData } from "./userdata";

window.electron.send("console-logs", "Opening Flux"); // Sending notification to console

const initializeFlux = () => {
  retrieveAvailableServices();
  getUserData();
};

export { initializeFlux };
