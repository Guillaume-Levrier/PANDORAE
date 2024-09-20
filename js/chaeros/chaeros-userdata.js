window.electron.send("getUserDetails", true);

var userData = {};

window.electron.getUserDetails((user) => (userData = user));

export { userData };
