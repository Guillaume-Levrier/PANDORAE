import { dnslist } from "./services/distant-services";
import { currentUser } from "./user-main";

async function getAvailableServices() {
  const dnsLocalServiceList = currentUser.localServices;

  const result = JSON.stringify({ dnslist, dnsLocalServiceList });

  return result;
}

export { getAvailableServices };
