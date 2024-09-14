//========== fluxButtonAction ==========
// fluxButtonAction makes flux button change shape on click. It takes 4 arguments:
// - buttonID is the id of the DOM input button to be modified
// - success is a boolean, true means the action succeeded, false that it failed
// - successPhrase is the string to be displayed as button value (the text of the button) if success = true
// - errorPhrase is the same thing if success = false

const fluxButtonAction = (buttonID, success, successPhrase, errorPhrase) => {
  document.getElementById(buttonID).style.transition = "all 1s ease-out"; // Animate button
  document.getElementById(buttonID).style.backgroundPosition = "left bottom"; // Move background white->black
  document.getElementById(buttonID).style.color = "white"; // Change button font color to white

  if (success) {
    // If success = true
    document.getElementById(buttonID).innerText = successPhrase; // Display success phrase
  } else {
    // If success = false
    document.getElementById(buttonID).innerText = errorPhrase; // Display error phrase
  }

  // Disable button after request to prevent external request spamming and subsequent API throttling.
  document.getElementById(buttonID).disabled = true;
};

export { fluxButtonAction };
