// ========== WINDOW MANAGEMENT ========

const closeWindow = () =>
  window.electron.send("window-manager", "closeWindow", "index");

const refreshWindow = () => location.reload();

export { closeWindow, refreshWindow };
