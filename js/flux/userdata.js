const changeUserID = () => window.electron.send("change-udp", "change");

const getUserData = () => window.electron.send("getUserDetails", true);

var userData = {};

window.electron.getUserDetails((user) => (userData = user));

const updateUserData = (user) => window.electron.send("changeUser", user);

const genDate = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

export { userData, getUserData, changeUserID, updateUserData, genDate };
