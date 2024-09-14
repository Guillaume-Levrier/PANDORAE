//========== fluxDisplay ==========
// Display relevant tab when called according to the tab's id.
const fluxDisplay = (tab) => {
  db = tab;

  let tabs = document.getElementsByClassName("fluxTabs"); // Get all content DIVs by their common class

  if (tab === "flux-manager") {
    document.getElementById("selectCascade").style.display = "block";
  } else {
    document.getElementById("selectCascade").style.display = "none";
  }

  for (let i = 0; i < tabs.length; i++) {
    // Loop on DIVs
    tabs[i].style.display = "none"; // Hide the DIVs
  }
  document.getElementById(tab).style.display = "block"; // Display the div corresponding to the clicked button
};

export { fluxDisplay };
