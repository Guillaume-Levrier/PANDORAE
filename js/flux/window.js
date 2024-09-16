const closeFluxWindow = () => {
  console.log("sending message to close flux window");
  window.electron.send("windowManager", { type: "closeWindow", file: "flux" });
};

const refreshFluxWindow = () => location.reload();

export { closeFluxWindow, refreshFluxWindow };
