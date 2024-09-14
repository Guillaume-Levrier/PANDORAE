const closeWindow = () =>
  window.electron.send("windowManager", "closeWindow", "flux");

const refreshWindow = () => location.reload();

export { closeWindow, refreshWindow };
