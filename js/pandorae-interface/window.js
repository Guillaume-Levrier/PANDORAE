// ========== WINDOW MANAGEMENT ========

const closeWindow = () =>
  window.electron.send("windowManager", "closeWindow", "index");

const refreshWindow = () => location.reload();

export { closeWindow, refreshWindow };
