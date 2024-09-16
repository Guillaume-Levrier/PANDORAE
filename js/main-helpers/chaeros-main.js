import { chaerosCalculator, mainWindow } from "./window-creator";

// there is a challenge here
// so that the right process goes to the right window
// as there can be many concurrent chaeros windows

const powerValveArgsArray = [];

const startChaerosProcess = (fluxAction, fluxArgs, message) => {
  mainWindow.webContents.send("coreSignal", message);

  let powerValveAction = {};

  powerValveAction.fluxAction = fluxAction;
  powerValveAction.fluxArgs = fluxArgs;
  powerValveAction.message = message;

  powerValveArgsArray.push(powerValveAction);

  chaerosCalculator();
};

const feedChaerosData = (event) => {
  const action = powerValveArgsArray[powerValveArgsArray.length - 1];
  console.log("sending a message to chaeros compute");
  console.log(event.sender.send);
  event.sender.send("chaerosCompute", action);
};

export { startChaerosProcess, feedChaerosData };
