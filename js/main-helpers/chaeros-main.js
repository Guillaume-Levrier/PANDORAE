import { chaerosCalculator, mainWindow } from "./window-creator";

// Flux requires Chaeros to do some heavy lifting
//
// The way to do that in PANDORAE is to create a chaeros calculator,
// that is a new headless context that is created for that single purpose
// and that will be destroyed after storing the result in a pandorae
// database.

const startChaerosProcess = (fluxAction, fluxArgs, message) => {
  mainWindow.webContents.send("coreSignal", message);
  const powerValveAction = { fluxAction, fluxArgs };
  chaerosCalculator(powerValveAction);
};

export { startChaerosProcess };
