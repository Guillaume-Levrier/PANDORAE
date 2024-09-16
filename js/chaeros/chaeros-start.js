// POST MAIN WORLD CREATION

import { chaerosSwitch } from "./chaeros-switch";

const startChaeros = (data) => {
  try {
    chaerosSwitch(data.fluxAction, data.fluxArgs);
  } catch (err) {
    window.electron.send("console-logs", err);
    window.electron.send("chaeros-failure", JSON.stringify(err));
  }
};

const listenForOrders = (windowID) => {
  // prepare an event listener which starts
  // computation when data comes
  window.electron.chaerosCompute((event, data) => {
    startChaeros(data);
  });

  // send the signal that chaeros is loaded and
  // ready to received data
  window.electron.send("chaeros-is-ready", "ready");
};

export { listenForOrders };
