const closeFluxWindow = () =>
  window.electron.send("windowManager", { type: "closeWindow", file: "flux" });

const refreshFluxWindow = () => location.reload();

export { closeFluxWindow, refreshFluxWindow };
