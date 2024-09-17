// ========== WINDOW MANAGEMENT ========

const closeWindow = () =>
  window.electron.send("windowManager", { type: "closeWindow", file: "index" });

const refreshWindow = () => location.reload();

export { closeWindow, refreshWindow };
